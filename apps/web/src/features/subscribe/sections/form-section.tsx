import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import MultipleSelector from "@/shared/components/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { DietaryTypes } from "@/shared/data/enums";
import { MealTypes } from "@/shared/data/meal-types";
import { pricings } from "@/shared/data/pricings";
import { WeekDays } from "@/shared/data/week-days";
import { useFormId } from "@/shared/hooks/use-form-id";
import { cn } from "@/shared/lib/utils";
import { trpc } from "@/shared/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { type Tag, TagInput } from "emblor";
import { InfoIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

const subscribechema = z.object({
	fullName: z.string().min(1, "Full name is required"),
	phone: z
		.string()
		.min(1, "Phone number is required")
		.regex(/^\d{10,15}$/, "Invalid phone number format"),
	selectedPlan: z.number().min(1, "Please select a meal plan"),
	mealTypes: z.array(z.number()).min(1, "Please select at least one meal type"),
	deliveryDays: z
		.array(z.number())
		.min(1, "Please select at least one delivery day"),
	allergies: z.array(z.string()).optional(),
	dietaryRestrictions: z.array(z.number()).optional(),
});

type SubscribeRequest = z.infer<typeof subscribechema>;

export default function FormSection() {
	const form = useForm<SubscribeRequest>({
		resolver: zodResolver(subscribechema),
		defaultValues: {
			fullName: "",
			phone: "",
			selectedPlan: 1,
			mealTypes: [],
			deliveryDays: [],
			allergies: [],
			dietaryRestrictions: [],
		},
	});

	const formIds = useFormId([
		"fullName",
		"phone",
		"selectedPlan",
		"mealTypes",
		"deliveryDays",
		"allergies",
		"dietaryRestrictions",
	]);

	const [allergies, setAllergies] = useState<Tag[]>([]);
	const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

	const [selectedPlan, deliveryDays, mealTypes] = form.watch([
		"selectedPlan",
		"deliveryDays",
		"mealTypes",
	]);

	const plan = useMemo(() => {
		return pricings.find((p) => p.idx === selectedPlan);
	}, [selectedPlan]);

	const totalPrice = useMemo(() => {
		if (!plan || mealTypes.length === 0 || deliveryDays.length === 0) {
			return undefined;
		}

		return Math.round(
			plan.price * mealTypes.length * deliveryDays.length * 4.3,
		);
	}, [plan, mealTypes.length, deliveryDays.length]);

	const { mutate, isPending } = useMutation(trpc.subscribe.mutationOptions());

	const onSubmitHandler = form.handleSubmit((data) => {
		mutate(data, {
			onSuccess: (res) => {
				form.reset();
				setAllergies([]);
				setActiveTagIndex(null);
				toast.success(res.message);
			},
		});
	});

	return (
		<div className="mx-auto max-w-4xl">
			<Form {...form}>
				<form onSubmit={onSubmitHandler} className="space-y-8">
					{/* Personal Information */}
					<Card>
						<CardHeader>
							<CardTitle>Personal Information</CardTitle>
							<CardDescription>Tell us about yourself</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<FormField
								control={form.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor={formIds.fullName}>
											Full Name <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input
												id={formIds.fullName}
												{...field}
												placeholder="John Doe"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor={formIds.phone}>
											Phone Number <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input
												id={formIds.phone}
												{...field}
												placeholder="08123456789"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="allergies"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor={formIds.allergies}>
											Allergies (if any)
										</FormLabel>
										<FormControl>
											<TagInput
												id={formIds.allergies}
												tags={allergies}
												{...field}
												setTags={(newTags) => {
													setAllergies(newTags);
												}}
												onBlur={() => {
													field.onBlur();
													form.setValue(
														"allergies",
														allergies.map((tag) => tag.text),
													);
												}}
												placeholder="Add allergies"
												styleClasses={{
													tagList: {
														container: "gap-1",
													},
													input:
														"rounded-md transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
													tag: {
														body: "relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
														closeButton:
															"absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
													},
												}}
												activeTagIndex={activeTagIndex}
												setActiveTagIndex={setActiveTagIndex}
												inlineTags={false}
												inputFieldPosition="top"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="dietaryRestrictions"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor={formIds.dietaryRestrictions}>
											Dietary Restrictions (if any)
										</FormLabel>
										<FormControl>
											<MultipleSelector
												commandProps={{
													label: "Select dietary restrictions",
												}}
												{...field}
												value={field.value?.map((item) => {
													const dietaryType = DietaryTypes.find(
														(type) => type.idx === item,
													);
													if (!dietaryType) {
														return {
															value: "",
															label: "",
														};
													}

													return {
														value: dietaryType.key,
														label: dietaryType.label,
													};
												})}
												placeholder="Select dietary restrictions"
												hideClearAllButton
												hidePlaceholderWhenSelected
												emptyIndicator={
													<p className="text-center text-sm">
														No results found
													</p>
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>
					{/* Plan Selection */}
					<Card>
						<CardHeader>
							<CardTitle>Choose Your Plan</CardTitle>
							<CardDescription>
								Select the meal plan that fits your lifestyle
							</CardDescription>
						</CardHeader>
						<CardContent>
							<FormField
								control={form.control}
								name="selectedPlan"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<RadioGroup
												id={formIds.selectedPlan}
												value={field.value.toString()}
												onValueChange={(value) => {
													field.onChange(Number.parseInt(value));
												}}
												className="flex flex-row gap-4"
											>
												{pricings.map((plan) => (
													<FormItem
														key={plan.idx}
														className="flex-1 cursor-pointer"
													>
														<RadioGroupItem
															value={plan.idx.toString()}
															id={`plan-${plan.idx}`}
															className="hidden"
														/>
														<Label
															htmlFor={`plan-${plan.idx}`}
															className={cn(
																"flex flex-col items-start rounded-lg border p-4",
																field.value === plan.idx
																	? "border-primary bg-primary/10 hover:bg-primary/20"
																	: "border-border bg-background hover:bg-muted",
															)}
														>
															<span className="font-medium">{plan.name}</span>
															<p className="text-gray-600 text-sm">
																{plan.description}
															</p>
															<p className="font-bold text-lg text-primary">
																Rp {plan.price.toLocaleString()}/meal
															</p>
														</Label>
													</FormItem>
												))}
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Meal Types</CardTitle>
							<CardDescription>
								Choose which meals you'd like delivered (select at least one)
							</CardDescription>
						</CardHeader>
						<CardContent>
							<FormField
								control={form.control}
								name="mealTypes"
								render={() => (
									<FormItem>
										<div className="flex flex-row items-center gap-4">
											{MealTypes.map((meal) => (
												<FormField
													key={meal.idx}
													control={form.control}
													name="mealTypes"
													render={({ field }) => (
														<FormItem className="flex flex-1 items-center gap-2">
															<Label
																htmlFor={`meal-${meal.idx}`}
																className="flex-1 cursor-pointer items-center gap-4 rounded-lg border p-4"
															>
																<FormControl>
																	<Checkbox
																		id={`meal-${meal.idx}`}
																		checked={field.value.includes(meal.idx)}
																		onCheckedChange={(checked) => {
																			const newValue = checked
																				? [...field.value, meal.idx]
																				: field.value.filter(
																						(id) => id !== meal.idx,
																					);
																			field.onChange(newValue);
																		}}
																	/>
																</FormControl>
																<span className="text-2xl">{meal.icon}</span>
																<span className="font-medium">{meal.name}</span>
															</Label>
														</FormItem>
													)}
												/>
											))}
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>
					{/* Delivery Schedule */}
					<Card>
						<CardHeader>
							<CardTitle>Delivery Schedule</CardTitle>
							<CardDescription>
								Select which days you'd like your meals delivered
							</CardDescription>
						</CardHeader>
						<CardContent>
							<FormField
								control={form.control}
								name="deliveryDays"
								render={() => (
									<FormItem>
										<div className="flex flex-row flex-wrap items-center gap-4">
											{WeekDays.map((day) => (
												<FormField
													key={day.idx}
													control={form.control}
													name="deliveryDays"
													render={({ field }) => (
														<FormItem className="items-center gap-2">
															<Label
																htmlFor={`day-${day.idx}`}
																className="flex-1 cursor-pointer items-center gap-4 rounded-lg border p-4"
															>
																<FormControl>
																	<Checkbox
																		id={`day-${day.idx}`}
																		checked={field.value.includes(day.idx)}
																		onCheckedChange={(checked) => {
																			const newValue = checked
																				? [...field.value, day.idx]
																				: field.value.filter(
																						(id) => id !== day.idx,
																					);
																			field.onChange(newValue);
																		}}
																	/>
																</FormControl>
																<span className="font-medium">{day.name}</span>
															</Label>
														</FormItem>
													)}
												/>
											))}
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>
					{/* Price Calculator */}
					<Card className="bg-secondary">
						<CardHeader>
							<CardTitle>Monthly Subscription Summary</CardTitle>
						</CardHeader>
						<CardContent>
							{totalPrice && plan ? (
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-sm">Plan:</span>
										<Badge variant="default">{plan.name}</Badge>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm">Price per meal:</span>
										<span className="text-sm">
											Rp {plan.price.toLocaleString()}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm">Meals per day:</span>
										<span className="text-sm">{mealTypes.length}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm">Delivery days per week:</span>
										<span className="text-sm">{deliveryDays.length}</span>
									</div>
									<hr className="border-primary" />
									<div className="flex items-center justify-between font-bold text-2xl">
										<span className="flex flex-row items-center gap-2">
											Total Price
											<Tooltip>
												<TooltipTrigger asChild>
													<InfoIcon className="size-4" />
												</TooltipTrigger>
												<TooltipContent>
													<span className="text-sm">
														Rp {plan.price.toLocaleString()} ×{" "}
														{mealTypes.length} × {deliveryDays.length} × 4.3
													</span>
												</TooltipContent>
											</Tooltip>
										</span>
										<span>Rp {totalPrice.toLocaleString("id-ID")}</span>
									</div>
								</div>
							) : (
								<p className="text-center text-gray-600">
									Complete your selections to see pricing
								</p>
							)}
						</CardContent>
					</Card>
					{totalPrice && (
						<Button
							type="submit"
							size="lg"
							className="w-full font-semibold text-lg"
							disabled={
								!selectedPlan ||
								deliveryDays.length === 0 ||
								mealTypes.length === 0 ||
								isPending
							}
						>
							Subscribe Now - Rp {totalPrice.toLocaleString("id-ID")}
							/month
						</Button>
					)}
				</form>
			</Form>
		</div>
	);
}
