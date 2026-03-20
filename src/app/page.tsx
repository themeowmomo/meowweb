
"use client";

import dynamic from 'next/dynamic';
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Products } from "@/components/products";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

// Dynamically import heavy/non-critical components to reduce initial JS
const AiRecommender = dynamic(() => import("@/components/ai-recommender").then(mod => mod.AiRecommender), {
  loading: () => <div className="h-64 flex items-center justify-center bg-muted/10">Loading Momo Finder...</div>
});

const Testimonials = dynamic(() => import("@/components/testimonials").then(mod => mod.Testimonials), {
  ssr: false // testimonials often rely on browser-only state/randomization
});

const CartSheet = dynamic(() => import("@/components/cart-sheet").then(mod => mod.CartSheet), {
  ssr: false
});

export default function Home() {
  const shopNumber = "918850859140";

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      
      <div id="menu">
        <Products />
      </div>

      <AiRecommender />
      
      <div id="testimonials">
        <Testimonials />
      </div>

      <section className="py-16 relative overflow-hidden bg-primary text-white text-center">
        <div className="container mx-auto px-4 space-y-6">
          <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tight">Ready for a Delicious Snack?</h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg">Order your favorite Pure Veg and Jain momos today. Freshly prepared and delivered with care.</p>
          <Button size="lg" className="h-16 px-10 text-lg bg-white text-primary hover:bg-secondary font-black rounded-2xl group" asChild>
            <a href="#menu">Browse Full Menu <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></a>
          </Button>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="p-8 md:p-10 bg-foreground text-white rounded-[2rem] flex flex-col lg:flex-row items-center gap-8 shadow-2xl overflow-hidden group">
            <div className="lg:w-1/4 bg-white/10 backdrop-blur-xl p-8 rounded-[1.5rem] rotate-3 group-hover:rotate-0 transition-all"><Star className="w-16 h-16 text-accent" fill="currentColor" /></div>
            <div className="lg:w-1/2 text-center lg:text-left space-y-3">
              <div className="inline-block bg-accent/20 text-accent px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Loyalty Reward</div>
              <h3 className="text-3xl md:text-4xl font-black font-headline tracking-tighter">Meow Momo Rewards</h3>
              <p className="text-primary-foreground/70 text-lg">Every plate earns you a stamp! Buy 10 plates and your 11th plate of <span className="text-accent font-bold">Classic Steam Momos</span> is FREE.</p>
            </div>
            <div className="lg:w-1/4 w-full">
              <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-white hover:text-primary transition-all font-black h-16 text-lg rounded-2xl shadow-xl" asChild>
                <a href={`https://wa.me/${shopNumber}?text=Hi, I want to join the Meow Momo Loyalty Club!`}>Join Now</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <CartSheet />
    </main>
  );
}
