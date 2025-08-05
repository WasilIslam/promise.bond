-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table to store different domains
CREATE TABLE organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    domain VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    password_hash VARCHAR(255), -- For email/password auth
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    google_id VARCHAR(255), -- For Google OAuth
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Crushes table to store user's crush selections
CREATE TABLE crushes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    crush_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure user can't crush on themselves
    CONSTRAINT no_self_crush CHECK (user_id != crush_user_id),
    -- Ensure unique crush per user
    CONSTRAINT unique_user_crush UNIQUE (user_id, crush_user_id)
);

-- Matches table to store mutual crushes
CREATE TABLE matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure user1_id < user2_id to avoid duplicates
    CONSTRAINT ordered_users CHECK (user1_id < user2_id),
    CONSTRAINT unique_match UNIQUE (user1_id, user2_id)
);

-- Audit log for security
CREATE TABLE audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_crushes_user ON crushes(user_id);
CREATE INDEX idx_crushes_crush_user ON crushes(crush_user_id);
CREATE INDEX idx_matches_users ON matches(user1_id, user2_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Functions to handle updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_organizations_updated_at 
    BEFORE UPDATE ON organizations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create match when mutual crush is detected
CREATE OR REPLACE FUNCTION check_mutual_crush()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the crush is mutual
    IF EXISTS (
        SELECT 1 FROM crushes 
        WHERE user_id = NEW.crush_user_id 
        AND crush_user_id = NEW.user_id
    ) THEN
        -- Create a match with ordered user IDs
        INSERT INTO matches (user1_id, user2_id)
        SELECT 
            LEAST(NEW.user_id, NEW.crush_user_id),
            GREATEST(NEW.user_id, NEW.crush_user_id)
        ON CONFLICT (user1_id, user2_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to check for mutual crushes
CREATE TRIGGER check_mutual_crush_trigger
    AFTER INSERT ON crushes
    FOR EACH ROW EXECUTE FUNCTION check_mutual_crush();

-- Function to limit crushes per user (max 4)
CREATE OR REPLACE FUNCTION check_crush_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM crushes WHERE user_id = NEW.user_id) >= 4 THEN
        RAISE EXCEPTION 'Maximum of 4 crushes allowed per user';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to limit crushes
CREATE TRIGGER check_crush_limit_trigger
    BEFORE INSERT ON crushes
    FOR EACH ROW EXECUTE FUNCTION check_crush_limit();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE crushes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Users can view other users in same organization (for crush selection)
CREATE POLICY "Users can view organization members" ON users
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM users WHERE id::text = auth.uid()::text
        )
    );

-- Crushes policies
CREATE POLICY "Users can view own crushes" ON crushes
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can insert own crushes" ON crushes
    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete own crushes" ON crushes
    FOR DELETE USING (user_id::text = auth.uid()::text);

-- Matches policies
CREATE POLICY "Users can view own matches" ON matches
    FOR SELECT USING (
        user1_id::text = auth.uid()::text OR user2_id::text = auth.uid()::text
    );

-- Organizations are readable by all authenticated users
CREATE POLICY "Organizations are viewable by authenticated users" ON organizations
    FOR SELECT USING (auth.role() = 'authenticated');

-- Sample data for testing
INSERT INTO organizations (domain, name) VALUES 
    ('lhr.nu.edu.pk', 'NU Lahore'),
    ('gmail.com', 'Gmail Users'),
    ('outlook.com', 'Outlook Users');

-- Note: Replace auth.uid() with your actual authentication system if not using Supabase Auth 