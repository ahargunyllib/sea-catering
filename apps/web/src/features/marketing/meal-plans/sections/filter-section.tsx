import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { Slider } from "@/shared/components/ui/slider";
import { DietaryTypes, MealPlanTypes } from "@/shared/data/enums";
import useDebounce from "@/shared/hooks/use-debounce";
import { getRouteApi } from "@tanstack/react-router";
import { SearchIcon, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";

const route = getRouteApi("/meal-plans");

type Props = {
	totalData: number;
	totalDataShown: number;
};

export default function FilterSection({ totalData, totalDataShown }: Props) {
	const searchParams = route.useSearch();
	const navigate = route.useNavigate();

	const [filter, setFilter] = useState<typeof searchParams>(searchParams);
	const debouncedFilter = useDebounce(filter, 500);

	useEffect(() => {
		const newSearch = {
			q: debouncedFilter.q,
			page: debouncedFilter.page,
			type: debouncedFilter.type,
			"order-by": debouncedFilter["order-by"],
			dietary: debouncedFilter.dietary,
			"price-range": debouncedFilter["price-range"],
			"show-filters": debouncedFilter["show-filters"],
		};

		const isDifferent = Object.entries(newSearch).some(
			([key, value]) =>
				searchParams[key as keyof typeof searchParams] !== value,
		);

		if (isDifferent) {
			navigate({ search: newSearch, replace: true });
		}
	}, [debouncedFilter, navigate, searchParams]);

	return (
		<div className="container mx-auto space-y-2">
			<Card>
				<CardContent>
					<div className="flex flex-col gap-2 lg:flex-row">
						{/* Search */}
						<div className="relative flex-1">
							<Input
								className="peer ps-9"
								placeholder="Search meals, ingredients, or chefs..."
								value={filter.q}
								onChange={(e) =>
									setFilter((prev) => ({ ...prev, q: e.target.value }))
								}
							/>
							<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
								<SearchIcon size={16} aria-hidden="true" />
							</div>
						</div>

						{/* Quick Filters */}
						<Select
							value={filter.type}
							onValueChange={(val) =>
								setFilter((prev) => ({
									...prev,
									type: val as (typeof filter)["type"],
								}))
							}
						>
							<SelectTrigger className="">
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								{MealPlanTypes.map((type) => (
									<SelectItem key={type.key} value={type.key}>
										{type.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={filter["order-by"]}
							onValueChange={(val) =>
								setFilter((prev) => ({
									...prev,
									"order-by": val as (typeof filter)["order-by"],
								}))
							}
						>
							<SelectTrigger className="">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="popular">Most Popular</SelectItem>
								<SelectItem value="rating">Highest Rated</SelectItem>
								<SelectItem value="price-asc">Price: Low to High</SelectItem>
								<SelectItem value="price-desc">Price: High to Low</SelectItem>
							</SelectContent>
						</Select>

						<Button
							variant="outline"
							onClick={() =>
								setFilter((prev) => ({
									...prev,
									"show-filters": !prev["show-filters"],
								}))
							}
							className="space-x-2 bg-transparent hover:bg-transparent"
						>
							<SlidersHorizontal className="h-4 w-4" />
							Filters
							{(filter.dietary.length > 0 ||
								filter["price-range"][0] > 0 ||
								filter["price-range"][1] < 200000) && (
								<Badge className="bg-emerald-500">
									{filter.dietary.length +
										(filter["price-range"][0] > 0 ||
										filter["price-range"][1] < 200000
											? 1
											: 0)}
								</Badge>
							)}
						</Button>
					</div>

					{/* Advanced Filters */}
					{filter["show-filters"] && (
						<div className="mt-6 space-y-6 border-border border-t pt-6">
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
								{/* Dietary Preferences */}
								<div className="space-y-4">
									<Label className="block">Dietary Preferences</Label>
									<div className="flex flex-wrap gap-2">
										{DietaryTypes.map((type) => {
											const dietary =
												type.key as (typeof filter)["dietary"][number];

											const isPresent = filter.dietary.includes(dietary);

											return (
												<Badge
													key={type.key}
													onClick={() =>
														setFilter((prev) => ({
															...prev,
															dietary: isPresent
																? prev.dietary.filter((val) => val !== type.key)
																: [...prev.dietary, dietary],
														}))
													}
													variant={isPresent ? "default" : "outline"}
													className="cursor-pointer"
												>
													{type.label}
												</Badge>
											);
										})}
									</div>
								</div>

								{/* Price Range */}
								<div className="space-y-4">
									<Label className="block">
										Price Range: Rp
										{filter["price-range"][0].toLocaleString()} - Rp
										{filter["price-range"][1].toLocaleString()}
									</Label>
									<Slider
										value={filter["price-range"]}
										onValueChange={(val) =>
											setFilter((prev) => ({ ...prev, "price-range": val }))
										}
										max={200000}
										min={0}
										step={5000}
										className="w-full"
									/>
								</div>

								{/* Clear Filters */}
								<div className="flex justify-end">
									<Button
										variant="outline"
										onClick={() =>
											setFilter((prev) => ({
												...prev,
												q: "",
												type: "all",
												"order-by": "popular",
												dietary: [],
												"price-range": [0, 200_000],
											}))
										}
										className="bg-transparent"
									>
										<X className="h-4 w-4" />
										Clear All
									</Button>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Results Count */}
			<div className="flex items-center justify-between">
				<p className="text-gray-300">
					Showing {totalDataShown} of {totalData} meal plans
				</p>
			</div>
		</div>
	);
}
