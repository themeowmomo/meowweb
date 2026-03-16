"use client";

import Link from "next/link";
import { UtensilsCrossed, Menu as MenuIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { CartSheet } from "./cart-sheet";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Menu", href: "/#menu" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
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
            <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-primary" aria-label="Admin Dashboard Settings">
              <Link href="/admin"><Settings className="w-5 h-5" /></Link>
            </Button>
            <CartSheet />
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-4">
          <CartSheet />
          {mounted && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open Mobile Menu">
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
                <Link 
                  href="/about" 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium py-4 border-b hover:text-primary transition-colors"
                >
                  About Us
                </Link>
                <Link 
                  href="/contact" 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium py-4 border-b hover:text-primary transition-colors"
                >
                  Contact
                </Link>
                <Link 
                  href="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium py-4 border-b hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Settings className="w-5 h-5" /> Admin Dashboard
                </Link>
                <div className="mt-8">
                  <Button className="w-full h-12 bg-primary" asChild>
                    <Link href="/#menu" onClick={() => setIsOpen(false)}>Browse Menu</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  );
}
