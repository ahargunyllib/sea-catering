export default function HeroSection() {
	const user = {
		name: "John Doe",
	};

	return (
		<div className="container mx-auto space-y-2 text-center">
			<h1 className="font-bold text-4xl">Welcome back, {user.name}! 👋</h1>
			<p className="text-primary text-xl">
				Manage your healthy meal subscription
			</p>
		</div>
	);
}
