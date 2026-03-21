"use client";

import Link from "next/link";
import { Menu as MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import Image from "next/image";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // official brand logo
  const BRAND_LOGO_URL = 'https://res.cloudinary.com/di4onfrel/image/upload/v1774028552/momomeow_logo.pdf_pnbic1.png?v=2';

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Menu", href: "/#menu" },
    { name: "Why Us", href: "/#why-choose-us" },
    { name: "Reviews", href: "/#testimonials" },
    { name: "FAQ", href: "/#faq" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 overflow-hidden rounded-xl group-hover:scale-105 transition-all duration-300">
            <Image 
              src={BRAND_LOGO_URL} 
              alt="Meow Momo Logo" 
              fill 
              className="object-contain"
            />
          </div>
          <span className="font-headline font-black text-xl tracking-tight text-primary transition-colors group-hover:text-accent">Meow Momo</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden flex items-center gap-4">
          {mounted && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MenuIcon className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] flex flex-col pt-20 rounded-l-[2rem]">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                  <SheetDescription>
                    Access links to our menu, testimonials, and contact information.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href} 
                      onClick={() => setIsOpen(false)} 
                      className="text-lg font-bold py-4 border-b hover:text-primary transition-colors uppercase tracking-tighter"
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
