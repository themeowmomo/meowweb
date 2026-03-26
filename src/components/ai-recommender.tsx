
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { aiProductRecommendation, type AiProductRecommendationOutput } from "@/ai/flows/ai-product-recommendation-flow";
import { Sparkles, Loader2, CheckCircle2, Flame, Utensils, Heart, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { placeholderImages as PlaceHolderImages } from "@/app/lib/placeholder-images.json";

const PRODUCT_MAP: Record<string, { price: number; variant: string; imageId: string }> = {
  "Classic Steam": { price: 50, variant: "Plate", imageId: "momo-veg-steam" },
  "Classic Fried": { price: 60, variant: "Plate", imageId: "momo-veg-fried" },
  "Cheese Steam": { price: 70, variant: "Plate", imageId: "momo-veg-cheese-steam" },
  "Cheese Fried": { price: 80, variant: "Plate", imageId: "momo-veg-cheese-fried" },
  "Paneer Steam": { price: 60, variant: "Plate", imageId: "momo-paneer-steam" },
  "Paneer Fried": { price: 70, variant: "Plate", imageId: "momo-paneer-fried" },
  "Kurkure Veg Fried": { price: 70, variant: "Plate", imageId: "momo-kurkure-veg" },
  "Jain Veg Steam": { price: 80, variant: "Plate", imageId: "momo-jain-steam" },
  "Jain Veg Fried": { price: 90, variant: "Plate", imageId: "momo-jain-fried" },
  "Salted Fries": { price: 40, variant: "Half", imageId: "fries-salted" },
  "Cheese Fries": { price: 60, variant: "Half", imageId: "fries-cheese" },
  "Peri Peri Fries": { price: 50, variant: "Half", imageId: "fries-peri-peri" },
  "Masala Fries": { price: 50, variant: "Half", imageId: "fries-masala" },
  "Classic Steam Meal": { price: 110, variant: "Combo", imageId: "combo-classic-steam" },
  "Classic Fried Meal": { price: 120, variant: "Combo", imageId: "combo-classic-fried" },
  "Cheese Meal": { price: 140, variant: "Combo", imageId: "combo-cheese" },
  "Paneer Fried Meal": { price: 130, variant: "Combo", imageId: "combo-paneer-fried" },
};

export function AiRecommender() {
  const [businessNeeds, setBusinessNeeds] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AiProductRecommendationOutput | null>(null);
  const { addToCart, cart, updateQuantity } = useCart();
  const { toast } = useToast();

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

  const handleAddToCart = (name: string) => {
    const matchKey = Object.keys(PRODUCT_MAP).find(key => name.toLowerCase().includes(key.toLowerCase())) || "";
    const productData = PRODUCT_MAP[matchKey] || { price: 70, variant: "Plate", imageId: "momo-veg-steam" };
    addToCart({ 
      id: `${name}-${productData.variant}`, 
      name, 
      price: productData.price, 
      variant: productData.variant,
      image: PlaceHolderImages.find(img => img.id === productData.imageId)?.imageUrl
    });
    toast({ title: "Added to cart", description: `${name} added to your order!` });
  };

  const AddButton = ({ name }: { name: string }) => {
    const matchKey = Object.keys(PRODUCT_MAP).find(key => name.toLowerCase().includes(key.toLowerCase())) || "";
    const productData = PRODUCT_MAP[matchKey] || { price: 70, variant: "Plate", imageId: "momo-veg-steam" };
    const itemId = `${name}-${productData.variant}`;
    const cartItem = cart.find(item => item.id === itemId);
    const quantity = cartItem ? cartItem.quantity : 0;

    if (quantity > 0) {
      return (
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-primary text-primary" onClick={() => updateQuantity(itemId, quantity - 1, productData.variant)}><Minus className="h-3 w-3" /></Button>
          <span className="text-sm font-black w-4 text-center">{quantity}</span>
          <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-primary text-primary" onClick={() => updateQuantity(itemId, quantity + 1, productData.variant)}><Plus className="h-3 w-3" /></Button>
        </div>
      );
    }
    return <Button onClick={() => handleAddToCart(name)} variant="outline" className="h-9 px-4 rounded-lg font-black border-primary text-primary text-xs"><Plus className="mr-1 w-3.5 h-3.5" /> Add</Button>;
  };

  return (
    <section id="ai-tool" className="py-8 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="border-none shadow-xl overflow-hidden rounded-[3rem] bg-white">
          <div className="bg-primary/5 px-10 py-8 text-center border-b border-primary/10">
            <div className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Momo Intelligence
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm font-medium">Describe your mood and our AI will find your perfect snack match instantly.</p>
          </div>
          <CardContent className="p-8 md:p-10 space-y-8">
            <div className="space-y-4">
              <Textarea placeholder="e.g., I want something super crunchy, spicy, and purely Jain..." className="min-h-[120px] text-base p-6 bg-muted/20 focus-visible:ring-primary border-none rounded-2xl" value={businessNeeds} onChange={(e) => setBusinessNeeds(e.target.value)} />
              <Button onClick={handleRecommend} disabled={loading || !businessNeeds.trim()} className="w-full h-16 text-lg font-black bg-primary shadow-xl rounded-2xl transition-all">
                {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Finding the perfect bite...</> : "Get Recommendation"}
              </Button>
            </div>
            {recommendations && (
              <div className="pt-8 border-t border-dashed border-muted animate-in fade-in slide-in-from-top-4 duration-500">
                <h3 className="text-xl font-black mb-6 flex items-center justify-center gap-2 text-primary tracking-tight">
                  <CheckCircle2 className="text-accent w-6 h-6" /> AI Handpicked for You
                </h3>
                <div className="grid gap-4">
                  {recommendations.recommendations.map((rec, idx) => (
                    <div key={idx} className="group p-6 rounded-2xl bg-muted/20 border border-transparent hover:border-primary/10 hover:bg-white hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center gap-6">
                      <div className="bg-white p-3 rounded-xl shadow-sm self-start md:self-center">
                        {rec.explanation.toLowerCase().includes('spicy') ? <Flame className="w-6 h-6 text-primary" /> : rec.explanation.toLowerCase().includes('cheese') ? <Heart className="w-6 h-6 text-primary" /> : <Utensils className="w-6 h-6 text-primary" />}
                      </div>
                      <div className="flex-grow space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <h4 className="text-lg font-black text-foreground tracking-tight">{rec.serviceName}</h4>
                          <AddButton name={rec.serviceName} />
                        </div>
                        <p className="text-muted-foreground text-xs font-medium leading-relaxed">{rec.explanation}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {rec.benefits.map((benefit, bIdx) => <span key={bIdx} className="inline-flex items-center gap-1 text-[9px] font-black bg-white px-3 py-1 rounded-full border border-primary/5 text-muted-foreground uppercase tracking-widest">{benefit}</span>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
