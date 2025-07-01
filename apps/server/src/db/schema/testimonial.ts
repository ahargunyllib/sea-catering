import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { subscription } from "./subscription";

export const testimonial = pgTable("testimonial", {
	id: uuid("id").primaryKey().defaultRandom(),
	content: text("content").notNull(),
	rating: integer("rating").notNull(),
	subscriptionId: uuid("subscription_id")
		.notNull()
		.references(() => subscription.id, { onDelete: "cascade" }),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow(),
});
