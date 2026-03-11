"use client";

import Link from "next/link";
import { UtensilsCrossed, Menu as MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { CartSheet } from "./cart-sheet";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Menu", href: "#menu" },
    { name: "Reviews", href: "#testimonials" },
    { name: "Momo Finder", href: "#ai-tool" },
    { name: "Location", href: "#footer" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg group-hover:bg-accent transition-colors">
            <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">Meow Momo</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-3 ml-2 border-l pl-6">
            <CartSheet />
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <a href="https://wa.me/919867977942" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-4">
          <CartSheet />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] flex flex-col pt-20">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium py-4 border-b hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-8">
                <Button className="w-full h-12 bg-primary" asChild>
                  <a href="https://wa.me/919867977942" target="_blank" rel="noopener noreferrer">Order Now</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
