-- Migration: Website Settings, Contacts Status, and Schema Enhancements

-- 1. Contacts enhancements
ALTER TABLE "contacts" ALTER COLUMN "email" TYPE varchar(255);
ALTER TABLE "contacts" ALTER COLUMN "contacts_message" TYPE text;
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "status" varchar(20) DEFAULT 'unread' NOT NULL;
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone DEFAULT now();

-- 2. Product enhancements
ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone DEFAULT now();
ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now();

-- 3. Website settings table
CREATE TABLE IF NOT EXISTS "website_settings" (
  "id" varchar(50) PRIMARY KEY DEFAULT 'default',
  "brand_name" varchar(100),
  "brand_tagline" varchar(255),
  "brand_logo" text,
  "footer_about" text,
  "top_notice" varchar(255),
  "show_top_notice" boolean DEFAULT false,
  "config_json" text NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now()
);

-- 4. Unique constraints on category_name
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'categories_category_name_unique'
  ) THEN
    ALTER TABLE "categories" ADD CONSTRAINT "categories_category_name_unique" UNIQUE ("category_name");
  END IF;
END $$;

