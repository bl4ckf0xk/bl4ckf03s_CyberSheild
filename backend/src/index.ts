import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Import configurations and middleware
import { checkDatabaseConnection, initializeStorageBuckets } from './config/supabase';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Import routes
import authRoutes from './routes/auth';
import incidentRoutes from './routes/incidents';
import adminRoutes from './routes/admin';
import userRoutes from './routes/users';
import notificationRoutes from './routes/notifications';

// Load environment variables
dotenv.config();

class CyberShieldServer {
  public app: Application;
  public server: any;
  public io: SocketIOServer;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000');
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: process.env.FRONTEND_URL || '*',
        methods: ['GET', 'POST'],
      },
    });

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSocketIO();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL || ''] 
        : true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
      message: {
        error: 'Too many requests from this IP, please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use(requestLogger);

    // Health check endpoint
    this.app.get('/health', this.healthCheck);
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/incidents', incidentRoutes);
    this.app.use('/api/admin', adminRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/notifications', notificationRoutes);

    // Root endpoint
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        message: 'CyberShield API Server',
        version: '1.0.0',
        status: 'running',
        documentation: '/api/docs',
        health: '/health',
      });
    });

    // API documentation endpoint
    this.app.get('/api/docs', (req: Request, res: Response) => {
      res.json({
        title: 'CyberShield API Documentation',
        version: '1.0.0',
        description: 'Incident reporting and management system API',
        endpoints: {
          auth: {
            'POST /api/auth/login': 'User login',
            'POST /api/auth/register': 'User registration',
            'POST /api/auth/admin/login': 'Admin login',
            'POST /api/auth/logout': 'Logout',
            'POST /api/auth/refresh': 'Refresh JWT token',
          },
          incidents: {
            'GET /api/incidents': 'List user incidents',
            'POST /api/incidents': 'Create new incident',
            'GET /api/incidents/:id': 'Get incident details',
            'PUT /api/incidents/:id': 'Update incident',
            'POST /api/incidents/:id/escalate': 'Escalate incident',
          },
          admin: {
            'GET /api/admin/dashboard': 'Admin dashboard stats',
            'GET /api/admin/incidents': 'List all incidents',
            'PUT /api/admin/incidents/:id/status': 'Update incident status',
            'POST /api/admin/incidents/:id/forward-le': 'Forward to law enforcement',
            'GET /api/admin/law-enforcement': 'Law enforcement cases',
            'PUT /api/admin/law-enforcement/:id/status': 'Update LE case status',
          },
          users: {
            'GET /api/users/profile': 'Get user profile',
            'PUT /api/users/profile': 'Update user profile',
          },
          notifications: {
            'GET /api/notifications': 'List user notifications',
            'PUT /api/notifications/:id/read': 'Mark notification as read',
          },
        },
      });
    });

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        error: 'Endpoint not found',
        message: `The requested endpoint ${req.originalUrl} does not exist`,
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private initializeSocketIO(): void {
    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);

      // Join user to their personal notification room
      socket.on('join', (data) => {
        if (data.userId) {
          socket.join(`user_${data.userId}`);
          logger.info(`User ${data.userId} joined their room`);
        }
        
        if (data.adminId) {
          socket.join('admin_room');
          logger.info(`Admin ${data.adminId} joined admin room`);
        }
      });

      // Handle incident updates
      socket.on('incident_update', (data) => {
        // Broadcast to admin room
        socket.to('admin_room').emit('incident_updated', data);
        
        // Notify specific user if incident belongs to them
        if (data.userId) {
          socket.to(`user_${data.userId}`).emit('incident_status_changed', data);
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }

  private healthCheck = async (req: Request, res: Response): Promise<void> => {
    try {
      const dbConnected = await checkDatabaseConnection();
      const uptime = process.uptime();
      const memoryUsage = process.memoryUsage();
      
      const healthStatus = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime / 60)} minutes`,
        version: '1.0.0',
        database: {
          connected: dbConnected,
          status: dbConnected ? 'healthy' : 'unhealthy',
        },
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
          external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB',
        },
        environment: process.env.NODE_ENV || 'development',
      };

      const statusCode = dbConnected ? 200 : 503;
      res.status(statusCode).json(healthStatus);
    } catch (error) {
      logger.error('Health check failed:', error);
      res.status(503).json({
        status: 'error',
        message: 'Health check failed',
        timestamp: new Date().toISOString(),
      });
    }
  };

  public async start(): Promise<void> {
    try {
      // Initialize database and storage
      logger.info('Initializing database connection...');
      const dbConnected = await checkDatabaseConnection();
      
      if (!dbConnected) {
        throw new Error('Failed to connect to database');
      }

      logger.info('Initializing storage buckets...');
      await initializeStorageBuckets();

      // Start server
      this.server.listen(this.port, () => {
        logger.info(`🚀 CyberShield API Server running on port ${this.port}`);
        logger.info(`📚 API Documentation: http://localhost:${this.port}/api/docs`);
        logger.info(`🏥 Health Check: http://localhost:${this.port}/health`);
        logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      });

      // Graceful shutdown handling
      process.on('SIGTERM', this.gracefulShutdown);
      process.on('SIGINT', this.gracefulShutdown);
      
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private gracefulShutdown = async (signal: string): Promise<void> => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    this.server.close((err: Error) => {
      if (err) {
        logger.error('Error during server shutdown:', err);
        process.exit(1);
      }
      
      logger.info('Server shut down successfully');
      process.exit(0);
    });
  };
}

// Start the server
const server = new CyberShieldServer();
server.start().catch((error) => {
  logger.error('Failed to start CyberShield server:', error);
  process.exit(1);
});

export default server;
