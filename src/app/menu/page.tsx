"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Products } from "@/components/products";
import dynamic from 'next/dynamic';
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

const AiRecommender = dynamic(() => import("@/components/ai-recommender").then(mod => mod.AiRecommender), {
  loading: () => <div className="h-64 flex items-center justify-center bg-muted/10">Loading Momo Finder...</div>
});

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      
      {/* Menu Hero Header */}
      <section className="pt-32 pb-12 bg-white">
        <div className="container mx-auto px-4 text-center space-y-4">
          <Badge className="bg-primary/10 text-primary border-none px-6 py-2 font-black tracking-widest text-[10px] rounded-full uppercase">
            <Sparkles className="w-3.5 h-3.5 mr-2 inline" /> 100% Pure Veg & Jain kitchen
          </Badge>
          <h1 className="text-4xl md:text-7xl font-black font-headline tracking-tighter leading-none">
            Our <span className="text-primary">Delicious</span> Menu
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm font-medium uppercase tracking-[0.2em]">
            Hygienic. Fresh. Data-Optimized.
          </p>
        </div>
      </section>

      {/* Main Product List */}
      <Products />

      {/* AI Recommendation Tool */}
      <div className="pb-24">
        <AiRecommender />
      </div>

      <Footer />
    </main>
  );
}
