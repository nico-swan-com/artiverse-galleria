CREATE TABLE "artiverse"."order_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" varchar(50) NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"status" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "artiverse"."order_events" ADD CONSTRAINT "order_events_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "artiverse"."orders"("id") ON DELETE no action ON UPDATE no action;