
"use client";

import Link from "next/link";
import { UtensilsCrossed, Menu as MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

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
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-primary p-3 rounded-2xl group-hover:bg-accent transition-all duration-300 shadow-sm shadow-primary/20 group-hover:shadow-accent/20">
            <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          <span className="font-headline font-black text-xl tracking-tight text-primary transition-colors group-hover:text-accent">Meow Momo</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-4">
          {mounted && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MenuIcon className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] flex flex-col pt-20 rounded-l-[2rem]">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href} 
                      onClick={() => setIsOpen(false)} 
                      className="text-lg font-bold py-4 border-b hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  );
}
