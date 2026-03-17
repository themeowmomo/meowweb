"use client";

import { useState } from "react";
import { Plus, Minus, Leaf, Utensils, Zap, Package, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const MENU_DATA = {
  momos: [
    {
      category: "Classic Veg (Pure)",
      items: [
        { id: "cv-steam", name: "Steam", price5: 50, price11: 100 },
        { id: "cv-fried", name: "Fried", price5: 60, price11: 120 },
        { id: "cv-cheese-steam", name: "Cheese Steam", price5: 70, price11: 140 },
        { id: "cv-cheese-fried", name: "Cheese Fried", price5: 80, price11: 160 },
        { id: "cv-peri-steam", name: "Peri Peri Steam", price5: 70, price11: 140 },
        { id: "cv-peri-fried", name: "Peri Peri Fried", price5: 80, price11: 160 },
      ]
    },
    {
      category: "Paneer Momos",
      items: [
        { id: "pn-steam", name: "Paneer Steam", price5: 60, price11: 120 },
        { id: "pn-fried", name: "Paneer Fried", price5: 70, price11: 140 },
        { id: "pn-cheese-steam", name: "Paneer Cheese Steam", price5: 80, price11: 160 },
        { id: "pn-cheese-fried", name: "Paneer Cheese Fried", price5: 90, price11: 180 },
        { id: "pn-peri-steam", name: "Paneer Peri Peri Steam", price5: 90, price11: 180 },
        { id: "pn-peri-fried", name: "Paneer Peri Peri Fried", price5: 99, price11: 199 },
      ]
    },
    {
      category: "Kurkure Momos",
      items: [
        { id: "kk-fried", name: "Kurkure Fried", price5: 70, price11: 140 },
        { id: "kk-cheese", name: "Kurkure Cheese Fried", price5: 90, price11: 180 },
        { id: "kk-peri", name: "Kurkure Peri Peri Fried", price5: 90, price11: 180 },
        { id: "kk-paneer", name: "Kurkure Paneer Fried", price5: 99, price11: 199 },
        { id: "kk-paneer-cheese", name: "Kurkure Paneer Cheese Fried", price5: 110, price11: 200 },
        { id: "kk-paneer-peri", name: "Kurkure Paneer Peri Peri Fried", price5: 110, price11: 200 },
      ]
    },
    {
      category: "Jain Special",
      items: [
        { id: "jn-steam", name: "Jain Steam", price5: 80, price11: 150, isJain: true },
        { id: "jn-fried", name: "Jain Fried", price5: 90, price11: 170, isJain: true },
        { id: "jn-cheese-steam", name: "Jain Cheese Steam", price5: 90, price11: 180, isJain: true },
        { id: "jn-cheese-fried", name: "Jain Cheese Fried", price5: 99, price11: 190, isJain: true },
        { id: "jn-peri-steam", name: "Jain Peri Peri Steam", price5: 90, price11: 180, isJain: true },
        { id: "jn-peri-fried", name: "Jain Peri Peri Fried", price5: 99, price11: 190, isJain: true },
      ]
    }
  ],
  fries: [
    {
      category: "Crispy Fries",
      items: [
        { id: "fr-salted", name: "Salted Fries", priceHalf: 40, priceFull: 70 },
        { id: "fr-cheese", name: "Cheese Fries", priceHalf: 60, priceFull: 110 },
        { id: "fr-peri", name: "Peri Peri Fries", priceHalf: 50, priceFull: 90 },
        { id: "fr-masala", name: "Masala Fries", priceHalf: 50, priceFull: 90 },
      ]
    }
  ],
  combos: [
    {
      category: "Meal Combos",
      items: [
        { id: "ml-classic-steam", name: "Classic Steam Meal", price: 110, desc: "Classic Steam (5 pcs) + Masala Fries (H) + 250ml Drink" },
        { id: "ml-classic-fried", name: "Classic Fried Meal", price: 120, desc: "Classic Fried (5 pcs) + Masala Fries (H) + 250ml Drink" },
        { id: "ml-cheese", name: "Cheese Meal", price: 140, desc: "Cheese Fried (5 pcs) + Cheese Fries (H) + 250ml Drink" },
        { id: "ml-peri", name: "Peri Peri Meal", price: 140, desc: "Peri Peri Fried (5 pcs) + Peri Peri Fries (H) + 250ml Drink" },
        { id: "ml-paneer-steam", name: "Paneer Steam Meal", price: 120, desc: "Paneer Steam (5 pcs) + Masala Fries (H) + 250ml Drink" },
        { id: "ml-paneer-fried", name: "Paneer Fried Meal", price: 130, desc: "Paneer Fried (5 pcs) + Masala Fries (H) + 250ml Drink" },
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
      title: "Added",
      description: `${name} (${variant})`,
    });
  };

  const QuantityControl = ({ name, variant, price, id }: { name: string, variant: string, price: number, id: string }) => {
    const itemId = `${id}-${variant}`;
    const cartItem = cart.find(item => item.id === itemId);
    const quantity = cartItem ? cartItem.quantity : 0;

    if (quantity > 0) {
      return (
        <div className="flex items-center gap-2 bg-primary/5 rounded-lg p-1">
          <Button 
            size="icon" 
            variant="ghost"
            className="h-7 w-7 rounded-md text-primary hover:bg-primary hover:text-white transition-all"
            onClick={() => updateQuantity(itemId, quantity - 1, variant)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-xs font-black w-4 text-center">{quantity}</span>
          <Button 
            size="icon" 
            variant="ghost"
            className="h-7 w-7 rounded-md text-primary hover:bg-primary hover:text-white transition-all"
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
        variant="outline"
        className="h-8 px-4 text-[10px] font-black uppercase tracking-widest rounded-lg border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
        onClick={() => handleAddToCart(name, price, variant, id)}
      >
        Add
      </Button>
    );
  };

  const activeCategories = MENU_DATA[activeTab as keyof typeof MENU_DATA];

  return (
    <section id="menu" className="py-20 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12 space-y-3">
          <Badge className="bg-primary/10 text-primary border-none mb-2 px-4 py-1.5 font-black tracking-widest text-[9px] rounded-full">
            100% PURE VEG & JAIN
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tighter">Menu Selection</h2>
          <p className="text-muted-foreground text-sm font-medium">Professional Street Food. Freshly Prepared Daily.</p>
        </div>

        {/* Sticky Nav Bar */}
        <div className="sticky top-16 z-40 mb-10 flex justify-center">
          <div className="bg-white/90 backdrop-blur-md border border-primary/10 p-1.5 rounded-2xl shadow-xl flex items-center gap-1 w-full max-w-sm">
            {[
              { id: 'momos', name: 'Momos', icon: Utensils },
              { id: 'fries', name: 'Fries', icon: Zap },
              { id: 'combos', name: 'Combos', icon: Package }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" /> {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          {activeCategories.map((group, gIdx) => (
            <div key={gIdx} className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] whitespace-nowrap">{group.category}</h3>
                <div className="h-[1px] w-full bg-primary/10" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.items.map((item: any) => (
                  <Card key={item.id} className="rounded-2xl border-none shadow-sm bg-white hover:shadow-md transition-all duration-300 overflow-hidden border border-muted/50">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="text-base font-black tracking-tight">{item.name}</h4>
                          {item.desc && <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1"><Info className="w-3 h-3" /> {item.desc}</p>}
                        </div>
                        {item.isJain && (
                          <Badge className="bg-accent/10 text-accent-foreground border-none text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                            Jain
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-col gap-3">
                        {/* Momo Pricing Row */}
                        {'price5' in item && (
                          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-muted/50 group/row hover:bg-white hover:border-primary/20 transition-all">
                            <div className="flex flex-col">
                              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">5 PCS</span>
                              <span className="text-sm font-black text-foreground">₹{item.price5}</span>
                            </div>
                            <QuantityControl name={item.name} variant="5 PCS" price={item.price5} id={item.id} />
                          </div>
                        )}
                        {'price11' in item && (
                          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-muted/50 group/row hover:bg-white hover:border-primary/20 transition-all">
                            <div className="flex flex-col">
                              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">11 PCS</span>
                              <span className="text-sm font-black text-foreground">₹{item.price11}</span>
                            </div>
                            <QuantityControl name={item.name} variant="11 PCS" price={item.price11} id={item.id} />
                          </div>
                        )}

                        {/* Fries Pricing Row */}
                        {'priceHalf' in item && (
                          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-muted/50 group/row hover:bg-white hover:border-primary/20 transition-all">
                            <div className="flex flex-col">
                              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Half</span>
                              <span className="text-sm font-black text-foreground">₹{item.priceHalf}</span>
                            </div>
                            <QuantityControl name={item.name} variant="Half" price={item.priceHalf} id={item.id} />
                          </div>
                        )}
                        {'priceFull' in item && (
                          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-muted/50 group/row hover:bg-white hover:border-primary/20 transition-all">
                            <div className="flex flex-col">
                              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Full</span>
                              <span className="text-sm font-black text-foreground">₹{item.priceFull}</span>
                            </div>
                            <QuantityControl name={item.name} variant="Full" price={item.priceFull} id={item.id} />
                          </div>
                        )}

                        {/* Combo Pricing Row */}
                        {'price' in item && !('price5' in item) && (
                          <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10 group/row hover:bg-white hover:border-primary/30 transition-all">
                            <div className="flex flex-col">
                              <span className="text-[8px] font-black text-primary uppercase tracking-widest">Combo Meal</span>
                              <span className="text-lg font-black text-foreground">₹{item.price}</span>
                            </div>
                            <QuantityControl name={item.name} variant="Combo" price={item.price} id={item.id} />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

