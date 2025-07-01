import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "../db";
import { user } from "../db/schema/auth";
import { subscription as subscriptionTable } from "../db/schema/subscription";
import { testimonial as testimonialTable } from "../db/schema/testimonial";
import { pricings } from "../lib/data/pricings";
import { protectedProcedure, publicProcedure, router } from "../lib/trpc";

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

		const [subscription] = await db
			.select()
			.from(subscriptionTable)
			.where(eq(subscriptionTable.userId, userId))
			.orderBy(desc(subscriptionTable.createdAt))
			.limit(1);

		return {
			subscription,
		};
	}),
	getHistoricalSubscriptions: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id;

		const subscriptions = await db
			.select()
			.from(subscriptionTable)
			.where(eq(subscriptionTable.userId, userId))
			.orderBy(desc(subscriptionTable.createdAt));

		const subscriptionIds = subscriptions.map((sub) => sub.id);
		const testimonials = await db
			.select()
			.from(testimonialTable)
			.where(
				and(
					eq(testimonialTable.userId, userId),
					inArray(testimonialTable.subscriptionId, subscriptionIds),
				),
			);

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

			const [insertedSubscription] = await db
				.insert(subscriptionTable)
				.values(newSubscription)
				.returning();

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

			const [subscription] = await db
				.select()
				.from(subscriptionTable)
				.where(
					and(
						eq(subscriptionTable.id, subscriptionId),
						eq(subscriptionTable.userId, userId),
					),
				)
				.limit(1);

			if (!subscription) {
				throw new Error("Subscription not found");
			}

			const updatedSubscription = {
				pausedFrom: new Date(pausedFrom),
				pausedTo: new Date(pausedTo),
			};

			const [updated] = await db
				.update(subscriptionTable)
				.set(updatedSubscription)
				.where(eq(subscriptionTable.id, subscriptionId))
				.returning();

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

			const [subscription] = await db
				.select()
				.from(subscriptionTable)
				.where(
					and(
						eq(subscriptionTable.id, subscriptionId),
						eq(subscriptionTable.userId, userId),
					),
				)
				.limit(1);

			if (!subscription) {
				throw new Error("Subscription not found");
			}

			const updatedSubscription = {
				pausedFrom: null,
				pausedTo: null,
			};

			const [updated] = await db
				.update(subscriptionTable)
				.set(updatedSubscription)
				.where(eq(subscriptionTable.id, subscriptionId))
				.returning();

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
			const [subscription] = await db
				.select()
				.from(subscriptionTable)
				.where(
					and(
						eq(subscriptionTable.id, subscriptionId),
						eq(subscriptionTable.userId, userId),
					),
				)
				.limit(1);
			if (!subscription) {
				throw new Error("Subscription not found");
			}
			await db
				.update(subscriptionTable)
				.set({
					deletedAt: new Date(),
				})
				.where(
					and(
						eq(subscriptionTable.id, subscriptionId),
						eq(subscriptionTable.userId, userId),
					),
				);
			return {
				message: "Subscription cancelled successfully",
			};
		}),
	getTestimonials: publicProcedure.query(async () => {
		const testimonials = await db
			.select()
			.from(testimonialTable)
			.leftJoin(user, eq(testimonialTable.userId, user.id))
			.orderBy(desc(testimonialTable.createdAt));

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
			const [subscription] = await db
				.select()
				.from(subscriptionTable)
				.where(eq(subscriptionTable.id, subscriptionId))
				.limit(1);

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

			await db.insert(testimonialTable).values(testimonial);

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
