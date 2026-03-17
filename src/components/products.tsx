
"use client";

import { useState } from "react";
import { Plus, Minus, Utensils, Zap, Package, Info, Flame, Heart, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Hardcoded menu data reflecting the exact requested structure
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
        { id: "jn-steam", name: "Jain Steam", price5: 80, price11: 150 },
        { id: "jn-fried", name: "Jain Fried", price5: 90, price11: 170 },
        { id: "jn-cheese-steam", name: "Jain Cheese Steam", price5: 90, price11: 180 },
        { id: "jn-cheese-fried", name: "Jain Cheese Fried", price5: 99, price11: 190 },
        { id: "jn-peri-steam", name: "Jain Peri Peri Steam", price5: 90, price11: 180 },
        { id: "jn-peri-fried", name: "Jain Peri Peri Fried", price5: 99, price11: 190 },
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
        <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-1 px-2 border border-primary/10">
          <Button 
            size="icon" 
            variant="ghost"
            className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10"
            onClick={() => updateQuantity(itemId, quantity - 1, variant)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm font-black w-6 text-center text-primary">{quantity}</span>
          <Button 
            size="icon" 
            variant="ghost"
            className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10"
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
        className="h-10 px-6 font-black rounded-xl bg-primary hover:bg-primary/90 shadow-sm"
        onClick={() => handleAddToCart(name, price, variant, id)}
      >
        Add
      </Button>
    );
  };

  const activeCategories = MENU_DATA[activeTab as keyof typeof MENU_DATA];

  return (
    <section id="menu" className="py-24 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12 space-y-4">
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 font-black tracking-widest text-[10px] rounded-full uppercase">
            100% PURE VEG & JAIN SPECIALIST
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tighter">Our Selection</h2>
        </div>

        {/* Sticky Nav Bar */}
        <div className="sticky top-20 z-40 mb-12 flex justify-center px-4">
          <div className="bg-white/90 backdrop-blur-md border-2 border-primary/10 p-1.5 rounded-2xl shadow-xl flex items-center gap-1 w-full max-w-md">
            {[
              { id: 'momos', name: 'Momos', icon: Utensils },
              { id: 'fries', name: 'Fries', icon: Zap },
              { id: 'combos', name: 'Combos', icon: Package }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-lg" 
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                <tab.icon className="w-4 h-4" /> {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-16">
          {activeCategories.map((group, gIdx) => (
            <div key={gIdx} className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-px flex-grow bg-gradient-to-r from-transparent to-primary/20" />
                <h3 className="text-sm font-black text-primary uppercase tracking-[0.3em] whitespace-nowrap">{group.category}</h3>
                <div className="h-px flex-grow bg-gradient-to-l from-transparent to-primary/20" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group.items.map((item: any) => (
                  <Card key={item.id} className="rounded-2xl border-none shadow-sm bg-white overflow-hidden hover:shadow-md transition-all duration-300">
                    <CardContent className="p-6 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="text-lg font-black tracking-tight flex items-center gap-2">
                            {item.name.toLowerCase().includes('peri') ? <Flame className="w-4 h-4 text-primary" /> : 
                             item.name.toLowerCase().includes('cheese') ? <Heart className="w-4 h-4 text-primary" /> :
                             <Utensils className="w-4 h-4 text-primary" />}
                            {item.name}
                          </h4>
                          {item.desc && <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-[250px]">{item.desc}</p>}
                        </div>
                        <Badge variant="outline" className="border-primary/20 text-primary font-black text-[9px] px-2 py-0.5 rounded-lg uppercase tracking-wider">
                          Pure Veg
                        </Badge>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-muted/30">
                        {/* 5-PCS / HALF Column */}
                        {('price5' in item || 'priceHalf' in item) && (
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                {'price5' in item ? '5 PCS' : 'Half Portion'}
                              </span>
                              <p className="text-lg font-black text-primary">₹{'price5' in item ? item.price5 : item.priceHalf}</p>
                            </div>
                            <QuantityControl 
                              name={item.name} 
                              variant={'price5' in item ? '5 PCS' : 'Half'} 
                              price={'price5' in item ? item.price5 : item.priceHalf} 
                              id={item.id} 
                            />
                          </div>
                        )}

                        {/* 11-PCS / FULL Column */}
                        {('price11' in item || 'priceFull' in item) && (
                          <div className="flex items-center justify-between pt-3 border-t border-dashed border-muted/50">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                {'price11' in item ? '11 PCS' : 'Full Portion'}
                              </span>
                              <p className="text-lg font-black text-primary">₹{'price11' in item ? item.price11 : item.priceFull}</p>
                            </div>
                            <QuantityControl 
                              name={item.name} 
                              variant={'price11' in item ? '11 PCS' : 'Full'} 
                              price={'price11' in item ? item.price11 : item.priceFull} 
                              id={item.id} 
                            />
                          </div>
                        )}

                        {/* Combo Pricing Row */}
                        {'price' in item && !('price5' in item) && (
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Full Meal</span>
                              <p className="text-xl font-black text-primary">₹{item.price}</p>
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
