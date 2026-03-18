
"use client";

import Link from "next/link";
import { UtensilsCrossed, Menu as MenuIcon, Settings, User as UserIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { useUser, useAuth } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const auth = useAuth();

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
          <div className="bg-primary p-2 rounded-xl group-hover:bg-accent transition-all duration-300 shadow-sm shadow-primary/20 group-hover:shadow-accent/20">
            <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          <span className="font-headline font-black text-xl tracking-tight text-primary transition-colors group-hover:text-accent">Meow Momo</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{link.name}</Link>
          ))}
          <div className="flex items-center gap-3 ml-2 border-l pl-6">
            {mounted && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email || user.phoneNumber}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center"><Settings className="mr-2 h-4 w-4" /> <span>Staff Panel</span></Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => auth.signOut()} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-primary rounded-full">
                <Link href="/login"><UserIcon className="w-5 h-5" /></Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-4">
          {mounted && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full"><MenuIcon className="w-6 h-6" /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] flex flex-col pt-20 rounded-l-[2rem]">
                {user && (
                  <div className="flex items-center gap-3 mb-8 pb-8 border-b">
                    <Avatar className="h-12 w-12"><AvatarImage src={user.photoURL || undefined} /><AvatarFallback className="bg-primary/10 text-primary">{user.displayName?.charAt(0) || "U"}</AvatarFallback></Avatar>
                    <div className="flex flex-col"><span className="font-black text-sm">{user.displayName || "User"}</span><span className="text-xs text-muted-foreground">{user.email || user.phoneNumber}</span></div>
                  </div>
                )}
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-lg font-bold py-4 border-b hover:text-primary transition-colors">{link.name}</Link>
                ))}
                {!user ? (
                  <Link href="/login" onClick={() => setIsOpen(false)} className="text-lg font-bold py-4 border-b">Login</Link>
                ) : (
                  <button onClick={() => { auth.signOut(); setIsOpen(false); }} className="text-lg font-bold py-4 border-b text-destructive text-left">Logout</button>
                )}
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  );
}
