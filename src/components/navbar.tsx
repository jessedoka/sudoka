"use client";

import React from "react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "./ui/dropdown-menu";
import Link from "next/link";
import { Package2Icon } from "lucide-react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./modetoggle";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Play", href: "/play" },
    { name: "API", href: "/api" },
];



export default function Navigation() {
    const pathname = usePathname();
    return (
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6 justify-between">
            <Link href="#" className="lg:hidden" prefetch={false}>
                <Package2Icon className="h-6 w-6" />
                <span className="sr-only">Home</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-4">
                {navLinks.map((item) => (
                    <Link key={item.name
                    } href={item.href} className={`flex items-center gap-2 p-2 rounded-lg hover:bg-secondary ${pathname === item.href ? "bg-gray-200" : ""}`}>
                        <span>{item.name}</span>
                    </Link>
                ))}
                <ModeToggle />
            </nav>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full border w-8 h-8">
                        {/* <img src="/placeholder.svg" width="32" height="32" className="rounded-full" alt="Avatar" /> */}
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}