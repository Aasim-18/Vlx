CREATE TABLE "usersProfile" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(55) NOT NULL,
	"mobile" varchar(10) NOT NULL,
	"batch" varchar(15) NOT NULL,
	"collage_name" varchar(125) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usersProfile_mobile_unique" UNIQUE("mobile")
);
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_mobile_unique";--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "clerk_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "usersProfile" ADD CONSTRAINT "usersProfile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "product_title_unique" ON "products" USING btree ("name","user_id");--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "product_id";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "isAvailable";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "mobile";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "batch";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "collage_name";