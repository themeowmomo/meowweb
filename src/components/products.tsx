
"use client";

import { useState } from "react";
import { Plus, Minus, Utensils, Zap, Package, Flame, Heart, ChevronDown } from "lucide-react";
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
      title: "Added to cart",
      description: `${name} (${variant})`,
    });
  };

  const QuantityControl = ({ name, variant, price, id }: { name: string, variant: string, price: number, id: string }) => {
    const itemId = `${id}-${variant}`;
    const cartItem = cart.find(item => item.id === itemId);
    const quantity = cartItem ? cartItem.quantity : 0;

    if (quantity > 0) {
      return (
        <div className="flex items-center gap-1.5 bg-primary/5 rounded-lg p-0.5 px-1 border border-primary/20">
          <Button 
            size="icon" 
            variant="ghost"
            className="h-6 w-6 rounded text-primary hover:bg-primary/10 p-0"
            onClick={() => updateQuantity(itemId, quantity - 1, variant)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-xs font-black w-4 text-center text-primary">{quantity}</span>
          <Button 
            size="icon" 
            variant="ghost"
            className="h-6 w-6 rounded text-primary hover:bg-primary/10 p-0"
            onClick={() => updateQuantity(itemId, quantity + 1, variant)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    return (
      <Button 
        size="sm"
        className="h-7 px-3 text-[10px] font-black rounded-lg bg-primary hover:bg-primary/90 shadow-sm transition-all"
        onClick={() => handleAddToCart(name, price, variant, id)}
      >
        Add
      </Button>
    );
  };

  const activeCategories = MENU_DATA[activeTab as keyof typeof MENU_DATA];

  return (
    <section id="menu" className="py-24 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 font-black tracking-widest text-[10px] rounded-full uppercase">
            100% PURE VEG & JAIN SPECIALIST
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tighter">Menu Selection</h2>
        </div>

        {/* Tab Switcher */}
        <div className="sticky top-20 z-40 mb-12 flex justify-center px-4">
          <div className="bg-white/95 backdrop-blur-md border border-primary/10 p-1 rounded-2xl shadow-xl flex items-center gap-1 w-full max-w-md">
            {[
              { id: 'momos', name: 'Momos', icon: Utensils },
              { id: 'fries', name: 'Fries', icon: Zap },
              { id: 'combos', name: 'Combos', icon: Package }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-lg" 
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" /> {tab.name}
              </button>
            ))}
          </div>
        </div>

        <Accordion type="multiple" defaultValue={activeCategories.map((_, i) => `category-${i}`)} className="space-y-4">
          {activeCategories.map((category, catIdx) => (
            <AccordionItem key={catIdx} value={`category-${catIdx}`} className="border-none">
              <AccordionTrigger className="hover:no-underline bg-white px-6 py-4 rounded-2xl shadow-sm border border-primary/5 mb-2 group transition-all data-[state=open]:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-colors">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-foreground uppercase tracking-widest">{category.category}</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map((item: any, itemIdx: number) => (
                    <Card key={item.id || itemIdx} className="rounded-2xl border-none shadow-sm bg-white overflow-hidden hover:shadow-md transition-all duration-300">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex justify-between items-start border-b border-muted/30 pb-3">
                          <h4 className="text-sm font-black tracking-tight flex items-center gap-2 uppercase">
                            {item.name.toLowerCase().includes('peri') ? <Flame className="w-3.5 h-3.5 text-primary" /> : 
                             item.name.toLowerCase().includes('cheese') ? <Heart className="w-3.5 h-3.5 text-primary" /> :
                             <Utensils className="w-3.5 h-3.5 text-primary" />}
                            {item.name}
                          </h4>
                        </div>

                        {item.desc && <p className="text-[10px] text-muted-foreground font-medium leading-relaxed italic">{item.desc}</p>}

                        <div className="space-y-3">
                          {/* Variant rows for Momos */}
                          {item.variants ? (
                            item.variants.map((variant: any, vIdx: number) => (
                              <div key={vIdx} className="space-y-2 last:mb-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-black text-primary/70 uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md">{variant.label}</span>
                                  <div className="h-px bg-muted/30 flex-grow"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex items-center justify-between bg-muted/20 p-2 px-3 rounded-xl">
                                    <div className="flex flex-col">
                                      <span className="text-[8px] font-black text-muted-foreground/50 uppercase">5 PCS</span>
                                      <span className="text-xs font-black text-foreground">₹{variant.price5}</span>
                                    </div>
                                    <QuantityControl 
                                      name={`${item.name} ${variant.label}`} 
                                      variant="5 PCS" 
                                      price={variant.price5} 
                                      id={`${variant.id}-5`} 
                                    />
                                  </div>
                                  <div className="flex items-center justify-between bg-muted/20 p-2 px-3 rounded-xl">
                                    <div className="flex flex-col">
                                      <span className="text-[8px] font-black text-muted-foreground/50 uppercase">11 PCS</span>
                                      <span className="text-xs font-black text-foreground">₹{variant.price11}</span>
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
                            /* Layout for Fries and Combos */
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              {('priceHalf' in item) ? (
                                <>
                                  <div className="flex items-center justify-between bg-muted/20 p-2 px-3 rounded-xl">
                                    <div className="flex flex-col">
                                      <span className="text-[8px] font-black text-muted-foreground/50 uppercase">Half</span>
                                      <span className="text-xs font-black text-foreground">₹{item.priceHalf}</span>
                                    </div>
                                    <QuantityControl name={item.name} variant="Half" price={item.priceHalf} id={`${item.id}-half`} />
                                  </div>
                                  <div className="flex items-center justify-between bg-muted/20 p-2 px-3 rounded-xl">
                                    <div className="flex flex-col">
                                      <span className="text-[8px] font-black text-muted-foreground/50 uppercase">Full</span>
                                      <span className="text-xs font-black text-foreground">₹{item.priceFull}</span>
                                    </div>
                                    <QuantityControl name={item.name} variant="Full" price={item.priceFull} id={`${item.id}-full`} />
                                  </div>
                                </>
                              ) : (
                                <div className="col-span-2 flex items-center justify-between bg-muted/20 p-3 rounded-xl border border-primary/5">
                                  <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-muted-foreground/50 uppercase tracking-widest">Full Meal</span>
                                    <span className="text-sm font-black text-primary">₹{item.price}</span>
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
