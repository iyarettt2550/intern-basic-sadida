-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations

CREATE TABLE "contacts" (
	"contacts_id" varchar(50) PRIMARY KEY NOT NULL,
	"contacts_name" varchar(100) NOT NULL,
	"email" varchar(25) NOT NULL,
	"phone" varchar(10) NOT NULL,
	"subject" varchar(50) NOT NULL,
	"contacts_message" varchar(200) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"user_roles_id" varchar(5) PRIMARY KEY NOT NULL,
	"user_roles_name" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_detail" (
	"prodetail_id" varchar(12) PRIMARY KEY NOT NULL,
	"prodetail_size" varchar(10) NOT NULL,
	"price" double precision NOT NULL
);

--> statement-breakpoint
CREATE TABLE "product" (
	"pro_id" varchar(20) PRIMARY KEY NOT NULL,
	"pro_name" varchar(50) NOT NULL,
	"description" varchar(100) NOT NULL,	
	"img" varchar(200) NOT NULL,
	"price" double NOT NULL,
	"category_id" varchar(10) NOT NULL	
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"category_id" varchar(6) PRIMARY KEY NOT NULL,
	"pro_id" varchar(20) NOT NULL,
	"category_name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"users_id" varchar(50) PRIMARY KEY NOT NULL,
	"users_name" varchar(100) NOT NULL,
	"phone" varchar(10) NOT NULL,
	"password_hash" varchar(50) NOT NULL,
	"user_roles_id" varchar(5) NOT NULL,
	CONSTRAINT "users_phone_key" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_prodetail_id_fkey" FOREIGN KEY ("prodetail_id") REFERENCES "public"."product_detail"("prodetail_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_roles_id_fkey" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("user_roles_id") ON DELETE no action ON UPDATE no action;
