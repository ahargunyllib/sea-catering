import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/shared/components/ui/form";
import { Textarea } from "@/shared/components/ui/textarea";
import { MealTypes } from "@/shared/data/meal-types";
import { pricings } from "@/shared/data/pricings";
import { WeekDays } from "@/shared/data/week-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, PauseIcon, PlayIcon, Star, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/shared/components/ui/tooltip";

const EditTestimonalSchema = z.object({
	stars: z.number().min(1).max(5),
	content: z.string().min(1).max(500),
});

type EditTestimonialRequest = z.infer<typeof EditTestimonalSchema>;

export default function OverviewSection() {
	const [subscription] = useState<{
		plan: number;
		mealTypes: number[];
		deliveryDays: number[];
		totalPrice: number;
		createdAt: string;
		pausedFrom: string | null;
		pausedTo: string | null;
	} | null>({
		plan: 1,
		mealTypes: [1, 2, 3],
		deliveryDays: [1, 2, 3, 4, 5, 6, 7, 8],
		totalPrice: 40000,
		createdAt: "2025-06-30T00:00:00Z",
		pausedFrom: null,
		pausedTo: null,
	});

	const [historySubscription] = useState([
		{
			id: 1,
			plan: 1,
			mealTypes: [1, 2, 3],
			deliveryDays: [1, 2, 3, 4, 5, 6],
			totalPrice: 1720000,
			testimonial: {
				stars: 5,
				content: "Great service and delicious meals!",
			},
			date: "2025-06-30T00:00:00Z",
		},
		{
			id: 2,
			plan: 2,
			mealTypes: [2, 3],
			deliveryDays: [1, 3, 5],
			totalPrice: 600000,
			testimonial: null,
			date: "2025-07-01T00:00:00Z",
		},
		{
			id: 3,
			plan: 3,
			mealTypes: [1, 2],
			deliveryDays: [2, 4, 6],
			totalPrice: 800000,
			testimonial: {
				stars: 4,
				content: "The meals are healthy and filling.",
			},
			date: "2025-07-12T00:00:00Z",
		},
	]);

	const plan = useMemo(() => {
		return pricings.find((p) => p.idx === subscription?.plan);
	}, [subscription]);

	const mealTypes = useMemo(() => {
		return MealTypes.filter((type) =>
			subscription?.mealTypes.includes(type.idx),
		);
	}, [subscription]);

	const deliveryDays = useMemo(() => {
		return WeekDays.filter((day) =>
			subscription?.deliveryDays.includes(day.idx),
		).map((day) => day.name);
	}, [subscription]);

	const nextDeliveryDate = useMemo(() => {
		const today = new Date();
		const todayIdx = today.getDay();

		// find next delivery day
		const deliveryDayIdx = subscription?.deliveryDays.find(
			(day) => day > todayIdx,
		);
		if (deliveryDayIdx) {
			const deliveryDate = new Date();
			deliveryDate.setDate(today.getDate() + (deliveryDayIdx - todayIdx));
			return deliveryDate;
		}

		return undefined;
	}, [subscription]);

	const isPaused = useMemo(() => {
		if (!subscription) return false;
		if (!subscription.pausedFrom || !subscription.pausedTo) return false;

		const pausedFrom = new Date(subscription.pausedFrom);
		const pausedTo = new Date(subscription.pausedTo);
		const now = new Date();

		return now >= pausedFrom && now <= pausedTo;
	}, [subscription]);

	return (
		<div className="mx-auto max-w-4xl space-y-6">
			{/* Active Subscription Card */}
			<Card className="border-green-200 bg-green-50">
				<CardHeader>
					<div className="flex items-start justify-between">
						<div>
							<CardTitle className="text-green-800">
								Active Subscription
							</CardTitle>
							<CardDescription>Your current meal plan details</CardDescription>
						</div>
						<div className="flex flex-row items-center gap-4">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="destructive" size="icon">
										<Trash2Icon />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p className="text-sm">Cancel Subscription</p>
								</TooltipContent>
							</Tooltip>
							{isPaused ? (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="outline" size="icon">
											<PlayIcon />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p className="text-sm">Resume Subscription</p>
									</TooltipContent>
								</Tooltip>
							) : (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="outline" size="icon">
											<PauseIcon />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p className="text-sm">Pause Subscription</p>
									</TooltipContent>
								</Tooltip>
							)}
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-6 md:grid-cols-2">
						<div className="space-y-3">
							<div>
								<span className="font-medium text-gray-700">Plan:</span>
								<p className="font-semibold text-green-800 text-lg">
									{plan?.name || "No active plan"}
								</p>
							</div>

							<div>
								<span className="font-medium text-gray-700">Meal Types:</span>
								<div className="mt-1 flex gap-2">
									{mealTypes.length === 0 && (
										<Badge className="bg-gray-200 text-gray-600">
											No meal types selected
										</Badge>
									)}
									{mealTypes.map((meal) => (
										<Badge key={meal.idx}>{meal.name}</Badge>
									))}
								</div>
							</div>

							<div>
								<span className="font-medium text-gray-700">
									Delivery Days:
								</span>
								<p className="mt-1 text-gray-600 text-sm">
									{deliveryDays.length === 0 && "No delivery days selected"}
									{deliveryDays.join(", ")}
								</p>
							</div>
						</div>

						<div className="space-y-3">
							{nextDeliveryDate && (
								<div>
									<span className="font-medium text-gray-700">
										Next Delivery:
									</span>

									{subscription && isPaused && subscription.pausedTo ? (
										<p className="flex items-center gap-2 font-semibold text-lg text-red-600">
											Paused until{" "}
											{new Date(subscription.pausedTo).toLocaleDateString(
												"id-ID",
												{
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric",
												},
											)}
										</p>
									) : (
										<p className="flex items-center gap-2 font-semibold text-lg">
											<Calendar className="h-4 w-4" />
											{!nextDeliveryDate && "No upcoming deliveries"}
											{nextDeliveryDate.toLocaleDateString("id-ID", {
												weekday: "long",
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</p>
									)}
								</div>
							)}

							<div>
								<span className="font-medium text-gray-700">Total Price</span>
								<p className="font-bold text-2xl text-green-600">
									Rp {subscription?.totalPrice.toLocaleString() || "-"}
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Recent Activity */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Activity</CardTitle>
					<CardDescription>Your subscription history</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{historySubscription.length === 0 && (
							<p className="text-center text-muted-foreground">
								No subscription history available.
							</p>
						)}
						{historySubscription.map((history) => (
							<HistorySubscriptionDialog key={history.id} history={history} />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export function HistorySubscriptionDialog({
	history,
}: {
	history: {
		id: number;
		plan: number;
		mealTypes: number[];
		deliveryDays: number[];
		totalPrice: number;
		testimonial: {
			stars: number;
			content: string;
		} | null;
		date: string;
	};
}) {
	const form = useForm<EditTestimonialRequest>({
		resolver: zodResolver(EditTestimonalSchema),
		defaultValues: {
			stars: history.testimonial?.stars || 0,
			content: history.testimonial?.content || "",
		},
	});

	const onSubmitHandler = form.handleSubmit((data) => {
		// Handle testimonial submission logic here
		console.log("Testimonial submitted:", data);
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="flex items-center justify-between border-b py-2">
					<div className="space-y-2">
						<p className="font-medium">
							{pricings.find((type) => type.idx === history.plan)?.name}
						</p>
						<div className="flex flex-row items-center gap-2">
							{history.mealTypes.map((type) => (
								<Badge key={type}>
									{MealTypes.find((m) => m.idx === type)?.name}
								</Badge>
							))}
						</div>
						<div className="flex flex-row items-center gap-2">
							{history.deliveryDays.map((day) => (
								<Badge key={day}>
									{WeekDays.find((w) => w.idx === day)?.name}
								</Badge>
							))}
						</div>
						<p className="text-muted-foreground text-sm">
							Total Price: Rp {history.totalPrice.toLocaleString()}
						</p>
					</div>
					<span className="text-muted-foreground text-sm">
						{new Date(history.date).toLocaleDateString("id-ID", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</span>
				</div>
			</DialogTrigger>
			<DialogContent>
				<Form {...form}>
					<form onSubmit={onSubmitHandler} className="space-y-6">
						<DialogHeader>
							<DialogTitle>
								Testimonial for{" "}
								{pricings.find((type) => type.idx === history.plan)?.name} (
								{new Date(history.date).toLocaleDateString("id-ID", {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
								)
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="stars"
								render={({ field }) => (
									<FormItem className="flex items-center gap-2">
										<FormControl>
											<div className="flex items-center">
												{[...Array(field.value)].map((_, i) => (
													<Star
														// biome-ignore lint/suspicious/noArrayIndexKey: no need for unique key here
														key={i}
														className="h-5 w-5 cursor-pointer fill-current text-yellow-500"
														onClick={() => field.onChange(i + 1)}
													/>
												))}
												{[...Array(5 - field.value)].map((_, i) => (
													<Star
														// biome-ignore lint/suspicious/noArrayIndexKey: no need for unique key here
														key={i}
														className="h-5 w-5 cursor-pointer fill-current text-muted"
														onClick={() => field.onChange(field.value + i + 1)}
													/>
												))}
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="stars"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea
												className="h-32 resize-none"
												{...field}
												placeholder="Feel free to share your experience with our service. Your feedback helps us improve!"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Close</Button>
							</DialogClose>
							<Button>
								{history.testimonial ? "Edit Testimonial" : "Add Testimonial"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
