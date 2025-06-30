import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/components/ui/dialog";
import { mealPlans } from "@/shared/data/meal-plans";
import { getRouteApi } from "@tanstack/react-router";
import { Clock, Flame, Search, Star, Users, XIcon } from "lucide-react";

const route = getRouteApi("/meal-plans");

export default function ListMealPlanSection() {
	const searchParams = route.useSearch();
	const navigate = route.useNavigate();

	const filteredMeals = mealPlans;

	const clearFilters = () => {
		navigate({
			search: {
				q: "",
				page: 1,
				type: "all",
				"order-by": "popular",
				dietary: [],
				"price-range": [0, 200_000],
				"show-filters": searchParams["show-filters"],
			},
		});
	};

	return (
		<div className="container mx-auto">
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{filteredMeals.map((meal) => (
					<Card
						key={meal.id}
						className="group cursor-pointer overflow-hidden transition-all duration-500 hover:scale-105"
					>
						<div className="relative">
							<img
								src={meal.image || "/placeholder.svg"}
								alt={meal.name}
								className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							<div className="absolute top-4 left-4 flex gap-2">
								{meal.popular && (
									<Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
										<Star className="mr-1 h-3 w-3" />
										Popular
									</Badge>
								)}
								{meal.new && (
									<Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
										New
									</Badge>
								)}
							</div>
							<div className="absolute top-4 right-4">
								<div className="space-x-2 rounded-full bg-foreground/50 px-2 py-1 text-background text-sm backdrop-blur-sm">
									<span className="font-bold">
										Rp{meal.price.toLocaleString()}
									</span>
								</div>
							</div>
						</div>

						<CardContent className="space-y-4 p-6">
							<div className="flex items-start justify-between">
								<div className="space-y-1">
									<h3 className="font-bold text-xl">{meal.name}</h3>
									<p className="text-muted-foreground text-sm">
										by {meal.chef}
									</p>
								</div>
								<div className="flex items-center space-x-1">
									<Star className="h-4 w-4 fill-current text-yellow-400" />
									<span className="text-sm">{meal.rating}</span>
									<span className="text-muted-foreground text-sm">
										({meal.reviews})
									</span>
								</div>
							</div>

							<p className="line-clamp-2 text-sm">{meal.description}</p>

							<div className="flex items-center gap-4 text-muted-foreground text-sm">
								<div className="flex items-center gap-x-1">
									<Clock className="h-4 w-4" />
									{meal.prepTime}m
								</div>
								<div className="flex items-center gap-x-1">
									<Users className="h-4 w-4" />
									{meal.servings}
								</div>
								<div className="flex items-center gap-x-1">
									<Flame className="h-4 w-4" />
									{meal.calories} cal
								</div>
							</div>

							<div className="flex flex-wrap gap-1">
								{meal.dietaryTags.map((tag) => (
									<Badge key={tag} variant="secondary" className="text-xs">
										{tag}
									</Badge>
								))}
							</div>

							<Dialog>
								<DialogTrigger asChild>
									<Button className="w-full">View Details</Button>
								</DialogTrigger>
								<DialogContent className="max-w-2xl">
									<DialogHeader>
										<DialogTitle className="font-bold text-2xl">
											{meal.name}
										</DialogTitle>
										<DialogDescription className="text-muted-foreground">
											by {meal.chef}
										</DialogDescription>
									</DialogHeader>
									<div className="space-y-6">
										<img
											src={meal.image || "/placeholder.svg"}
											alt={meal.name}
											className="h-64 w-full rounded-lg object-cover"
										/>

										<h4 className="font-semibold text-xl">
											Rp{meal.price.toLocaleString()}
										</h4>

										<div className="space-y-2">
											<h4 className="font-semibold">Description</h4>
											<p className="text-muted-foreground">
												{meal.description}
											</p>
										</div>

										<div className="flex flex-row items-center justify-between gap-4">
											<div className="text-center">
												<div className="font-bold text-2xl text-yellow-400">
													{meal.rating}
												</div>
												<div className="text-muted-foreground text-sm">
													Rating
												</div>
											</div>
											<div className="text-center">
												<div className="font-bold text-2xl text-blue-400">
													{meal.prepTime}m
												</div>
												<div className="text-muted-foreground text-sm">
													Prep Time
												</div>
											</div>
											<div className="text-center">
												<div className="font-bold text-2xl text-purple-400">
													{meal.calories}
												</div>
												<div className="text-muted-foreground text-sm">
													Calories
												</div>
											</div>
											<div className="text-center">
												<div className="font-bold text-2xl text-orange-400">
													{meal.nutrition.protein}g
												</div>
												<div className="text-muted-foreground text-sm">
													Protein
												</div>
											</div>
										</div>

										<div className="space-y-2">
											<h4 className="font-semibold">Ingredients</h4>
											<div className="flex flex-wrap gap-2">
												{meal.ingredients.map((ingredient) => (
													<Badge variant="secondary" key={ingredient}>
														{ingredient}
													</Badge>
												))}
											</div>
										</div>
									</div>
								</DialogContent>
							</Dialog>
						</CardContent>
					</Card>
				))}
			</div>

			{filteredMeals.length === 0 && (
				<div className="space-y-4 py-16 text-center">
					<div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
						<Search className="h-12 w-12 text-muted-foreground" />
					</div>
					<div>
						<h3 className="font-bold text-2xl">No meals found</h3>
						<p className="text-muted-foreground">
							Try adjusting your filters or search terms
						</p>
					</div>
					<Button onClick={clearFilters} variant="outline">
						<XIcon className="mr-2 h-4 w-4" /> Clear All Filters
					</Button>
				</div>
			)}
		</div>
	);
}
