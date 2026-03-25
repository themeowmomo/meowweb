
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Star, Clock, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const RESTAURANT_ID = 'meow-momo';

export function Hero() {
  const db = useFirestore();
  const profileRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'restaurants', RESTAURANT_ID);
  }, [db]);
  const { data: profile } = useDoc(profileRef);

  // Use a reliable placeholder for immediate LCP while Firestore loads
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-bg")!;

  const amitNumber = "919867977942";
  const karanNumber = "919324810532";

  return (
    <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden min-h-[600px] flex items-center">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-primary text-xs font-bold uppercase tracking-wider">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
            {profile?.category || "Best Pure Veg & Jain Momos in Malad East, Mumbai"}
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold font-headline tracking-tight text-foreground leading-[1.1]">
            Craving the Best <span className="text-primary italic">Momos in Mumbai?</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {profile?.description || "Freshly prepared steam, fried, and kurkure momos. Pure veg and Jain options that will keep you coming back for more."}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button size="lg" className="w-full sm:w-auto px-8 h-14 text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25" asChild>
              <Link href="/menu">
                Order Your Plate <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-14 text-base border-primary/20 hover:bg-secondary">
                  <Phone className="mr-2 w-4 h-4" /> Call to Order
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 rounded-2xl p-2">
                <DropdownMenuItem className="rounded-xl h-12 font-black cursor-pointer" asChild>
                  <a href={`tel:${amitNumber}`}>Call Amit (Founder)</a>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl h-12 font-black cursor-pointer" asChild>
                  <a href={`tel:${karanNumber}`}>Call Karan (Founder)</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-5xl mx-auto">
            {[
              { icon: Leaf, title: "100% Pure Veg", desc: "Dedicated pure vegetarian and Jain preparation." },
              { icon: Star, title: "4.9 Google Rating", desc: "Loved by the community for taste and quality." },
              { icon: Clock, title: "Quick Evening Bites", desc: "Open 4:00 PM – 10:30 PM for your daily cravings." }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center text-center p-6 rounded-[2rem] bg-white/50 backdrop-blur-sm border border-muted/50 hover:border-primary/20 hover:shadow-xl transition-all group duration-500">
                <feature.icon className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-black text-lg mb-1 tracking-tight">{feature.title}</h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-[200px]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 w-full h-full opacity-10 pointer-events-none">
        <Image
          src={profile?.imageUrl || heroImage.imageUrl}
          alt="Meow Momo Hero Background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          data-ai-hint="steam momos"
        />
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-20 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--secondary)_0%,_transparent_70%)] opacity-30"></div>
    </section>
  );
}
