"use client";

import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/shared/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "../../../../shared/utils/trpc";

export default function TestimonialSection() {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);

	const { data } = useQuery(trpc.getTestimonials.queryOptions());

	useEffect(() => {
		if (!api) {
			return;
		}

		setTimeout(() => {
			if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
				setCurrent(0);
				api.scrollTo(0);
			} else {
				api.scrollNext();
				setCurrent(current + 1);
			}
		}, 8000);
	}, [api, current]);

	return (
		<div className="w-full py-20 lg:py-40">
			<div className="container mx-auto">
				<div className="flex flex-col gap-10">
					<h2 className="text-left font-regular text-3xl tracking-tighter md:text-5xl lg:max-w-xl">
						What Our Customers Say
					</h2>
					<Carousel setApi={setApi} className="w-full">
						<CarouselContent>
							{data?.testimonials.map(({ testimonial, user }) => (
								<CarouselItem
									className="lg:basis-1/2"
									key={testimonial?.content}
								>
									<div className="flex h-full flex-col justify-between rounded-md border p-6 lg:col-span-2">
										<div className="flex items-center">
											{[...Array(testimonial?.rating)].map((_, i) => (
												<Star
													// biome-ignore lint/suspicious/noArrayIndexKey: no need for unique key here
													key={i}
													className="h-5 w-5 fill-current text-yellow-500"
												/>
											))}
											{[...Array(5 - (testimonial?.rating || 0))].map(
												(_, i) => (
													<Star
														// biome-ignore lint/suspicious/noArrayIndexKey: no need for unique key here
														key={i}
														className="h-5 w-5 fill-current text-muted"
													/>
												),
											)}
										</div>
										<div className="flex flex-col gap-4">
											<div className="flex flex-col">
												<p className="max-w-xs text-base text-muted-foreground">
													"{testimonial?.content}"
												</p>
											</div>
											<p className="flex flex-row items-center gap-2 text-sm">
												<span className="text-muted-foreground">By</span>{" "}
												<Avatar className="h-6 w-6">
													<AvatarFallback>
														{user?.name.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<span>{user?.name}</span>
											</p>
										</div>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
				</div>
			</div>
		</div>
	);
}
