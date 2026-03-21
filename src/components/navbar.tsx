"use client";

import Link from "next/link";
import { Menu as MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();

  // official brand logo
  const BRAND_LOGO_URL = 'https://res.cloudinary.com/di4onfrel/image/upload/v1774028552/momomeow_logo.pdf_pnbic1.png?v=2';

  useEffect(() => {
    setMounted(true);

    // Scroll Spy Logic
    if (pathname === "/") {
      const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      };

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);

      // Sections to observe
      const sectionIds = ["menu", "why-choose-us", "testimonials", "faq"];
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      return () => observer.disconnect();
    }
  }, [pathname]);

  const navLinks = [
    { name: "Menu", href: "/#menu", id: "menu" },
    { name: "Why Us", href: "/#why-choose-us", id: "why-choose-us" },
    { name: "Reviews", href: "/#testimonials", id: "testimonials" },
    { name: "FAQ", href: "/#faq", id: "faq" },
    { name: "About", href: "/about", id: "about" },
    { name: "Contact", href: "/contact", id: "contact" },
  ];

  const isLinkActive = (link: { href: string; id: string }) => {
    if (pathname === "/about" && link.id === "about") return true;
    if (pathname === "/contact" && link.id === "contact") return true;
    if (pathname === "/" && activeSection === link.id) return true;
    return false;
  };

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
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isLinkActive(link);
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={cn(
                  "relative text-[10px] font-black uppercase tracking-[0.2em] transition-colors group py-2",
                  active ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300",
                  active ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </Link>
            );
          })}
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
                      className={cn(
                        "text-lg font-bold py-4 border-b hover:text-primary transition-colors uppercase tracking-tighter",
                        isLinkActive(link) ? "text-primary" : "text-foreground"
                      )}
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
