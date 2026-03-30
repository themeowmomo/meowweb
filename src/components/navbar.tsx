"use client";

import Link from "next/link";
import { Menu as MenuIcon, Phone, ShoppingBag, X, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();

  const BRAND_LOGO_URL = 'https://res.cloudinary.com/di4onfrel/image/upload/v1774167784/Untitled_design_2_xsocq3.svg?v=4';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        scrolled 
          ? "bg-white/80 backdrop-blur-xl border-b py-3 shadow-sm" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105">
            <Image 
              src={BRAND_LOGO_URL} 
              alt="Meow Momo Logo" 
              fill 
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-black text-lg md:text-xl tracking-tighter text-primary leading-none">MEOW MOMO</span>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-none mt-1">Hygienic • Fresh</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={cn(
                  "px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                  active 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex h-10 rounded-full border-primary/20 font-black text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-white"
            asChild
          >
            <a href="tel:+918850859140">
              <Phone className="w-3.5 h-3.5 mr-2" /> Call Now
            </a>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden rounded-full hover:bg-primary/5">
                <MenuIcon className="w-6 h-6 text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-xs p-0 border-none flex flex-col rounded-l-[2rem] overflow-hidden">
              <div className="p-8 border-b bg-primary text-white">
                <SheetHeader className="text-left space-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative w-12 h-12 bg-white rounded-xl p-1">
                      <Image src={BRAND_LOGO_URL} alt="Logo" fill className="object-contain" />
                    </div>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                        <X className="w-6 h-6" />
                      </Button>
                    </SheetClose>
                  </div>
                  <SheetTitle className="text-2xl font-black tracking-tighter text-white">Navigation</SheetTitle>
                  <SheetDescription className="text-white/70 text-xs font-bold uppercase tracking-widest">
                    Pure Veg & Jain Specialist
                  </SheetDescription>
                </SheetHeader>
              </div>

              <div className="flex-grow p-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsOpen(false)} 
                    className={cn(
                      "text-2xl font-black tracking-tighter transition-colors flex items-center justify-between group py-2",
                      pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {link.name.toUpperCase()}
                    <div className={cn(
                      "h-1.5 w-1.5 rounded-full bg-primary transition-all",
                      pathname === link.href ? "scale-100" : "scale-0 group-hover:scale-100"
                    )} />
                  </Link>
                ))}
              </div>

              <div className="p-8 bg-muted/30 space-y-6">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact & Social</p>
                  <div className="flex flex-col gap-3">
                    <a href="tel:+918850859140" className="flex items-center gap-3 text-sm font-bold text-foreground hover:text-primary">
                      <Phone className="w-4 h-4 text-primary" /> +91 88508 59140
                    </a>
                  </div>
                </div>
                <Button className="w-full h-14 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20" asChild onClick={() => setIsOpen(false)}>
                  <Link href="/menu">Browse Menu</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
