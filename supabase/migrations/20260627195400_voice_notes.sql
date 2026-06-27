-- Migration to add Voice Note features to ideas table and setup Storage

-- 1. Add new columns to ideas table
ALTER TABLE public.ideas
ADD COLUMN audio_url TEXT,
ADD COLUMN duration INTEGER,
ADD COLUMN original_transcript TEXT;

-- 2. Create Storage Bucket for Voice Notes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'voice-notes',
    'voice-notes',
    false, -- Private bucket
    15728640, -- 15MB limit
    ARRAY['audio/webm', 'audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/ogg', 'audio/webm;codecs=opus']
) ON CONFLICT (id) DO UPDATE SET
    public = false,
    allowed_mime_types = ARRAY['audio/webm', 'audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/ogg', 'audio/webm;codecs=opus'];

-- 3. Storage Bucket Policies
-- Allow authenticated users to upload their own voice notes
CREATE POLICY "Users can upload their own voice notes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'voice-notes' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to view their own voice notes
CREATE POLICY "Users can view their own voice notes"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'voice-notes' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own voice notes
CREATE POLICY "Users can delete their own voice notes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'voice-notes' AND
    (storage.foldername(name))[1] = auth.uid()::text
);
