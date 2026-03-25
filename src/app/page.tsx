"use client";

import dynamic from 'next/dynamic';
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Faq } from "@/components/faq";
import { Button } from "@/components/ui/button";
import { ArrowRight, UtensilsCrossed, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

// Dynamically import heavy/non-critical components
const Testimonials = dynamic(() => import("@/components/testimonials").then(mod => mod.Testimonials), {
  ssr: false
});

export default function Home() {
  const featuredImage = PlaceHolderImages.find(img => img.id === "combo-meal")!;

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* 1. Hero */}
      <Hero />
      
      {/* 2. Menu CTA Section (Replaces full menu on home) */}
      <section id="menu-preview" className="py-24 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 p-12 md:p-20 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full">
                  <Sparkles className="w-4 h-4" /> Freshly Steamed & Fried
                </div>
                <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter leading-tight">
                  Explore Our <span className="text-primary">Momo Varieties</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  From our signature Cheese Fried to the ultra-crunchy Kurkure and specialized Jain menu, every plate is crafted for the ultimate taste experience.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-16 px-10 text-lg bg-primary font-black rounded-2xl group" asChild>
                  <Link href="/menu">
                    Browse Full Menu <UtensilsCrossed className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-10 text-lg font-black rounded-2xl border-2 border-primary text-primary hover:bg-primary/5" asChild>
                  <Link href="/menu">Order Now</Link>
                </Button>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative aspect-square lg:aspect-auto self-stretch">
              <Image 
                src={featuredImage.imageUrl} 
                alt="Meow Momo Special" 
                fill 
                className="object-cover"
                data-ai-hint="momo meal"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us */}
      <WhyChooseUs />
      
      {/* 4. Reviews */}
      <div id="testimonials">
        <Testimonials />
      </div>

      {/* 5. FAQ */}
      <Faq />

      <section className="py-16 relative overflow-hidden bg-primary text-white text-center">
        <div className="container mx-auto px-4 space-y-6">
          <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tight">Ready for a Delicious Snack?</h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg">Order your favorite Pure Veg and Jain momos today. Freshly prepared and delivered with care.</p>
          <Button size="lg" className="h-16 px-10 text-lg bg-white text-primary hover:bg-secondary font-black rounded-2xl group" asChild>
            <Link href="/menu">Order Your Plate <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></Link>
          </Button>
        </div>
      </section>

      {/* 6. Footer */}
      <Footer />
    </main>
  );
}
