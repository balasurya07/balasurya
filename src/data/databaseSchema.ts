export interface SchemaTable {
  name: string;
  description: string;
  primaryKey: string;
  columns: {
    name: string;
    type: string;
    nullable: boolean;
    description: string;
    isVector?: boolean;
    isForeign?: boolean;
  }[];
  indexes: string[];
  sampleRecord: Record<string, any>;
}

export const POSTGRES_PGVECTOR_DDL = `-- ============================================================================
-- AI REAL-TIME LIFE COPILOT: PRODUCTION DATABASE SCHEMA (PostgreSQL 16 + pgvector)
-- Low-latency multi-modal ingestion, health biometrics, budget limits & vector memory
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";      -- pgvector for semantic & facial embeddings
CREATE EXTENSION IF NOT EXISTS "pg_trgm";     -- Trigram indexing for fuzzy text search
CREATE EXTENSION IF NOT EXISTS "btree_gist";  -- GiST indexing for temporal range checks

-- Clean schema namespace
CREATE SCHEMA IF NOT EXISTS copilot;
SET search_path TO copilot, public;

-- 2. Enumerations
CREATE TYPE locale_code AS ENUM ('en', 'ta', 'hi', 'es', 'de');
CREATE TYPE module_domain AS ENUM ('HEALTH', 'FINANCE', 'SOCIAL', 'SYSTEM');
CREATE TYPE urgency_level AS ENUM ('CRITICAL', 'WARNING', 'ADVISORY');
CREATE TYPE adherence_status AS ENUM ('COMPLIED', 'DISMISSED', 'IGNORED', 'PENDING');
CREATE TYPE glycemic_tier AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- ============================================================================
-- 3. Users Table (Core Profile, Baseline Biometrics & Preference Settings)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    default_locale locale_code NOT NULL DEFAULT 'en',
    auto_switch_language BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Baseline Health Thresholds (Correlated in real time against wearable telemetry)
    resting_heart_rate_bpm INT NOT NULL DEFAULT 68,
    target_max_sugar_per_meal_g DECIMAL(5,2) NOT NULL DEFAULT 25.00,
    daily_calorie_target_kcal INT NOT NULL DEFAULT 2200,
    known_allergens TEXT[] DEFAULT ARRAY['peanut', 'shellfish'],
    
    -- Baseline Financial Thresholds
    monthly_budget_currency CHAR(3) NOT NULL DEFAULT 'USD',
    monthly_discretionary_limit DECIMAL(10,2) NOT NULL DEFAULT 1500.00,
    impulse_alert_threshold_single DECIMAL(10,2) NOT NULL DEFAULT 50.00,
    
    -- System & Audio Settings
    tws_audio_urgency_filter urgency_level NOT NULL DEFAULT 'ADVISORY',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing for user lookup
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_locale ON users(default_locale);

-- ============================================================================
-- 4. DailyBudgets Table (Real-time Budget Envelopes & Geofence Watchers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS daily_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    budget_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Monetary tracking
    monthly_limit DECIMAL(10,2) NOT NULL,
    month_to_date_spent DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    daily_spend_limit DECIMAL(10,2) NOT NULL DEFAULT 50.00,
    today_spent DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    
    -- Category Allocations: {"dining": {"allocated": 300, "spent": 276}, "tech": {"allocated": 200, "spent": 195}}
    category_envelopes JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Geofence High-Risk Expense Zones (e.g., luxury malls, electronics stores)
    active_merchant_geofences JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_user_budget_date UNIQUE (user_id, budget_date)
);

CREATE INDEX idx_daily_budgets_user_date ON daily_budgets(user_id, budget_date);
CREATE INDEX idx_daily_budgets_envelopes_gin ON daily_budgets USING gin (category_envelopes);

-- ============================================================================
-- 5. HealthLogs Table (Continuous Wearable Sync + Food Recognition Ingestion)
-- ============================================================================
CREATE TABLE IF NOT EXISTS health_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Live Wearable Telemetry (from TWS earbuds / smartwatch / continuous monitor)
    heart_rate_bpm INT NOT NULL,
    heart_rate_variability_ms INT,
    blood_oxygen_spo2 DECIMAL(4,1),
    estimated_blood_glucose_mgdl DECIMAL(5,1),
    sleep_score_prev_night INT, -- 0 to 100
    stress_index INT,           -- 0 to 100
    
    -- Computer Vision Food & Drink Recognition
    food_item_detected VARCHAR(255),
    estimated_calories INT,
    sugar_grams DECIMAL(5,2),
    carbs_grams DECIMAL(5,2),
    protein_grams DECIMAL(5,2),
    fat_grams DECIMAL(5,2),
    glycemic_index glycemic_tier DEFAULT 'MEDIUM',
    
    -- Risk Evaluation
    correlation_risk_score DECIMAL(4,2), -- 0.00 to 1.00 normalized hazard
    triggered_intervention_code VARCHAR(80),
    audio_warning_spoken TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast temporal query index for health correlation
CREATE INDEX idx_health_logs_user_time ON health_logs(user_id, recorded_at DESC);
CREATE INDEX idx_health_logs_glycemic ON health_logs(glycemic_index);

-- ============================================================================
-- 6. SocialContacts Table (Face Embeddings via pgvector & Semantic Memory)
-- ============================================================================
CREATE TABLE IF NOT EXISTS social_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact_name VARCHAR(150) NOT NULL,
    relationship_tier VARCHAR(50) NOT NULL DEFAULT 'Professional', -- Family, Colleague, Client, Friend
    organization_role VARCHAR(150),
    
    -- Vector embedding (512-dim ArcFace / ResNet, or 1536-dim text/multimodal embedding)
    face_embedding vector(512),
    semantic_context_embedding vector(1536),
    
    -- Contextual recall notes
    contextual_summary TEXT,
    last_interaction_notes TEXT,
    talking_points TEXT[] DEFAULT ARRAY[]::TEXT[],
    shared_interests TEXT[] DEFAULT ARRAY[]::TEXT[],
    unresolved_promises TEXT,
    
    -- Encounter metadata
    interaction_count INT NOT NULL DEFAULT 1,
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_location_name VARCHAR(200),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HNSW Vector Index for Sub-Millisecond Facial Matching (Cosine distance: <=>)
CREATE INDEX idx_social_face_embedding ON social_contacts 
USING hnsw (face_embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- HNSW Vector Index for Semantic Contextual Search
CREATE INDEX idx_social_semantic_embedding ON social_contacts 
USING hnsw (semantic_context_embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_social_contacts_user ON social_contacts(user_id);
CREATE INDEX idx_social_contacts_name ON social_contacts(user_id, contact_name);

-- ============================================================================
-- 7. InterventionsAudit Table (Telemetric Verification of Dispatched Audio Warnings)
-- ============================================================================
CREATE TABLE IF NOT EXISTS interventions_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module module_domain NOT NULL,
    urgency urgency_level NOT NULL,
    
    -- Triggering context
    trigger_code VARCHAR(100) NOT NULL,
    audio_transcript TEXT NOT NULL,
    spoken_language locale_code NOT NULL,
    
    -- Multimodal snapshot metadata
    detected_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- User feedback / Adherence tracking
    user_adherence adherence_status NOT NULL DEFAULT 'PENDING',
    end_to_end_latency_ms INT NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_interventions_audit_user_module ON interventions_audit(user_id, module, created_at DESC);
CREATE INDEX idx_interventions_latency ON interventions_audit(end_to_end_latency_ms);

-- ============================================================================
-- 8. Triggers & Auto-Update Procedures
-- ============================================================================
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER trg_daily_budgets_updated_at BEFORE UPDATE ON daily_budgets
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER trg_social_contacts_updated_at BEFORE UPDATE ON social_contacts
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
`;

export const SCHEMA_TABLES: SchemaTable[] = [
  {
    name: 'users',
    description: 'Core user profiles, health baselines (resting HR, max sugar tolerance), budget limits, and default locale.',
    primaryKey: 'id (UUID)',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, description: 'Primary key with uuid_generate_v4()' },
      { name: 'email', type: 'VARCHAR(255)', nullable: false, description: 'Unique user email address' },
      { name: 'full_name', type: 'VARCHAR(120)', nullable: false, description: 'Full user legal name' },
      { name: 'default_locale', type: 'locale_code', nullable: false, description: 'User preferred language (en, ta, hi, es, de)' },
      { name: 'auto_switch_language', type: 'BOOLEAN', nullable: false, description: 'Toggle auto-language detection from spoken audio / OCR' },
      { name: 'resting_heart_rate_bpm', type: 'INT', nullable: false, description: 'Baseline resting heart rate (e.g. 68 BPM)' },
      { name: 'target_max_sugar_per_meal_g', type: 'DECIMAL(5,2)', nullable: false, description: 'Max recommended sugar in grams per meal (e.g. 25.00g)' },
      { name: 'daily_calorie_target_kcal', type: 'INT', nullable: false, description: 'Daily metabolic calorie budget' },
      { name: 'monthly_discretionary_limit', type: 'DECIMAL(10,2)', nullable: false, description: 'Monthly discretionary spending budget' },
      { name: 'impulse_alert_threshold_single', type: 'DECIMAL(10,2)', nullable: false, description: 'Instant single transaction threshold triggering audio check' },
    ],
    indexes: ['idx_users_email (UNIQUE)', 'idx_users_locale'],
    sampleRecord: {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      email: 'user@ambientcopilot.ai',
      full_name: 'Alex Vance',
      default_locale: 'en',
      resting_heart_rate_bpm: 66,
      target_max_sugar_per_meal_g: 22.0,
      monthly_discretionary_limit: 1500.0,
    },
  },
  {
    name: 'daily_budgets',
    description: 'Dynamic budget tracking, monthly-to-date accruals, and active merchant geofences for preemptive audio warnings.',
    primaryKey: 'id (UUID)',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, description: 'Primary key' },
      { name: 'user_id', type: 'UUID', nullable: false, isForeign: true, description: 'References users(id)' },
      { name: 'budget_date', type: 'DATE', nullable: false, description: 'Active accounting date' },
      { name: 'monthly_limit', type: 'DECIMAL(10,2)', nullable: false, description: 'Monthly limit ceiling' },
      { name: 'month_to_date_spent', type: 'DECIMAL(10,2)', nullable: false, description: 'Cumulative expenditure this month' },
      { name: 'today_spent', type: 'DECIMAL(10,2)', nullable: false, description: 'Spent today across all channels' },
      { name: 'category_envelopes', type: 'JSONB', nullable: false, description: 'Envelope breakdowns: dining, electronics, groceries' },
      { name: 'active_merchant_geofences', type: 'JSONB', nullable: false, description: 'High-risk retail zones and coordinate polygons' },
    ],
    indexes: ['idx_daily_budgets_user_date (UNIQUE)', 'idx_daily_budgets_envelopes_gin (GIN)'],
    sampleRecord: {
      id: 'b123bc99-9c0b-4ef8-bb6d-6bb9bd380b22',
      monthly_limit: 1500.0,
      month_to_date_spent: 1415.01,
      today_spent: 42.5,
      category_envelopes: { dining: { allocated: 300, spent: 285 }, tech: { allocated: 200, spent: 195 } },
    },
  },
  {
    name: 'health_logs',
    description: 'High-frequency telemetry correlating real-time camera food recognition with wearable biometrics (HR, HRV, sleep).',
    primaryKey: 'id (UUID)',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, description: 'Primary key' },
      { name: 'user_id', type: 'UUID', nullable: false, isForeign: true, description: 'References users(id)' },
      { name: 'recorded_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Timestamp of capture' },
      { name: 'heart_rate_bpm', type: 'INT', nullable: false, description: 'Wearable sensor pulse reading' },
      { name: 'heart_rate_variability_ms', type: 'INT', nullable: true, description: 'Autonomic nervous system recovery indicator' },
      { name: 'sleep_score_prev_night', type: 'INT', nullable: true, description: 'Sleep quality score (0-100)' },
      { name: 'food_item_detected', type: 'VARCHAR(255)', nullable: true, description: 'Computer vision food identification' },
      { name: 'estimated_calories', type: 'INT', nullable: true, description: 'Computed nutritional energy' },
      { name: 'sugar_grams', type: 'DECIMAL(5,2)', nullable: true, description: 'Estimated simple sugars' },
      { name: 'glycemic_index', type: 'glycemic_tier', nullable: true, description: 'Glycemic impact: LOW, MEDIUM, HIGH' },
      { name: 'audio_warning_spoken', type: 'TEXT', nullable: true, description: 'Exact audio prompt transmitted to TWS earbud' },
    ],
    indexes: ['idx_health_logs_user_time (DESC)', 'idx_health_logs_glycemic'],
    sampleRecord: {
      id: 'c456bc99-9c0b-4ef8-bb6d-6bb9bd380c33',
      heart_rate_bpm: 104,
      sleep_score_prev_night: 58,
      food_item_detected: 'Double Glazed Donut & Caramel Macchiato',
      sugar_grams: 42.0,
      glycemic_index: 'HIGH',
      audio_warning_spoken: 'High sugar alert. Heart rate elevated at 104 BPM.',
    },
  },
  {
    name: 'social_contacts',
    description: 'Contextual memory extension featuring 512-dim ArcFace facial vector embeddings and semantic interaction history.',
    primaryKey: 'id (UUID)',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, description: 'Primary key' },
      { name: 'user_id', type: 'UUID', nullable: false, isForeign: true, description: 'References users(id)' },
      { name: 'contact_name', type: 'VARCHAR(150)', nullable: false, description: 'Recognized contact full name' },
      { name: 'organization_role', type: 'VARCHAR(150)', nullable: true, description: 'Role or institutional affiliation' },
      { name: 'face_embedding', type: 'vector(512)', nullable: true, isVector: true, description: 'Normalized 512-D facial feature embedding vector' },
      { name: 'semantic_context_embedding', type: 'vector(1536)', nullable: true, isVector: true, description: '1536-D embedding of past conversation history' },
      { name: 'contextual_summary', type: 'TEXT', nullable: true, description: 'Concise background notes overlaid on HUD' },
      { name: 'talking_points', type: 'TEXT[]', nullable: true, description: 'Recommended topics to mention' },
      { name: 'last_seen_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Last encounter timestamp' },
    ],
    indexes: [
      'idx_social_face_embedding (HNSW cosine ops m=16 ef_construction=64)',
      'idx_social_semantic_embedding (HNSW cosine ops)',
    ],
    sampleRecord: {
      id: 'd789bc99-9c0b-4ef8-bb6d-6bb9bd380d44',
      contact_name: 'Dr. Rajesh Ramanathan',
      organization_role: 'VP of AI Research, NeuralDynamics',
      face_embedding: '[0.0412, -0.1984, 0.8231, ..., -0.0129] (512-dim)',
      contextual_summary: 'Discussed Edge-LLM optimization. Mentioned daughter Maya at Stanford.',
      talking_points: ['Ask about recent keynote at NeurIPS', 'Follow up on joint research grant proposal'],
    },
  },
];
