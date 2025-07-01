import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "../db";
import { user } from "../db/schema/auth";
import { subscription as subscriptionTable } from "../db/schema/subscription";
import { testimonial as testimonialTable } from "../db/schema/testimonial";
import { pricings } from "../lib/data/pricings";
import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { tryCatch } from "../lib/try-catch";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: "This is private",
			user: ctx.session.user,
		};
	}),
	getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id;

		const { data: subscriptions, error } = await tryCatch(
			db
				.select()
				.from(subscriptionTable)
				.where(eq(subscriptionTable.userId, userId))
				.orderBy(desc(subscriptionTable.createdAt))
				.limit(1),
		);
		if (error) {
			console.error("Error fetching subscription:", error);
			throw new Error("Failed to fetch subscription");
		}

		const subscription = subscriptions[0];

		return {
			subscription,
		};
	}),
	getHistoricalSubscriptions: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id;

		// const subscriptions = await db
		//   .select()
		//   .from(subscriptionTable)
		//   .where(eq(subscriptionTable.userId, userId))
		//   .orderBy(desc(subscriptionTable.createdAt));

		const { data: subscriptions, error: fetchSubscriptionsErr } =
			await tryCatch(
				db
					.select()
					.from(subscriptionTable)
					.where(eq(subscriptionTable.userId, userId))
					.orderBy(desc(subscriptionTable.createdAt)),
			);
		if (fetchSubscriptionsErr) {
			console.error("Error fetching subscriptions:", fetchSubscriptionsErr);
			throw new Error("Failed to fetch subscriptions");
		}

		const subscriptionIds = subscriptions.map((sub) => sub.id);
		const { data: testimonials, error: fetchTestimonialsErr } = await tryCatch(
			db
				.select()
				.from(testimonialTable)
				.where(
					and(
						eq(testimonialTable.userId, userId),
						inArray(testimonialTable.subscriptionId, subscriptionIds),
					),
				),
		);
		if (fetchTestimonialsErr) {
			console.error("Error fetching testimonials:", fetchTestimonialsErr);
			throw new Error("Failed to fetch testimonials");
		}

		type SubscriptionWithTestimonials = (typeof subscriptions)[0] & {
			testimonial: {
				stars: number;
				content: string;
			} | null;
		};

		const subscriptionsWithTestimonials: SubscriptionWithTestimonials[] =
			subscriptions.map((sub) => {
				const testimonial = testimonials.find(
					(t) => t.subscriptionId === sub.id,
				);

				return {
					...sub,
					testimonial: testimonial
						? {
								stars: testimonial.rating,
								content: testimonial.content,
							}
						: null,
				};
			});

		return {
			subscriptions: subscriptionsWithTestimonials,
		};
	}),
	subscribe: protectedProcedure
		.input(
			z.object({
				fullName: z.string().min(1, "Full name is required"),
				phone: z
					.string()
					.min(1, "Phone number is required")
					.regex(/^\d{10,15}$/, "Invalid phone number format"),
				selectedPlan: z.number().min(1, "Please select a meal plan"),
				mealTypes: z
					.array(z.number())
					.min(1, "Please select at least one meal type"),
				deliveryDays: z
					.array(z.number())
					.min(1, "Please select at least one delivery day"),
				allergies: z.array(z.string()).optional(),
				dietaryRestrictions: z.array(z.number()).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			const plan = pricings.find((p) => p.idx === input.selectedPlan);
			if (!plan) {
				throw new Error("Invalid meal plan selected");
			}

			const totalPrice = Math.round(
				plan.price * input.mealTypes.length * input.deliveryDays.length * 4.3,
			);

			const newSubscription = {
				fullName: input.fullName,
				phone: input.phone,
				mealTypes: input.mealTypes,
				deliveryDays: input.deliveryDays,
				allergies: input.allergies,
				dietaryRestrictions: input.dietaryRestrictions,
				userId: userId,
				plan: input.selectedPlan,
				totalPrice: totalPrice,
			};

			const { data: insertedSubscription, error } = await tryCatch(
				db.insert(subscriptionTable).values(newSubscription).returning(),
			);
			if (error) {
				console.error("Error inserting subscription:", error);
				throw new Error("Failed to create subscription");
			}

			return {
				subscription: insertedSubscription,
				message: "Subscription created successfully",
			};
		}),
	pauseSubscription: protectedProcedure
		.input(
			z.object({
				subscriptionId: z.uuid(),
				pausedFrom: z.string(),
				pausedTo: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;
			const { subscriptionId, pausedFrom, pausedTo } = input;

			const { data: subscriptions, error: fetchSubscriptionErr } =
				await tryCatch(
					db
						.select()
						.from(subscriptionTable)
						.where(
							and(
								eq(subscriptionTable.id, subscriptionId),
								eq(subscriptionTable.userId, userId),
							),
						)
						.limit(1),
				);
			if (fetchSubscriptionErr) {
				console.error("Error fetching subscription:", fetchSubscriptionErr);
				throw new Error("Failed to fetch subscription");
			}

			const subscription = subscriptions[0];

			if (!subscription) {
				throw new Error("Subscription not found");
			}

			const updatedSubscription = {
				pausedFrom: new Date(pausedFrom),
				pausedTo: new Date(pausedTo),
			};

			const { data: updated, error: updateSubscriptionErr } = await tryCatch(
				db
					.update(subscriptionTable)
					.set(updatedSubscription)
					.where(eq(subscriptionTable.id, subscriptionId))
					.returning(),
			);
			if (updateSubscriptionErr) {
				console.error("Error updating subscription:", updateSubscriptionErr);
				throw new Error("Failed to pause subscription");
			}

			if (!updated) {
				throw new Error("Failed to pause subscription");
			}

			return {
				subscription: updated,
				message: "Subscription paused successfully",
			};
		}),
	resumeSubscription: protectedProcedure
		.input(
			z.object({
				subscriptionId: z.uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;
			const { subscriptionId } = input;

			const { data: subscriptions, error: fetchSubscriptionErr } =
				await tryCatch(
					db
						.select()
						.from(subscriptionTable)
						.where(
							and(
								eq(subscriptionTable.id, subscriptionId),
								eq(subscriptionTable.userId, userId),
							),
						)
						.limit(1),
				);
			if (fetchSubscriptionErr) {
				console.error("Error fetching subscription:", fetchSubscriptionErr);
				throw new Error("Failed to fetch subscription");
			}
			const subscription = subscriptions[0];

			if (!subscription) {
				throw new Error("Subscription not found");
			}

			const updatedSubscription = {
				pausedFrom: null,
				pausedTo: null,
			};

			const { data: updated, error: updateSubscriptionErr } = await tryCatch(
				db
					.update(subscriptionTable)
					.set(updatedSubscription)
					.where(eq(subscriptionTable.id, subscriptionId))
					.returning(),
			);
			if (updateSubscriptionErr) {
				console.error("Error updating subscription:", updateSubscriptionErr);
				throw new Error("Failed to resume subscription");
			}

			if (!updated) {
				throw new Error("Failed to resume subscription");
			}

			return {
				subscription: updated,
				message: "Subscription resumed successfully",
			};
		}),
	cancelSubscription: protectedProcedure
		.input(
			z.object({
				subscriptionId: z.uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;
			const { subscriptionId } = input;
			const { data: subscriptions, error: fetchSubscriptionErr } =
				await tryCatch(
					db
						.select()
						.from(subscriptionTable)
						.where(
							and(
								eq(subscriptionTable.id, subscriptionId),
								eq(subscriptionTable.userId, userId),
							),
						)
						.limit(1),
				);
			if (fetchSubscriptionErr) {
				console.error("Error fetching subscription:", fetchSubscriptionErr);
				throw new Error("Failed to fetch subscription");
			}
			const subscription = subscriptions[0];
			if (!subscription) {
				throw new Error("Subscription not found");
			}
			// Soft delete the subscription by setting deletedAt
			const updatedSubscription = {
				deletedAt: new Date(),
			};
			const { data: updated, error: updateSubscriptionErr } = await tryCatch(
				db
					.update(subscriptionTable)
					.set(updatedSubscription)
					.where(eq(subscriptionTable.id, subscriptionId))
					.returning(),
			);
			if (updateSubscriptionErr) {
				console.error("Error updating subscription:", updateSubscriptionErr);
				throw new Error("Failed to cancel subscription");
			}
			if (!updated) {
				throw new Error("Failed to cancel subscription");
			}

			return {
				message: "Subscription cancelled successfully",
			};
		}),
	getTestimonials: publicProcedure.query(async () => {
		const { data: testimonials, error } = await tryCatch(
			db
				.select()
				.from(testimonialTable)
				.leftJoin(user, eq(testimonialTable.userId, user.id))
				.orderBy(desc(testimonialTable.createdAt)),
		);
		if (error) {
			console.error("Error fetching testimonials:", error);
			throw new Error("Failed to fetch testimonials");
		}

		return {
			testimonials,
		};
	}),
	createTestimonial: protectedProcedure
		.input(
			z.object({
				content: z.string().min(1, "Content is required"),
				stars: z
					.number()
					.min(1, "Star rating is required")
					.max(5, "Max 5 stars"),
				subscriptionId: z.string().uuid("Invalid subscription ID"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;
			const { content, stars, subscriptionId } = input;

			// Check if subscription exists
			const { data: subscriptions, error: fetchSubscriptionErr } =
				await tryCatch(
					db
						.select()
						.from(subscriptionTable)
						.where(
							and(
								eq(subscriptionTable.id, subscriptionId),
								eq(subscriptionTable.userId, userId),
							),
						)
						.limit(1),
				);
			if (fetchSubscriptionErr) {
				console.error("Error fetching subscription:", fetchSubscriptionErr);
				throw new Error("Failed to fetch subscription");
			}
			const subscription = subscriptions[0];

			if (!subscription) {
				throw new Error("Subscription not found");
			}

			// Create testimonial
			const testimonial = {
				content,
				rating: stars,
				subscriptionId,
				userId,
			};

			const { data: insertedTestimonial, error: insertTestimonialErr } =
				await tryCatch(
					db.insert(testimonialTable).values(testimonial).returning(),
				);
			if (insertTestimonialErr) {
				console.error("Error inserting testimonial:", insertTestimonialErr);
				throw new Error("Failed to create testimonial");
			}
			if (!insertedTestimonial) {
				throw new Error("Failed to create testimonial");
			}

			return {
				message: "Testimonial created successfully",
			};
		}),
	getMetrics: protectedProcedure
		.input(
			z.object({
				startDate: z.string().optional(),
				endDate: z.string().optional(),
			}),
		)
		.query(async () => {
			return {
				newSubscriptions: Math.floor(Math.random() * 100),
				monthlyRevenue: Math.floor(Math.random() * 1000000),
				reactivations: Math.floor(Math.random() * 50),
				activeSubscriptions: Math.floor(Math.random() * 500),
			};
		}),
	getSubscriptionGrowth: protectedProcedure
		.input(
			z.object({
				startDate: z.string().optional(),
				endDate: z.string().optional(),
			}),
		)
		.query(async () => {
			return {
				subscriptionGrowth: [
					{ month: "January", count: Math.floor(Math.random() * 100) },
					{ month: "February", count: Math.floor(Math.random() * 100) },
					{ month: "March", count: Math.floor(Math.random() * 100) },
					{ month: "April", count: Math.floor(Math.random() * 100) },
					{ month: "May", count: Math.floor(Math.random() * 100) },
					{ month: "June", count: Math.floor(Math.random() * 100) },
				],
			};
		}),
});
export type AppRouter = typeof appRouter;
