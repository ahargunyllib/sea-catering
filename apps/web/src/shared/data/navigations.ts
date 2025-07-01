export const navigationItems = [
	{
		title: "Home",
		href: "/",
		description: "",
	},
	{
		title: "Pricing",
		href: "/pricing",
		description: "Simple, transparent pricing.",
	},
	{
		title: "Meal Plans",
		href: "/meal-plans",
		description: "Explore our meal plans tailored to your health goals.",
		items: [
			{
				title: "Diet Meal Plans",
				href: "/meal-plans?type=diet",
			},
			{
				title: "Protein Meal Plans",
				href: "/meal-plans?type=protein",
			},
			{
				title: "Royal Meal Plans",
				href: "/meal-plans?type=royal",
			},
		],
	},
	{
		title: "Dashboard",
		href: "/dashboard",
		description: "Your personalized meal plan dashboard.",
	},
];
