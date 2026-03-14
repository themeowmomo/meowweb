"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { aiProductRecommendation, type AiProductRecommendationOutput } from "@/ai/flows/ai-product-recommendation-flow";
import { Sparkles, Loader2, CheckCircle2, Flame, Utensils, Heart, Plus, Check } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mapping common AI recommendations to actual menu items/prices for cart integration
const PRODUCT_MAP: Record<string, { price: number; variant: string }> = {
  "Classic Steam": { price: 50, variant: "5-PCS" },
  "Classic Fried": { price: 60, variant: "5-PCS" },
  "Cheese Steam": { price: 65, variant: "5-PCS" },
  "Cheese Fried": { price: 75, variant: "5-PCS" },
  "Peri Peri Steam": { price: 70, variant: "5-PCS" },
  "Peri Peri Fried": { price: 80, variant: "5-PCS" },
  "Paneer Steam": { price: 60, variant: "5-PCS" },
  "Paneer Fried": { price: 70, variant: "5-PCS" },
  "Kurkure Veg Fried": { price: 70, variant: "5-PCS" },
  "Jain Steam": { price: 80, variant: "5-PCS" },
  "Salted Fries": { price: 35, variant: "Half" },
  "Cheese Fries": { price: 50, variant: "Half" },
  "Peri Peri Fries": { price: 45, variant: "Half" },
  "Masala Fries": { price: 40, variant: "Half" },
  "Classic Steam Meal": { price: 90, variant: "Combo" },
  "Classic Fried Meal": { price: 99, variant: "Combo" },
  "Paneer Steam Meal": { price: 110, variant: "Combo" },
  "Cheese Meal": { price: 130, variant: "Combo" },
  "Peri Peri Meal": { price: 130, variant: "Combo" },
};

export function AiRecommender() {
  const [businessNeeds, setBusinessNeeds] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AiProductRecommendationOutput | null>(null);
  const { addToCart, cart } = useCart();
  const { toast } = useToast();

  const shopNumber = "918850859140";

  const handleRecommend = async () => {
    if (!businessNeeds.trim()) return;
    setLoading(true);
    try {
      const result = await aiProductRecommendation({ businessNeeds });
      setRecommendations(result);
    } catch (error) {
      console.error("Failed to get recommendations", error);
    } finally {
      setLoading(false);
    }
  };

  const isItemInCart = (name: string, variant?: string) => {
    return cart.some(item => item.name === name && item.variant === variant);
  };

  const handleAddToCart = (name: string) => {
    // Try to find the exact match or a partial match in our map
    const matchKey = Object.keys(PRODUCT_MAP).find(key => 
      name.toLowerCase().includes(key.toLowerCase())
    ) || "";
    
    const productData = PRODUCT_MAP[matchKey] || { price: 70, variant: "Standard" }; // Default price if not found

    addToCart({
      id: `ai-${name}`,
      name: name,
      price: productData.price,
      variant: productData.variant
    });
    
    toast({
      title: "Added to cart",
      description: `${name} (${productData.variant}) added to your order!`,
    });
  };

  return (
    <section id="ai-tool" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/10 shadow-2xl overflow-hidden rounded-[2rem]">
            <div className="bg-primary px-8 py-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-accent-foreground font-bold text-xs uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" /> AI Powered Suggester
                </div>
                <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tighter">What's Your Craving?</h2>
                <p className="text-primary-foreground/90 max-w-xl text-lg">
                  Not sure what to order? Describe your taste preferences, and our AI Momo Expert will suggest the perfect items for you.
                </p>
              </div>
            </div>
            
            <CardContent className="p-8 md:p-12 space-y-10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Tell us what you're in the mood for</label>
                  <Textarea 
                    placeholder="e.g., I want something very spicy, crunchy, and it must be Jain..." 
                    className="min-h-[120px] text-lg p-6 bg-muted/30 focus-visible:ring-primary border-none rounded-2xl placeholder:text-muted-foreground/50"
                    value={businessNeeds}
                    onChange={(e) => setBusinessNeeds(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleRecommend} 
                  disabled={loading || !businessNeeds.trim()} 
                  className="w-full h-16 text-xl font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Cooking suggestions...
                    </>
                  ) : (
                    "Find My Perfect Momo"
                  )}
                </Button>
              </div>

              {recommendations && (
                <div className="pt-10 border-t border-border/50 animate-in fade-in slide-in-from-top-4 duration-500">
                  <h3 className="text-2xl font-black mb-8 flex items-center gap-2 text-primary tracking-tight">
                    <CheckCircle2 className="text-accent w-7 h-7" /> 
                    Our Expert Picks for You
                  </h3>
                  <div className="grid gap-6">
                    {recommendations.recommendations.map((rec, idx) => {
                      // Attempt to match for the variant text in the UI
                      const matchKey = Object.keys(PRODUCT_MAP).find(key => 
                        rec.serviceName.toLowerCase().includes(key.toLowerCase())
                      ) || "";
                      const variant = PRODUCT_MAP[matchKey]?.variant || "";
                      const inCart = isItemInCart(rec.serviceName, variant);

                      return (
                        <div key={idx} className="group p-8 rounded-[1.5rem] bg-muted/30 border-2 border-transparent hover:border-primary/10 hover:bg-white hover:shadow-xl transition-all">
                          <div className="flex flex-col md:flex-row md:items-start gap-8">
                            <div className="bg-white p-4 rounded-2xl shadow-sm self-start group-hover:scale-110 transition-transform duration-500">
                              {rec.explanation.toLowerCase().includes('spicy') || rec.explanation.toLowerCase().includes('peri') ? (
                                <Flame className="w-8 h-8 text-primary" />
                              ) : rec.explanation.toLowerCase().includes('cheese') ? (
                                <Heart className="w-8 h-8 text-primary" />
                              ) : (
                                <Utensils className="w-8 h-8 text-primary" />
                              )}
                            </div>
                            <div className="flex-grow space-y-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h4 className="text-2xl font-black text-foreground tracking-tight">{rec.serviceName}</h4>
                                <Button 
                                  onClick={() => handleAddToCart(rec.serviceName)}
                                  variant={inCart ? "default" : "outline"}
                                  className={cn(
                                    "h-12 px-6 rounded-xl font-black transition-all",
                                    inCart 
                                      ? "bg-green-600 border-green-600 hover:bg-green-700 text-white" 
                                      : "border-primary text-primary hover:bg-primary hover:text-white"
                                  )}
                                >
                                  {inCart ? (
                                    <><Check className="mr-2 w-5 h-5" /> Added</>
                                  ) : (
                                    <><Plus className="mr-2 w-5 h-5" /> Add to Order</>
                                  )}
                                </Button>
                              </div>
                              <p className="text-muted-foreground text-lg leading-relaxed">{rec.explanation}</p>
                              <div className="flex flex-wrap gap-2 pt-2">
                                {rec.benefits.map((benefit, bIdx) => (
                                  <span key={bIdx} className="inline-flex items-center gap-1.5 text-xs font-bold bg-white px-4 py-2 rounded-full border shadow-sm text-foreground/70">
                                    <Sparkles className="w-3.5 h-3.5 text-accent" /> {benefit}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-12 text-center p-8 bg-secondary/30 rounded-[1.5rem] border border-secondary/50">
                    <p className="font-bold text-secondary-foreground mb-4 italic">Satisfied with these picks?</p>
                    <Button size="lg" className="bg-primary hover:bg-primary/90 font-black h-14 px-10 rounded-xl shadow-lg" asChild>
                      <a href={`https://wa.me/${shopNumber}`}>Checkout Now via WhatsApp</a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
