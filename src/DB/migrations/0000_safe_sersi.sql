CREATE TABLE "collage" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "collage_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(25) NOT NULL,
	"city" varchar(25) NOT NULL,
	"domain" varchar(25) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"product_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(25) NOT NULL,
	"category" varchar(25) NOT NULL,
	"user_id" integer NOT NULL,
	"price" integer NOT NULL,
	"collage_id" integer NOT NULL,
	"productDetail" varchar(225) NOT NULL,
	"isAvailable" boolean NOT NULL,
	"status" varchar(10) NOT NULL,
	"images" varchar(225) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(25) NOT NULL,
	"email" varchar(25) NOT NULL,
	"mobile" varchar(10) NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"batch" integer NOT NULL,
	"collage_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_mobile_unique" UNIQUE("mobile"),
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_collage_id_collage_id_fk" FOREIGN KEY ("collage_id") REFERENCES "public"."collage"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_collage_id_collage_id_fk" FOREIGN KEY ("collage_id") REFERENCES "public"."collage"("id") ON DELETE no action ON UPDATE no action;