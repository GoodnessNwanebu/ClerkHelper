-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create diagnoses table
CREATE TABLE IF NOT EXISTS diagnoses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    synonyms TEXT[],
    specialty TEXT NOT NULL,
    icd10 TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster searching
CREATE INDEX IF NOT EXISTS idx_diagnoses_name ON diagnoses USING GIN (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_diagnoses_specialty ON diagnoses (specialty);

-- Create history_templates table
CREATE TABLE IF NOT EXISTS history_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diagnosis_id UUID REFERENCES diagnoses(id) ON DELETE SET NULL,
    diagnosis_name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    sections JSONB NOT NULL,
    generated_by TEXT CHECK (generated_by IN ('llm', 'manual')) DEFAULT 'llm',
    llm_model TEXT,
    cached BOOLEAN DEFAULT FALSE,
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_history_templates_diagnosis_name ON history_templates (diagnosis_name);
CREATE INDEX IF NOT EXISTS idx_history_templates_specialty ON history_templates (specialty);
CREATE INDEX IF NOT EXISTS idx_history_templates_cached ON history_templates (cached);
CREATE INDEX IF NOT EXISTS idx_history_templates_access_count ON history_templates (access_count DESC);

-- Function to increment template access count
CREATE OR REPLACE FUNCTION increment_template_access(template_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE history_templates 
    SET 
        access_count = access_count + 1,
        last_accessed = TIMEZONE('utc', NOW()),
        updated_at = TIMEZONE('utc', NOW())
    WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update timestamp on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_diagnoses_updated_at
    BEFORE UPDATE ON diagnoses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_history_templates_updated_at
    BEFORE UPDATE ON history_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample diagnoses (you can expand this list)
INSERT INTO diagnoses (name, synonyms, specialty, icd10) VALUES
    ('Acute Appendicitis', ARRAY['appendicitis', 'acute appendicitis'], 'Surgery', 'K35.9'),
    ('Myocardial Infarction', ARRAY['heart attack', 'MI', 'STEMI', 'NSTEMI'], 'Cardiology', 'I21.9'),
    ('Pneumonia', ARRAY['lung infection', 'pneumonic infection'], 'Internal Medicine', 'J18.9'),
    ('Diabetes Mellitus Type 2', ARRAY['diabetes', 'T2DM', 'type 2 diabetes'], 'Endocrinology', 'E11.9'),
    ('Hypertension', ARRAY['high blood pressure', 'HTN'], 'Internal Medicine', 'I10'),
    ('Asthma', ARRAY['bronchial asthma'], 'Pulmonology', 'J45.9'),
    ('Gastroenteritis', ARRAY['stomach flu', 'gastro'], 'Gastroenterology', 'K59.1'),
    ('Urinary Tract Infection', ARRAY['UTI', 'bladder infection'], 'Internal Medicine', 'N39.0'),
    ('Migraine', ARRAY['migraine headache'], 'Neurology', 'G43.9'),
    ('Depression', ARRAY['major depression', 'clinical depression'], 'Psychiatry', 'F32.9'),
    ('Acute Coronary Syndrome', ARRAY['ACS', 'heart attack'], 'Cardiology', 'I24.9'),
    ('Stroke', ARRAY['cerebrovascular accident', 'CVA'], 'Neurology', 'I64'),
    ('Chronic Kidney Disease', ARRAY['CKD', 'kidney disease'], 'Nephrology', 'N18.9'),
    ('Heart Failure', ARRAY['cardiac failure', 'CHF'], 'Cardiology', 'I50.9'),
    ('COPD', ARRAY['chronic obstructive pulmonary disease', 'emphysema'], 'Pulmonology', 'J44.1')
ON CONFLICT DO NOTHING;

-- Create RLS (Row Level Security) policies if needed for future user authentication
-- For now, we'll keep it simple and allow public access to read operations

-- Grant permissions for the service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Grant read permissions for anon role (for public access)
GRANT SELECT ON diagnoses TO anon;
GRANT SELECT ON history_templates TO anon;
GRANT EXECUTE ON FUNCTION increment_template_access(UUID) TO anon; 