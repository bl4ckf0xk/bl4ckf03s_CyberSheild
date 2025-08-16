-- CyberShield Database Schema for Supabase
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE incident_status AS ENUM ('pending', 'reviewing', 'resolved', 'forwarded_to_le', 'closed');
CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'emergency');
CREATE TYPE incident_category AS ENUM ('phishing', 'malware', 'ransomware', 'data_breach', 'identity_theft', 'financial_fraud', 'social_engineering', 'other');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'user',
  phone VARCHAR(50),
  organization VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Admin users table (additional admin-specific fields)
CREATE TABLE public.admin_users (
  id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  badge_number VARCHAR(50) UNIQUE NOT NULL,
  department VARCHAR(255) DEFAULT 'Cybercrime Unit',
  clearance_level INTEGER DEFAULT 1,
  supervisor_id UUID REFERENCES public.admin_users(id),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Incidents table
CREATE TABLE public.incidents (
  id UUID DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  category incident_category NOT NULL,
  severity incident_severity NOT NULL DEFAULT 'low',
  status incident_status NOT NULL DEFAULT 'pending',
  
  -- User information
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Admin fields
  assigned_to UUID REFERENCES public.admin_users(id),
  admin_notes TEXT,
  law_enforcement_ref VARCHAR(100),
  forwarded_at TIMESTAMP WITH TIME ZONE,
  last_updated_by UUID REFERENCES public.users(id),
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Evidence and attachments
  evidence_files JSONB DEFAULT '[]',
  
  -- Location and technical details
  ip_address INET,
  user_agent TEXT,
  location JSONB,
  
  -- Timestamps
  incident_date TIMESTAMP WITH TIME ZONE,
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  PRIMARY KEY (id)
);

-- Incident updates/history table
CREATE TABLE public.incident_updates (
  id UUID DEFAULT uuid_generate_v4(),
  incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE,
  updated_by UUID REFERENCES public.users(id),
  old_status incident_status,
  new_status incident_status,
  update_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Law enforcement cases table
CREATE TABLE public.law_enforcement_cases (
  id UUID DEFAULT uuid_generate_v4(),
  incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE,
  reference_number VARCHAR(100) UNIQUE NOT NULL,
  agency_name VARCHAR(255) NOT NULL,
  officer_contact JSONB, -- {name, email, phone, badge}
  case_status VARCHAR(50) DEFAULT 'submitted',
  priority_level INTEGER DEFAULT 3, -- 1=highest, 5=lowest
  forwarded_by UUID REFERENCES public.admin_users(id),
  forwarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_contact TIMESTAMP WITH TIME ZONE,
  case_notes TEXT,
  PRIMARY KEY (id)
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- info, warning, success, error
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Audit logs table
CREATE TABLE public.audit_logs (
  id UUID DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL, -- incident, user, admin_action
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create indexes for better performance
CREATE INDEX idx_incidents_user_id ON public.incidents(user_id);
CREATE INDEX idx_incidents_status ON public.incidents(status);
CREATE INDEX idx_incidents_severity ON public.incidents(severity);
CREATE INDEX idx_incidents_assigned_to ON public.incidents(assigned_to);
CREATE INDEX idx_incidents_reported_at ON public.incidents(reported_at);
CREATE INDEX idx_incident_updates_incident_id ON public.incident_updates(incident_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON public.incidents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.law_enforcement_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can see and update their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Incidents policies
CREATE POLICY "Users can view own incidents" ON public.incidents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create incidents" ON public.incidents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own incidents" ON public.incidents
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (admins can see all incidents)
CREATE POLICY "Admins can view all incidents" ON public.incidents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update any incident" ON public.incidents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to log incident updates
CREATE OR REPLACE FUNCTION log_incident_update()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO public.incident_updates (
      incident_id, updated_by, old_status, new_status, update_notes
    ) VALUES (
      NEW.id, NEW.last_updated_by, OLD.status, NEW.status, NEW.admin_notes
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for incident updates
CREATE TRIGGER incident_status_change_log
  AFTER UPDATE ON public.incidents
  FOR EACH ROW EXECUTE FUNCTION log_incident_update();
