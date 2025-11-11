-- Migration: Create test user
-- Description: Creates a test user with email 10xdevs@mailinator.com and password 10Xdevs!

-- Enable pgcrypto extension for password hashing in the extensions schema
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;

-- Create the test user in auth.users with all required fields
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    aud,
    role,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmation_token,
    email_change_token_new,
    recovery_token,
    email_change,
    email_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
) VALUES (
    '6d229373-47dc-4cf4-b4d5-b4f9fc266311'::uuid,
    '00000000-0000-0000-0000-000000000000',
    '10xdevs@mailinator.com',
    extensions.crypt('10Xdevs!ABC', extensions.gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated',
    '{}',
    '{}',
    false,
    '',
    '',
    '',
    '',
    null,
    '',
    0,
    null,
    '',
    null,
    false,
    null
)
ON CONFLICT (id) DO NOTHING;

-- Create identity for the user (email provider)
INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
) VALUES (
    '6d229373-47dc-4cf4-b4d5-b4f9fc266311'::uuid,
    '6d229373-47dc-4cf4-b4d5-b4f9fc266311'::uuid,
    '6d229373-47dc-4cf4-b4d5-b4f9fc266311',
    jsonb_build_object(
        'sub', '6d229373-47dc-4cf4-b4d5-b4f9fc266311',
        'email', '10xdevs@mailinator.com',
        'email_verified', true
    ),
    'email',
    now(),
    now(),
    now()
)
ON CONFLICT (provider, provider_id) DO NOTHING;

-- The profile will be created automatically by the trigger handle_new_user()
