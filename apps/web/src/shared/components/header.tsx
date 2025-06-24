import { Link } from "@tanstack/react-router";

import { Button } from "@/shared/components/ui/button";
import { Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";
import { navigationItems } from "../data/navigations";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "./ui/navigation-menu";
import UserMenu from "./user-menu";

export default function Header() {
	const [isOpen, setOpen] = useState(false);

	return (
		<header className="fixed top-0 left-0 z-40 w-full bg-background">
			<div className="container relative mx-auto flex min-h-20 flex-row items-center gap-4 lg:grid lg:grid-cols-3">
				<div className="hidden flex-row items-center justify-start gap-4 lg:flex">
					<NavigationMenu className="flex items-start justify-start">
						<NavigationMenuList className="flex flex-row justify-start gap-4">
							{navigationItems.map((item) => (
								<NavigationMenuItem key={item.title}>
									{item.href ? (
										<NavigationMenuLink
											className="font-medium text-sm hover:cursor-default"
											href={item.href}
										>
											{item.title}
										</NavigationMenuLink>
									) : (
										<>
											<NavigationMenuTrigger className="font-medium text-sm">
												{item.title}
											</NavigationMenuTrigger>
											<NavigationMenuContent className="!w-[450px] p-4">
												<div className="flex grid-cols-2 flex-col gap-4 lg:grid">
													<div className="flex h-full flex-col justify-between">
														<div className="flex flex-col">
															<p className="text-base">{item.title}</p>
															<p className="text-muted-foreground text-sm">
																{item.description}
															</p>
														</div>
													</div>
													<div className="flex h-full flex-col justify-end text-sm">
														{item.items?.map((subItem) => (
															<NavigationMenuLink
																href={subItem.href}
																key={subItem.title}
																className="flex flex-row items-center justify-between rounded px-4 py-2 hover:bg-muted"
															>
																<span>{subItem.title}</span>
																<MoveRight className="h-4 w-4 text-muted-foreground" />
															</NavigationMenuLink>
														))}
													</div>
												</div>
											</NavigationMenuContent>
										</>
									)}
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="flex lg:justify-center">
					<p className="font-semibold">SEA Catering</p>
				</div>
				<div className="flex w-full justify-end gap-4">
					<UserMenu />
				</div>

				{/* Mobile */}
				<div className="flex w-12 shrink items-end justify-end lg:hidden">
					<Button variant="ghost" onClick={() => setOpen(!isOpen)}>
						{isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</Button>
					{isOpen && (
						<div className="container absolute top-20 right-0 flex w-full flex-col gap-8 border-t bg-background py-4 shadow-lg">
							{navigationItems.map((item) => (
								<div key={item.title}>
									<div className="flex flex-col gap-2">
										{item.href ? (
											<Link
												to={item.href}
												className="flex items-center justify-between"
											>
												<span className="text-lg">{item.title}</span>
												<MoveRight className="h-4 w-4 stroke-1 text-muted-foreground" />
											</Link>
										) : (
											<p className="text-lg">{item.title}</p>
										)}
										{item.items?.map((subItem) => (
											<Link
												key={subItem.title}
												to={subItem.href}
												className="flex items-center justify-between"
											>
												<span className="text-muted-foreground">
													{subItem.title}
												</span>
												<MoveRight className="h-4 w-4 stroke-1" />
											</Link>
										))}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
