CREATE SCHEMA "artiverse";
--> statement-breakpoint
CREATE TABLE "artiverse"."artists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"image" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"styles" text[] DEFAULT '{}'::text[] NOT NULL,
	"biography" text NOT NULL,
	"specialization" varchar NOT NULL,
	"location" varchar NOT NULL,
	"email" varchar NOT NULL,
	"website" varchar,
	"exhibitions" text[] DEFAULT '{}'::text[] NOT NULL,
	"statement" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "artiverse"."media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"mime_type" varchar(50) NOT NULL,
	"file_size" integer NOT NULL,
	"data" "bytea" NOT NULL,
	"alt_text" varchar(255),
	"content_hash" varchar(64),
	"tags" text[] DEFAULT ARRAY[]::text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artiverse"."products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku" serial NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"stock" integer NOT NULL,
	"feature_image" text,
	"images" text[],
	"sales" numeric(10, 2) NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"product_type" varchar(50) DEFAULT 'physical' NOT NULL,
	"category" varchar(50) NOT NULL,
	"artist_id" uuid,
	"year_created" integer,
	"medium" varchar(100),
	"dimensions" varchar(100),
	"weight" varchar(50),
	"style" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "artiverse"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"name" varchar NOT NULL,
	"avatar" text,
	"password" varchar NOT NULL,
	"role" varchar DEFAULT 'Client' NOT NULL,
	"status" varchar DEFAULT 'Pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "artiverse"."products" ADD CONSTRAINT "products_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "artiverse"."artists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "products_sku_key" ON "artiverse"."products" USING btree ("sku");