import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Products } from "@/components/products";
import { Testimonials } from "@/components/testimonials";
import { AiRecommender } from "@/components/ai-recommender";
import { ReviewGenerator } from "@/components/review-generator";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function Home() {
  const shopNumber = "918850859140";

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      
      <div id="pricing">
        <Products />
      </div>
      
      <Testimonials />
      
      {/* Review Helper placed right after testimonials */}
      <ReviewGenerator />
      
      <AiRecommender />

      {/* Final CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(255,255,255,0.2)_0%,_transparent_50%)] -z-10" />
        
        <div className="container mx-auto px-4 text-center text-white space-y-8">
          <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tight">Ready for a Delicious Snack?</h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg md:text-xl">
            Order your favorite Pure Veg and Jain momos today. Freshly prepared and delivered with care.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-16 px-10 text-lg bg-white text-primary hover:bg-secondary hover:text-primary shadow-2xl font-black rounded-2xl group" asChild>
              <a href={`https://wa.me/${shopNumber}`} target="_blank" rel="noopener noreferrer">
                Order Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-10 text-lg border-white text-white hover:bg-white/10 shadow-xl font-bold rounded-2xl" asChild>
              <a href="#menu">
                View Menu <ShoppingBag className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
