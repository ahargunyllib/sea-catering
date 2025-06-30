export type MealPlan = {
	id: string;
	name: string;
	description: string;
	image: string;
	rating: number;
	reviews: number;
	calories: number;
	category: string;
	dietaryTags: string[];
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
