"use client";

import dynamic from 'next/dynamic';
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Products } from "@/components/products";
import { Footer } from "@/components/footer";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Faq } from "@/components/faq";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

// Dynamically import heavy/non-critical components
const AiRecommender = dynamic(() => import("@/components/ai-recommender").then(mod => mod.AiRecommender), {
  loading: () => <div className="h-64 flex items-center justify-center bg-muted/10">Loading Momo Finder...</div>
});

const Testimonials = dynamic(() => import("@/components/testimonials").then(mod => mod.Testimonials), {
  ssr: false
});

const CartSheet = dynamic(() => import("@/components/cart-sheet").then(mod => mod.CartSheet), {
  ssr: false
});

export default function Home() {
  const shopNumber = "918850859140";

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* 1. Hero */}
      <Hero />
      
      {/* 2. Menu */}
      <div id="menu">
        <Products />
      </div>

      {/* AI Tool can live here as part of the menu exploration */}
      <AiRecommender />

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
            <a href="#menu">Browse Full Menu <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></a>
          </Button>
        </div>
      </section>

      {/* 6. Footer */}
      <Footer />
      
      <CartSheet />
    </main>
  );
}
