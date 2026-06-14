ALTER TABLE "collage" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "collage" CASCADE;--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "collage_id" TO "collage_name";--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_collage_id_collage_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_collage_id_collage_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "name" SET DATA TYPE varchar(55);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "category" SET DATA TYPE varchar(55);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "images" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "images" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE varchar(55);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "mobile" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "clerk_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "batch" SET DATA TYPE varchar(15);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "batch" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "collageName" varchar(125);--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "collage_id";