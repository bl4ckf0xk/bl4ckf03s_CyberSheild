import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

// Extend Request interface to include timing and request ID
declare global {
  namespace Express {
    interface Request {
      requestId: string;
      startTime: number;
    }
  }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Generate unique request ID
  req.requestId = uuidv4();
  req.startTime = Date.now();

  // Add request ID to response headers
  res.setHeader('X-Request-ID', req.requestId);

  // Log incoming request
  const requestInfo = {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    contentLength: req.get('Content-Length') || 0,
    timestamp: new Date().toISOString(),
  };

  // Don't log sensitive information
  const sanitizedBody = { ...req.body };
  if (sanitizedBody.password) {
    sanitizedBody.password = '[REDACTED]';
  }
  if (sanitizedBody.token) {
    sanitizedBody.token = '[REDACTED]';
  }

  logger.http('Incoming request', {
    ...requestInfo,
    query: req.query,
    body: Object.keys(sanitizedBody).length > 0 ? sanitizedBody : undefined,
    headers: {
      authorization: req.get('Authorization') ? '[REDACTED]' : undefined,
      'content-type': req.get('Content-Type'),
      accept: req.get('Accept'),
    },
  });

  // Capture the original res.end method
  const originalEnd = res.end;

  // Override res.end to log response
  res.end = function(chunk?: any, encoding?: any): void {
    const responseTime = Date.now() - req.startTime;
    
    const responseInfo = {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      contentLength: res.get('Content-Length') || 0,
      timestamp: new Date().toISOString(),
    };

    // Log response based on status code
    if (res.statusCode >= 500) {
      logger.error('Response', responseInfo);
    } else if (res.statusCode >= 400) {
      logger.warn('Response', responseInfo);
    } else {
      logger.http('Response', responseInfo);
    }

    // Call the original end method
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Middleware to track API usage statistics
interface ApiStats {
  totalRequests: number;
  requestsByMethod: Record<string, number>;
  requestsByEndpoint: Record<string, number>;
  requestsByStatusCode: Record<string, number>;
  averageResponseTime: number;
  totalResponseTime: number;
  slowestEndpoints: Array<{endpoint: string; avgTime: number; count: number}>;
}

class ApiStatsTracker {
  private stats: ApiStats = {
    totalRequests: 0,
    requestsByMethod: {},
    requestsByEndpoint: {},
    requestsByStatusCode: {},
    averageResponseTime: 0,
    totalResponseTime: 0,
    slowestEndpoints: [],
  };

  private endpointTimes: Record<string, {total: number; count: number}> = {};

  public trackRequest(method: string, endpoint: string, statusCode: number, responseTime: number): void {
    this.stats.totalRequests++;
    
    // Track by method
    this.stats.requestsByMethod[method] = (this.stats.requestsByMethod[method] || 0) + 1;
    
    // Track by endpoint (normalize similar endpoints)
    const normalizedEndpoint = this.normalizeEndpoint(endpoint);
    this.stats.requestsByEndpoint[normalizedEndpoint] = 
      (this.stats.requestsByEndpoint[normalizedEndpoint] || 0) + 1;
    
    // Track by status code
    this.stats.requestsByStatusCode[statusCode.toString()] = 
      (this.stats.requestsByStatusCode[statusCode.toString()] || 0) + 1;
    
    // Track response times
    this.stats.totalResponseTime += responseTime;
    this.stats.averageResponseTime = this.stats.totalResponseTime / this.stats.totalRequests;
    
    // Track endpoint response times
    if (!this.endpointTimes[normalizedEndpoint]) {
      this.endpointTimes[normalizedEndpoint] = {total: 0, count: 0};
    }
    this.endpointTimes[normalizedEndpoint].total += responseTime;
    this.endpointTimes[normalizedEndpoint].count++;
    
    // Update slowest endpoints
    this.updateSlowestEndpoints();
  }

  private normalizeEndpoint(endpoint: string): string {
    // Replace UUIDs and numeric IDs with placeholders
    return endpoint
      .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi, '/:id')
      .replace(/\/\d+/g, '/:id');
  }

  private updateSlowestEndpoints(): void {
    const endpointAvgs = Object.entries(this.endpointTimes)
      .map(([endpoint, times]) => ({
        endpoint,
        avgTime: times.total / times.count,
        count: times.count,
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 10);
    
    this.stats.slowestEndpoints = endpointAvgs;
  }

  public getStats(): ApiStats {
    return { ...this.stats };
  }

  public resetStats(): void {
    this.stats = {
      totalRequests: 0,
      requestsByMethod: {},
      requestsByEndpoint: {},
      requestsByStatusCode: {},
      averageResponseTime: 0,
      totalResponseTime: 0,
      slowestEndpoints: [],
    };
    this.endpointTimes = {};
  }
}

// Global stats tracker instance
export const apiStatsTracker = new ApiStatsTracker();

// Enhanced request logger with stats tracking
export const requestLoggerWithStats = (req: Request, res: Response, next: NextFunction): void => {
  // Generate unique request ID
  req.requestId = uuidv4();
  req.startTime = Date.now();

  // Add request ID to response headers
  res.setHeader('X-Request-ID', req.requestId);

  // Capture the original res.end method
  const originalEnd = res.end;

  // Override res.end to log response and track stats
  res.end = function(chunk?: any, encoding?: any): void {
    const responseTime = Date.now() - req.startTime;
    
    // Track API statistics
    apiStatsTracker.trackRequest(req.method, req.originalUrl, res.statusCode, responseTime);
    
    const responseInfo = {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      contentLength: res.get('Content-Length') || 0,
      timestamp: new Date().toISOString(),
    };

    // Log response based on status code
    if (res.statusCode >= 500) {
      logger.error('Response', responseInfo);
    } else if (res.statusCode >= 400) {
      logger.warn('Response', responseInfo);
    } else {
      logger.http('Response', responseInfo);
    }

    // Log slow requests (>1 second)
    if (responseTime > 1000) {
      logger.warn('Slow request detected', {
        ...responseInfo,
        responseTimeMs: responseTime,
      });
    }

    // Call the original end method
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

export default requestLogger;
