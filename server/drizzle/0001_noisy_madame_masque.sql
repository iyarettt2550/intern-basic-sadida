ALTER TABLE "users" DROP CONSTRAINT "users_phone_key";--> statement-breakpoint
ALTER TABLE "product" DROP CONSTRAINT "product_prodetail_id_fkey";
--> statement-breakpoint
ALTER TABLE "product" DROP CONSTRAINT "product_category_id_fkey";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_user_roles_id_fkey";
--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_prodetail_id_product_detail_prodetail_id_fk" FOREIGN KEY ("prodetail_id") REFERENCES "public"."product_detail"("prodetail_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_roles_id_user_roles_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("user_roles_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_phone_unique" UNIQUE("phone");