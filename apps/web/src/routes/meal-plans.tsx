import Footer from "@/shared/components/footer";
import Header from "@/shared/components/header";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod/v4";
import FilterSection from "../features/marketing/meal-plans/sections/filter-section";
import HeroSection from "../features/marketing/meal-plans/sections/hero-section";
import ListMealPlanSection from "../features/marketing/meal-plans/sections/list-meal-plan-section";

const mealPlansSearchSchema = z.object({
	q: z.string().default(""),
	page: z.number().default(1),
	type: z.enum(["diet", "protein", "royal", "all"]).default("all"),
	"order-by": z
		.enum(["popular", "rating", "price-asc", "price-desc"])
		.default("popular"),
	dietary: z
		.array(
			z.enum([
				"vegan",
				"vegetarian",
				"gluten-free",
				"high-protein",
				"low-calorie",
				"mediterranean",
				"asian",
				"luxury",
				"detox",
				"raw",
			]),
		)
		.default([]),
	"price-range": z.array(z.number()).default([0, 200_000]),
	"show-filters": z.boolean().default(false),
});

export const Route = createFileRoute("/meal-plans")({
	component: RouteComponent,
	validateSearch: zodValidator(mealPlansSearchSchema),
});

function RouteComponent() {
	return (
		<div className="grid h-svh">
			<Header />
			<main className="space-y-8 py-20 lg:py-40">
				<HeroSection />
				<FilterSection totalData={1} totalDataShown={1} />
				<ListMealPlanSection />
			</main>
			<Footer />
		</div>
	);
}
