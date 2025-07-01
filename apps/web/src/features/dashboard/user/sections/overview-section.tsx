import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
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
	DialogDescription,
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
	FormLabel,
	FormMessage,
} from "@/shared/components/ui/form";
import { Textarea } from "@/shared/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { MealTypes } from "@/shared/data/meal-types";
import { pricings } from "@/shared/data/pricings";
import { WeekDays } from "@/shared/data/week-days";
import { cn } from "@/shared/lib/utils";
import { trpc } from "@/shared/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	CalendarIcon,
	Loader2Icon,
	PauseIcon,
	PlayIcon,
	Star,
	Trash2Icon,
} from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../../../../shared/components/ui/alert-dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../../../../shared/components/ui/popover";

const EditTestimonalSchema = z.object({
	stars: z.number().min(1).max(5),
	content: z.string().min(1).max(500),
});

type EditTestimonialRequest = z.infer<typeof EditTestimonalSchema>;

const PauseSubscriptionSchema = z.object({
	pausedFrom: z.date(),
	pausedTo: z.date(),
});

type PauseSubscriptionRequest = z.infer<typeof PauseSubscriptionSchema>;

export default function OverviewSection() {
	const subscriptionData = useQuery(trpc.getCurrentSubscription.queryOptions());
	const subscription = subscriptionData?.data?.subscription || null;

	const historySubscriptionData = useQuery(
		trpc.getHistoricalSubscriptions.queryOptions(),
	);
	const historySubscription =
		historySubscriptionData?.data?.subscriptions || [];

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

	const { mutate: cancelSubscription, isPending: isPendingCancel } =
		useMutation(trpc.cancelSubscription.mutationOptions());
	const { mutate: pauseSubscription, isPending: isPendingPause } = useMutation(
		trpc.pauseSubscription.mutationOptions(),
	);
	const { mutate: resumeSubscription, isPending: isPendingResume } =
		useMutation(trpc.resumeSubscription.mutationOptions());

	const form = useForm<PauseSubscriptionRequest>({
		resolver: zodResolver(PauseSubscriptionSchema),
		defaultValues: {
			pausedFrom: new Date(),
			pausedTo: new Date(),
		},
	});
	const onPauseSubmit = form.handleSubmit((data) => {
		if (!subscription || !data.pausedFrom || !data.pausedTo) return;

		pauseSubscription(
			{
				subscriptionId: subscription.id,
				pausedFrom: data.pausedFrom.toISOString(),
				pausedTo: data.pausedTo.toISOString(),
			},
			{
				onSuccess: (res) => {
					form.reset();
					toast.success(res.message);
					subscriptionData.refetch();
				},
			},
		);
	});

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
							{subscription && (
								<Tooltip>
									<TooltipTrigger asChild>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button variant="destructive" size="icon">
													<Trash2Icon />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Are you sure you want to cancel your subscription?
													</AlertDialogTitle>
													<AlertDialogDescription>
														This action cannot be undone. Your subscription will
														be cancelled immediately, and you will not be
														charged for the next billing cycle.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<Button
														variant="outline"
														onClick={() =>
															cancelSubscription(
																{
																	subscriptionId: subscription.id,
																},
																{
																	onSuccess: (res) => {
																		toast.success(res.message);
																		subscriptionData.refetch();
																	},
																},
															)
														}
														disabled={isPendingCancel}
													>
														{isPendingCancel ? "Cancelling..." : "Yes, Cancel"}
													</Button>
													<AlertDialogTrigger asChild>
														<Button variant="secondary">No, Go Back</Button>
													</AlertDialogTrigger>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</TooltipTrigger>
									<TooltipContent>
										<p className="text-sm">Cancel Subscription</p>
									</TooltipContent>
								</Tooltip>
							)}
							{!subscription ? null : isPaused ? (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="outline"
											size="icon"
											onClick={() => {
												resumeSubscription(
													{
														subscriptionId: subscription.id,
													},
													{
														onSuccess: (res) => {
															toast.success(res.message);
															subscriptionData.refetch();
														},
													},
												);
											}}
											disabled={isPendingResume}
										>
											{isPendingResume ? (
												<Loader2Icon className="animate-spin" />
											) : (
												<PlayIcon />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p className="text-sm">Resume Subscription</p>
									</TooltipContent>
								</Tooltip>
							) : (
								<Tooltip>
									<TooltipTrigger asChild>
										<Dialog>
											<DialogTrigger asChild>
												<Button variant="outline" size="icon">
													<PauseIcon />
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Pause Subscription</DialogTitle>
													<DialogDescription>
														Are you sure you want to pause your subscription?
														You can resume it later at any time.
													</DialogDescription>
												</DialogHeader>
												<Form {...form}>
													<form onSubmit={onPauseSubmit} className="space-y-4">
														<FormField
															control={form.control}
															name="pausedFrom"
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Pause From (YYYY-MM-DD)</FormLabel>
																	<Popover>
																		<PopoverTrigger asChild>
																			<FormControl>
																				<Button
																					variant={"outline"}
																					className={cn(
																						"w-[240px] pl-3 text-left font-normal",
																						!field.value &&
																							"text-muted-foreground",
																					)}
																				>
																					{new Date(field.value).toLocaleString(
																						"id-ID",
																						{
																							weekday: "long",
																							year: "numeric",
																							month: "long",
																							day: "numeric",
																						},
																					)}
																					<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
																				</Button>
																			</FormControl>
																		</PopoverTrigger>
																		<PopoverContent
																			className="w-auto p-0"
																			align="start"
																		>
																			<Calendar
																				mode="single"
																				selected={new Date(field.value)}
																				onSelect={field.onChange}
																				captionLayout="dropdown"
																			/>
																		</PopoverContent>
																	</Popover>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name="pausedTo"
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Pause To (YYYY-MM-DD)</FormLabel>
																	<Popover>
																		<PopoverTrigger asChild>
																			<FormControl>
																				<Button
																					variant={"outline"}
																					className={cn(
																						"w-[240px] pl-3 text-left font-normal",
																						!field.value &&
																							"text-muted-foreground",
																					)}
																				>
																					{new Date(field.value).toLocaleString(
																						"id-ID",
																						{
																							weekday: "long",
																							year: "numeric",
																							month: "long",
																							day: "numeric",
																						},
																					)}
																					<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
																				</Button>
																			</FormControl>
																		</PopoverTrigger>
																		<PopoverContent
																			className="w-auto p-0"
																			align="start"
																		>
																			<Calendar
																				mode="single"
																				selected={field.value}
																				onSelect={field.onChange}
																				captionLayout="dropdown"
																			/>
																		</PopoverContent>
																	</Popover>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<DialogFooter>
															<DialogClose asChild>
																<Button variant="outline" type="button">
																	Cancel
																</Button>
															</DialogClose>
															<DialogClose asChild>
																<Button type="submit" disabled={isPendingPause}>
																	{isPendingPause
																		? "Pausing..."
																		: "Pause Subscription"}
																</Button>
															</DialogClose>
														</DialogFooter>
													</form>
												</Form>
											</DialogContent>
										</Dialog>
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
											<CalendarIcon className="h-4 w-4" />
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
		id: string;
		plan: number;
		mealTypes: number[];
		deliveryDays: number[];
		totalPrice: number;
		testimonial: {
			stars: number;
			content: string;
		} | null;
		createdAt: string;
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
						{new Date(history.createdAt).toLocaleDateString("id-ID", {
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
								{new Date(history.createdAt).toLocaleDateString("id-ID", {
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
