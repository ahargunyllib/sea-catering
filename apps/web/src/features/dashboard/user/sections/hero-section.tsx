import { trpc } from "@/shared/utils/trpc";
import { useQuery } from "@tanstack/react-query";

export default function HeroSection() {
	const { data } = useQuery(trpc.privateData.queryOptions());

	return (
		<div className="container mx-auto space-y-2 text-center">
			<h1 className="font-bold text-4xl">
				Welcome back, {data?.user.name}! 👋
			</h1>
			<p className="text-primary text-xl">
				Manage your healthy meal subscription
			</p>
		</div>
	);
}
