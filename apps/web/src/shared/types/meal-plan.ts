export type MealPlan = {
	id: string;
	name: string;
	description: string;
	image: string;
	price: number;
	originalPrice?: number;
	rating: number;
	reviews: number;
	prepTime: number;
	servings: number;
	calories: number;
	category: string;
	dietaryTags: string[];
	difficulty: "Easy" | "Medium" | "Hard";
	chef: string;
	ingredients: string[];
	nutrition: {
		protein: number;
		carbs: number;
		fat: number;
		fiber: number;
	};
	popular: boolean;
	new: boolean;
};
