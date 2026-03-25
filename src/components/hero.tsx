
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Star, Clock, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const RESTAURANT_ID = 'meow-momo';

export function Hero() {
  const db = useFirestore();
  const profileRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'restaurants', RESTAURANT_ID);
  }, [db]);
  const { data: profile } = useDoc(profileRef);

  // Use reliable placeholders for immediate LCP while Firestore loads
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-bg")!;
  const amitImg = PlaceHolderImages.find(img => img.id === "founder-amit")!;
  const karanImg = PlaceHolderImages.find(img => img.id === "founder-karan")!;

  const amitNumber = "919867977942";
  const karanNumber = "919324810532";

  return (
    <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden min-h-[600px] flex items-center text-center md:text-left">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-primary text-xs font-bold uppercase tracking-wider mx-auto">
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
            <Button size="lg" className="w-full sm:w-auto px-10 h-16 text-lg font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 rounded-2xl" asChild>
              <Link href="/menu">
                Explore the Menu <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            
            <Popover modal={false}>
              <PopoverTrigger asChild>
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 h-16 text-lg font-black border-2 border-primary/20 md:hover:bg-secondary rounded-2xl">
                  <Phone className="mr-2 w-5 h-5" /> Call to Order
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                align="center" 
                sideOffset={12}
                onOpenAutoFocus={(e) => e.preventDefault()}
                className="w-[320px] rounded-[2.5rem] p-4 shadow-2xl border-none bg-white space-y-3 z-[60]"
              >
                {/* Amit Card */}
                <a href={`tel:${amitNumber}`} className="group flex items-center gap-4 p-3 rounded-2xl bg-muted/20 hover:bg-primary transition-all duration-300">
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 shadow-sm border-2 border-white">
                    <Image src={amitImg.imageUrl} alt="Amit" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-grow text-left">
                    <h4 className="font-black text-sm tracking-tight text-foreground group-hover:text-white transition-colors">Amit Jaiswal</h4>
                  </div>
                  <div className="bg-primary/10 p-2.5 rounded-xl group-hover:bg-white/20 transition-colors">
                    <Phone className="w-4 h-4 text-primary group-hover:text-white" />
                  </div>
                </a>

                {/* Karan Card */}
                <a href={`tel:${karanNumber}`} className="group flex items-center gap-4 p-3 rounded-2xl bg-muted/20 hover:bg-primary transition-all duration-300">
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 shadow-sm border-2 border-white">
                    <Image src={karanImg.imageUrl} alt="Karan" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-grow text-left">
                    <h4 className="font-black text-sm tracking-tight text-foreground group-hover:text-white transition-colors">Karan Sawant</h4>
                  </div>
                  <div className="bg-primary/10 p-2.5 rounded-xl group-hover:bg-white/20 transition-colors">
                    <Phone className="w-4 h-4 text-primary group-hover:text-white" />
                  </div>
                </a>
                
                <p className="text-[8px] text-center font-bold text-muted-foreground/50 uppercase tracking-widest pt-2">Available 4:00 PM – 10:30 PM</p>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-5xl mx-auto">
            {[
              { icon: Leaf, title: "100% Pure Veg", desc: "Dedicated pure vegetarian and Jain preparation." },
              { icon: Star, title: "4.9 Google Rating", desc: "Loved by the community for taste and quality." },
              { icon: Clock, title: "Quick Evening Bites", desc: "Open 4:00 PM – 10:30 PM for your daily cravings." }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center text-center p-6 rounded-[2.5rem] bg-white/50 backdrop-blur-sm border border-muted/50 hover:border-primary/20 hover:shadow-xl transition-all group duration-500">
                <feature.icon className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-black text-lg mb-1 tracking-tight uppercase">{feature.title}</h3>
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
