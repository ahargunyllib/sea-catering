import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const subscription = pgTable("subscription", {
	id: uuid("id").primaryKey().defaultRandom(),
	fullName: text("full_name").notNull(),
	phone: text("phone").notNull(),
	plan: integer("plan").notNull(),
	mealTypes: integer("meal_types").array().notNull(),
	deliveryDays: integer("delivery_days").array().notNull(),
	totalPrice: integer("total_price").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	pausedFrom: timestamp("paused_from"),
	pausedTo: timestamp("paused_to"),
	allergies: text("allergies").array().default([]),
	dietaryRestrictions: integer("dietary_restrictions").array().default([]),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	deletedAt: timestamp("deleted_at"),
});
