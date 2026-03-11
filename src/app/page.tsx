
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Products } from "@/components/products";
import { Testimonials } from "@/components/testimonials";
import { AiRecommender } from "@/components/ai-recommender";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      
      <div id="pricing">
        <Products />
      </div>
      
      <Testimonials />
      
      <AiRecommender />

      {/* Final CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(26,187,227,0.3)_0%,_transparent_50%)] -z-10" />
        
        <div className="container mx-auto px-4 text-center text-white space-y-8">
          <h2 className="text-4xl md:text-5xl font-extrabold font-headline">Ready to Accelerate Your Infrastructure?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Join thousands of enterprises already scaling with Aether Cloud. Get your personalized architecture plan today.
          </p>
          <div className="pt-4">
            <Button size="lg" className="h-16 px-10 text-lg bg-white text-primary hover:bg-white/90 shadow-2xl">
              Request a Consultation <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
