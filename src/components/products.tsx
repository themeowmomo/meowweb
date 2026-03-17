"use client";

import { useState } from "react";
import { Plus, Minus, Utensils, Zap, Package, Flame, Heart, ChevronDown, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Hardcoded menu data with grouped variants
const MENU_DATA = {
  momos: [
    {
      category: "Classic Veg (Pure)",
      items: [
        {
          name: "Classic Veg",
          variants: [
            { label: "Steam", price5: 50, price11: 100, id: "cv-steam" },
            { label: "Fried", price5: 60, price11: 120, id: "cv-fried" }
          ]
        },
        {
          name: "Cheese Veg",
          variants: [
            { label: "Steam", price5: 70, price11: 140, id: "cv-cheese-steam" },
            { label: "Fried", price5: 80, price11: 160, id: "cv-cheese-fried" }
          ]
        },
        {
          name: "Peri Peri Veg",
          variants: [
            { label: "Steam", price5: 70, price11: 140, id: "cv-peri-steam" },
            { label: "Fried", price5: 80, price11: 160, id: "cv-peri-fried" }
          ]
        }
      ]
    },
    {
      category: "Paneer Momos",
      items: [
        {
          name: "Paneer",
          variants: [
            { label: "Steam", price5: 60, price11: 120, id: "pn-steam" },
            { label: "Fried", price5: 70, price11: 140, id: "pn-fried" }
          ]
        },
        {
          name: "Paneer Cheese",
          variants: [
            { label: "Steam", price5: 80, price11: 160, id: "pn-cheese-steam" },
            { label: "Fried", price5: 90, price11: 180, id: "pn-cheese-fried" }
          ]
        },
        {
          name: "Paneer Peri Peri",
          variants: [
            { label: "Steam", price5: 90, price11: 180, id: "pn-peri-steam" },
            { label: "Fried", price5: 99, price11: 199, id: "pn-peri-fried" }
          ]
        }
      ]
    },
    {
      category: "Kurkure Momos (Fried Only)",
      items: [
        {
          name: "Kurkure Veg",
          variants: [
            { label: "Fried", price5: 70, price11: 140, id: "kk-fried" },
            { label: "Cheese Fried", price5: 90, price11: 180, id: "kk-cheese" },
            { label: "Peri Peri Fried", price5: 90, price11: 180, id: "kk-peri" }
          ]
        },
        {
          name: "Kurkure Paneer",
          variants: [
            { label: "Fried", price5: 99, price11: 199, id: "kk-paneer" },
            { label: "Cheese Fried", price5: 110, price11: 200, id: "kk-paneer-cheese" },
            { label: "Peri Peri Fried", price5: 110, price11: 200, id: "kk-paneer-peri" }
          ]
        }
      ]
    },
    {
      category: "Jain Special",
      items: [
        {
          name: "Jain Veg",
          variants: [
            { label: "Steam", price5: 80, price11: 150, id: "jn-steam" },
            { label: "Fried", price5: 90, price11: 170, id: "jn-fried" }
          ]
        },
        {
          name: "Jain Cheese",
          variants: [
            { label: "Steam", price5: 90, price11: 180, id: "jn-cheese-steam" },
            { label: "Fried", price5: 99, price11: 190, id: "jn-cheese-fried" }
          ]
        },
        {
          name: "Jain Peri Peri",
          variants: [
            { label: "Steam", price5: 90, price11: 180, id: "jn-peri-steam" },
            { label: "Fried", price5: 99, price11: 190, id: "jn-peri-fried" }
          ]
        }
      ]
    }
  ],
  fries: [
    {
      category: "Crispy Fries",
      items: [
        { name: "Salted Fries", priceHalf: 40, priceFull: 70, id: "fr-salted" },
        { name: "Cheese Fries", priceHalf: 60, priceFull: 110, id: "fr-cheese" },
        { name: "Peri Peri Fries", priceHalf: 50, priceFull: 90, id: "fr-peri" },
        { name: "Masala Fries", priceHalf: 50, priceFull: 90, id: "fr-masala" }
      ]
    }
  ],
  combos: [
    {
      category: "Meal Combos",
      items: [
        { id: "ml-classic-steam", name: "Classic Steam Meal", price: 110, desc: "5pcs Steam Momos + Half Masala Fries + Drink" },
        { id: "ml-classic-fried", name: "Classic Fried Meal", price: 120, desc: "5pcs Fried Momos + Half Masala Fries + Drink" },
        { id: "ml-cheese", name: "Cheese Meal", price: 140, desc: "5pcs Cheese Fried + Half Cheese Fries + Drink" },
        { id: "ml-peri", name: "Peri Peri Meal", price: 140, desc: "5pcs Peri Peri Fried + Half Peri Peri Fries + Drink" },
        { id: "ml-paneer-steam", name: "Paneer Steam Meal", price: 120, desc: "5pcs Paneer Steam + Half Masala Fries + Drink" },
        { id: "ml-paneer-fried", name: "Paneer Fried Meal", price: 130, desc: "5pcs Paneer Fried + Half Masala Fries + Drink" }
      ]
    }
  ]
};

export function Products() {
  const { addToCart, cart, updateQuantity } = useCart();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("momos");

  const handleAddToCart = (name: string, price: number, variant: string, id: string) => {
    addToCart({
      id: `${id}-${variant}`,
      name: name,
      price: price,
      variant: variant
    });
    
    toast({
      title: "Added to Order",
      description: `${name} (${variant}) - ₹${price}`,
    });
  };

  const QuantityControl = ({ name, variant, price, id }: { name: string, variant: string, price: number, id: string }) => {
    const itemId = `${id}-${variant}`;
    const cartItem = cart.find(item => item.id === itemId);
    const quantity = cartItem ? cartItem.quantity : 0;

    if (quantity > 0) {
      return (
        <div className="flex items-center gap-3 bg-primary text-white rounded-xl p-1.5 shadow-md shadow-primary/20">
          <Button 
            size="icon" 
            variant="ghost"
            className="h-7 w-7 rounded-lg hover:bg-white/20 text-white p-0"
            onClick={() => updateQuantity(itemId, quantity - 1, variant)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm font-black w-4 text-center">{quantity}</span>
          <Button 
            size="icon" 
            variant="ghost"
            className="h-7 w-7 rounded-lg hover:bg-white/20 text-white p-0"
            onClick={() => updateQuantity(itemId, quantity + 1, variant)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <Button 
        size="sm"
        className="h-10 px-5 text-xs font-black rounded-xl bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
        onClick={() => handleAddToCart(name, price, variant, id)}
      >
        Add
      </Button>
    );
  };

  const activeCategories = MENU_DATA[activeTab as keyof typeof MENU_DATA];

  return (
    <section id="menu" className="py-16 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8 space-y-3">
          <Badge className="bg-primary/10 text-primary border-none px-5 py-2 font-black tracking-widest text-[11px] rounded-full uppercase shadow-sm">
            100% PURE VEG & JAIN SPECIALIST
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-foreground">Choose Your Vibe</h2>
          <p className="text-muted-foreground text-sm font-medium max-w-lg mx-auto">
            Freshly prepared, bite-sized happiness. Select your favorites from our curated Mumbai street-food menu.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="sticky top-20 z-40 mb-10 flex justify-center px-4">
          <div className="bg-white/95 backdrop-blur-xl border border-primary/10 p-1.5 rounded-3xl shadow-2xl shadow-black/5 flex items-center gap-1.5 w-full max-w-lg">
            {[
              { id: 'momos', name: 'Momos', icon: Utensils },
              { id: 'fries', name: 'Fries', icon: Zap },
              { id: 'combos', name: 'Combos', icon: Package }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" 
                    : "hover:bg-muted text-muted-foreground/60"
                )}
              >
                <tab.icon className="w-4 h-4" /> {tab.name}
              </button>
            ))}
          </div>
        </div>

        <Accordion type="multiple" defaultValue={activeCategories.map((_, i) => `category-${i}`)} className="space-y-6">
          {activeCategories.map((category, catIdx) => (
            <AccordionItem key={catIdx} value={`category-${catIdx}`} className="border-none">
              <AccordionTrigger className="hover:no-underline bg-white px-8 py-4 rounded-[2rem] shadow-sm border border-primary/5 mb-4 group transition-all data-[state=open]:shadow-md data-[state=open]:border-primary/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-all duration-500">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-foreground uppercase tracking-widest">{category.category}</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.items.map((item: any, itemIdx: number) => (
                    <Card key={item.id || itemIdx} className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden hover:shadow-xl transition-all duration-500 group">
                      <CardContent className="p-7 space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="text-xl font-black tracking-tighter flex items-center gap-2 uppercase">
                              {item.name.toLowerCase().includes('peri') ? <Flame className="w-5 h-5 text-primary" /> : 
                               item.name.toLowerCase().includes('cheese') ? <Heart className="w-5 h-5 text-primary" /> :
                               <Sparkles className="w-5 h-5 text-primary" />}
                              {item.name}
                            </h4>
                            {item.desc && <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed max-w-[200px] italic">{item.desc}</p>}
                          </div>
                        </div>

                        <div className="space-y-5">
                          {item.variants ? (
                            item.variants.map((variant: any, vIdx: number) => (
                              <div key={vIdx} className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-3 py-1 rounded-full">{variant.label} Variant</span>
                                  <div className="h-px bg-primary/5 flex-grow"></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="flex items-center justify-between bg-white border border-primary/5 p-4 rounded-2xl shadow-sm hover:border-primary/20 transition-all">
                                    <div className="flex flex-col">
                                      <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">5 Pieces</span>
                                      <span className="text-lg font-black text-foreground">₹{variant.price5}</span>
                                    </div>
                                    <QuantityControl 
                                      name={`${item.name} ${variant.label}`} 
                                      variant="5 PCS" 
                                      price={variant.price5} 
                                      id={`${variant.id}-5`} 
                                    />
                                  </div>
                                  <div className="flex items-center justify-between bg-white border border-primary/5 p-4 rounded-2xl shadow-sm hover:border-primary/20 transition-all">
                                    <div className="flex flex-col">
                                      <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">11 Pieces</span>
                                      <span className="text-lg font-black text-foreground">₹{variant.price11}</span>
                                    </div>
                                    <QuantityControl 
                                      name={`${item.name} ${variant.label}`} 
                                      variant="11 PCS" 
                                      price={variant.price11} 
                                      id={`${variant.id}-11`} 
                                    />
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              {('priceHalf' in item) ? (
                                <>
                                  <div className="flex items-center justify-between bg-white border border-primary/5 p-4 rounded-2xl shadow-sm hover:border-primary/20 transition-all">
                                    <div className="flex flex-col">
                                      <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Half Portion</span>
                                      <span className="text-lg font-black text-foreground">₹{item.priceHalf}</span>
                                    </div>
                                    <QuantityControl name={item.name} variant="Half" price={item.priceHalf} id={`${item.id}-half`} />
                                  </div>
                                  <div className="flex items-center justify-between bg-white border border-primary/5 p-4 rounded-2xl shadow-sm hover:border-primary/20 transition-all">
                                    <div className="flex flex-col">
                                      <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Full Portion</span>
                                      <span className="text-lg font-black text-foreground">₹{item.priceFull}</span>
                                    </div>
                                    <QuantityControl name={item.name} variant="Full" price={item.priceFull} id={`${item.id}-full`} />
                                  </div>
                                </>
                              ) : (
                                <div className="col-span-full flex items-center justify-between bg-white border-2 border-primary/5 p-5 rounded-3xl shadow-sm hover:border-primary/20 transition-all">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">Complete Meal Deal</span>
                                    <span className="text-2xl font-black text-primary">₹{item.price}</span>
                                  </div>
                                  <QuantityControl name={item.name} variant="Combo" price={item.price} id={item.id} />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}