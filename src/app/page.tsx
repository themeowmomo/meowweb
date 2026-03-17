import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Products } from "@/components/products";
import { Testimonials } from "@/components/testimonials";
import { AiRecommender } from "@/components/ai-recommender";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";

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

      {/* Final CTA Section */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(255,255,255,0.2)_0%,_transparent_50%)] -z-10" />
        
        <div className="container mx-auto px-4 text-center text-white space-y-6">
          <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tight">Ready for a Delicious Snack?</h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg leading-relaxed">
            Order your favorite Pure Veg and Jain momos today. Freshly prepared and delivered with care.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-16 px-10 text-lg bg-white text-primary hover:bg-secondary hover:text-primary shadow-2xl font-black rounded-2xl group" asChild>
              <a href="#menu">
                Browse Full Menu <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Loyalty Reward Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="p-8 md:p-10 bg-foreground text-white rounded-[2rem] relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
            <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-12 items-center gap-8">
              <div className="lg:col-span-3 bg-white/10 backdrop-blur-xl p-8 rounded-[1.5rem] border border-white/20 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <Star className="w-16 h-16 text-accent" fill="currentColor" />
              </div>
              <div className="lg:col-span-6 text-center lg:text-left space-y-3">
                <div className="inline-block bg-accent/20 text-accent px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Loyalty Reward</div>
                <h3 className="text-3xl md:text-4xl font-black font-headline tracking-tighter leading-none">Meow Momo Rewards</h3>
                <p className="text-primary-foreground/70 text-lg leading-relaxed max-w-xl">
                  Every plate earns you a stamp! Buy 10 plates and your 11th plate of <span className="text-accent font-bold">Classic Steam Momos</span> is FREE.
                </p>
              </div>
              <div className="lg:col-span-3 w-full">
                <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-white hover:text-primary transition-all font-black h-16 text-lg rounded-2xl shadow-xl shadow-black/40" asChild>
                  <a href={`https://wa.me/${shopNumber}?text=Hi, I want to join the Meow Momo Loyalty Club!`}>Join Now</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
