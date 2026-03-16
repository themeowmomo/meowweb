'use client';

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Heart, ShieldCheck, Leaf, Users } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function AboutPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-bg")!;

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-primary/10 text-primary border-none mb-6 px-6 py-2 font-black tracking-widest text-xs rounded-full">
            OUR STORY
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter mb-6">
            The Heart Behind <span className="text-primary">Meow Momo</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Started with a simple goal: To bring the most hygienic, flavorful, and authentic Pure Veg and Jain momos to the residents of Malad East.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-video lg:aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <Image 
                src={heroImage.imageUrl} 
                alt="Meow Momo Kitchen" 
                fill 
                className="object-cover"
                data-ai-hint="cooking momos"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                <p className="text-4xl font-black">Est. 2023</p>
                <p className="font-bold opacity-80">Malad East, Mumbai</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">Quality You Can Trust</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  At Meow Momo, we believe that great food starts with great ingredients. That's why we source our vegetables fresh every morning and prepare our fillings daily in a strictly vegetarian and Jain-friendly kitchen.
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Whether you are a spice lover craving our Peri Peri Fried Momos or someone looking for a light, healthy Jain Steam option, every plate is crafted with care and a touch of Mumbai magic.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-muted/30 rounded-2xl space-y-3">
                  <Leaf className="w-8 h-8 text-primary" />
                  <h3 className="font-black text-lg uppercase tracking-tight">100% Pure Veg</h3>
                  <p className="text-sm text-muted-foreground">Dedicated kitchen with zero cross-contamination.</p>
                </div>
                <div className="p-6 bg-muted/30 rounded-2xl space-y-3">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  <h3 className="font-black text-lg uppercase tracking-tight">Jain Specialist</h3>
                  <p className="text-sm text-muted-foreground">No onion, garlic, or root veg options available.</p>
                </div>
                <div className="p-6 bg-muted/30 rounded-2xl space-y-3">
                  <Heart className="w-8 h-8 text-primary" />
                  <h3 className="font-black text-lg uppercase tracking-tight">Hygienic Prep</h3>
                  <p className="text-sm text-muted-foreground">Fresh ingredients and clean handling always.</p>
                </div>
                <div className="p-6 bg-muted/30 rounded-2xl space-y-3">
                  <Users className="w-8 h-8 text-primary" />
                  <h3 className="font-black text-lg uppercase tracking-tight">Community Favorite</h3>
                  <p className="text-sm text-muted-foreground">Loved by locals with a 4.9 star rating.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-foreground text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-12">Our Mission</h2>
          <div className="max-w-3xl mx-auto p-12 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-xl">
            <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-primary-foreground/80">
              "To serve the most delicious, safe, and accessible vegetarian evening snacks that bring joy to every home in Mumbai."
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
