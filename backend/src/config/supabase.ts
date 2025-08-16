import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Environment variables validation
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing SUPABASE_ANON_KEY environment variable');
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_KEY environment variable');
}

// Create Supabase clients
// Regular client for user operations (respects RLS)
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false, // Server-side doesn't need session persistence
  },
});

// Service role client for admin operations (bypasses RLS)
export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database configuration
export const dbConfig = {
  // Connection settings
  maxConnections: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  
  // Query settings
  defaultLimit: 50,
  maxLimit: 1000,
  
  // Pagination
  defaultPage: 1,
  defaultPageSize: 20,
  
  // File upload settings
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/json',
    'application/zip',
  ],
  
  // Storage buckets
  buckets: {
    evidence: 'incident-evidence',
    avatars: 'user-avatars',
    reports: 'incident-reports',
  },
};

// Helper function to get user client with JWT token
export const getUserSupabaseClient = (jwt: string): SupabaseClient => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase Error:', error);
  
  // Map common Supabase errors to user-friendly messages
  const errorMap: Record<string, string> = {
    'duplicate key value violates unique constraint': 'This record already exists',
    'invalid input syntax': 'Invalid data format',
    'permission denied': 'You do not have permission to perform this action',
    'row-level security policy violation': 'Access denied',
    'foreign key constraint': 'Cannot delete record due to related data',
  };
  
  const errorMessage = error?.message || error?.details || 'An unexpected error occurred';
  
  // Check for known error patterns
  for (const [pattern, friendlyMessage] of Object.entries(errorMap)) {
    if (errorMessage.toLowerCase().includes(pattern.toLowerCase())) {
      return {
        code: error?.code || 'DATABASE_ERROR',
        message: friendlyMessage,
        details: errorMessage,
      };
    }
  }
  
  return {
    code: error?.code || 'UNKNOWN_ERROR',
    message: errorMessage,
    details: error?.details || null,
  };
};

// Database health check
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
};

// Initialize storage buckets (run once during setup)
export const initializeStorageBuckets = async () => {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const existingBuckets = buckets?.map(b => b.name) || [];
    
    for (const [key, bucketName] of Object.entries(dbConfig.buckets)) {
      if (!existingBuckets.includes(bucketName)) {
        const { error } = await supabaseAdmin.storage.createBucket(bucketName, {
          public: false, // Private by default
          allowedMimeTypes: dbConfig.allowedFileTypes,
          fileSizeLimit: dbConfig.maxFileSize,
        });
        
        if (error) {
          console.error(`Failed to create bucket ${bucketName}:`, error);
        } else {
          console.log(`Created storage bucket: ${bucketName}`);
        }
      }
    }
  } catch (error) {
    console.error('Error initializing storage buckets:', error);
  }
};

export default supabase;
