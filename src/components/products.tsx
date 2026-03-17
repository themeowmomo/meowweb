"use client";

import { useState } from "react";
import { Plus, Minus, Leaf, Utensils, Zap, Package } from "lucide-react";
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
      category: "Kurkure Momos (Only Fried)",
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
      category: "Jain Momos",
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
      category: "Fries",
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
        { id: "ml-classic-steam", name: "Classic Steam Meal", price: 110, desc: "Classic Steam Momos (5 pcs) + Masala Fries (Half) + Soft Drink (250 ml)" },
        { id: "ml-classic-fried", name: "Classic Fried Meal", price: 120, desc: "Classic Fried Momos (5 pcs) + Masala Fries (Half) + Soft Drink (250 ml)" },
        { id: "ml-cheese", name: "Cheese Meal", price: 140, desc: "Cheese Fried Momos (5 pcs) + Cheese Fries (Half) + Soft Drink (250 ml)" },
        { id: "ml-peri", name: "Peri Peri Meal", price: 140, desc: "Peri Peri Fried Momos (5 pcs) + Peri Peri Fries (Half) + Soft Drink (250 ml)" },
        { id: "ml-paneer-steam", name: "Paneer Steam Meal", price: 120, desc: "Paneer Steam Momos (5 pcs) + Masala Fries (Half) + Soft Drink (250 ml)" },
        { id: "ml-paneer-fried", name: "Paneer Fried Meal", price: 130, desc: "Paneer Fried Momos (5 pcs) + Masala Fries (Half) + Soft Drink (250 ml)" },
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
      description: `${name} (${variant}) added!`,
    });
  };

  const QuantityControl = ({ name, variant, price, id }: { name: string, variant: string, price: number, id: string }) => {
    const itemId = `${id}-${variant}`;
    const cartItem = cart.find(item => item.id === itemId);
    const quantity = cartItem ? cartItem.quantity : 0;

    if (quantity > 0) {
      return (
        <div className="flex items-center gap-3">
          <Button 
            size="icon" 
            variant="outline"
            className="h-10 w-10 rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-all"
            onClick={() => updateQuantity(itemId, quantity - 1, variant)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-lg font-black w-6 text-center">{quantity}</span>
          <Button 
            size="icon" 
            variant="outline"
            className="h-10 w-10 rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-all"
            onClick={() => updateQuantity(itemId, quantity + 1, variant)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <Button 
        size="lg" 
        variant="outline"
        className="h-12 px-8 text-xs font-black uppercase tracking-widest rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-white shadow-sm transition-all"
        onClick={() => handleAddToCart(name, price, variant, id)}
      >
        <Plus className="w-4 h-4 mr-2" /> Add
      </Button>
    );
  };

  const activeCategories = MENU_DATA[activeTab as keyof typeof MENU_DATA];

  return (
    <section id="menu" className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="bg-primary/10 text-primary border-none mb-2 px-5 py-2 font-black tracking-widest text-[10px] rounded-full">
            <Leaf className="w-3.5 h-3.5 mr-2" /> 100% PURE VEG & JAIN
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter">Our Menu</h2>
          <p className="text-muted-foreground text-lg font-medium">
            Professional quality Street Food. Pure Veg & Jain Specialty.
          </p>
        </div>

        {/* Sticky Nav Bar */}
        <div className="sticky top-20 z-40 mb-12 flex justify-center">
          <div className="bg-white/80 backdrop-blur-xl border-2 border-primary/10 p-2 rounded-[2rem] shadow-2xl flex items-center gap-2 max-w-md w-full">
            {[
              { id: 'momos', name: 'Momos', icon: Utensils },
              { id: 'fries', name: 'Fries', icon: Zap },
              { id: 'combos', name: 'Combos', icon: Package }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.05]" 
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                <tab.icon className="w-4 h-4" /> {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-24">
          {activeCategories.map((group, gIdx) => (
            <div key={gIdx} className="space-y-12">
              <div className="flex flex-col items-center gap-2">
                <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase">{group.category}</h3>
                <div className="w-24 h-1 bg-primary rounded-full mt-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {group.items.map((item: any) => (
                  <Card key={item.id} className="rounded-[2.5rem] border-none shadow-xl bg-white hover:shadow-2xl transition-all duration-500 overflow-hidden group border-2 border-transparent hover:border-primary/5">
                    <CardContent className="p-10 space-y-8">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2">
                          <h4 className="text-2xl font-black leading-none tracking-tight">{item.name}</h4>
                          {item.desc && <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.desc}</p>}
                        </div>
                        {item.isJain && (
                          <Badge className="bg-accent/10 text-accent-foreground border-none text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shrink-0">
                            Jain Special
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Option 1 */}
                        {'price5' in item && (
                          <div className="bg-[#FDFBF7] p-8 rounded-[1.5rem] border border-muted/50 flex flex-col items-center justify-center gap-4 group/box hover:border-primary/20 hover:bg-white transition-all duration-300">
                            <div className="text-center">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">5 PCS</p>
                              <p className="text-2xl font-black text-foreground">₹{item.price5}</p>
                            </div>
                            <QuantityControl name={item.name} variant="5 PCS" price={item.price5} id={item.id} />
                          </div>
                        )}
                        {'price11' in item && (
                          <div className="bg-[#FDFBF7] p-8 rounded-[1.5rem] border border-muted/50 flex flex-col items-center justify-center gap-4 group/box hover:border-primary/20 hover:bg-white transition-all duration-300">
                            <div className="text-center">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">11 PCS</p>
                              <p className="text-2xl font-black text-foreground">₹{item.price11}</p>
                            </div>
                            <QuantityControl name={item.name} variant="11 PCS" price={item.price11} id={item.id} />
                          </div>
                        )}
                        {'priceHalf' in item && (
                          <div className="bg-[#FDFBF7] p-8 rounded-[1.5rem] border border-muted/50 flex flex-col items-center justify-center gap-4 group/box hover:border-primary/20 hover:bg-white transition-all duration-300">
                            <div className="text-center">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Half</p>
                              <p className="text-2xl font-black text-foreground">₹{item.priceHalf}</p>
                            </div>
                            <QuantityControl name={item.name} variant="Half" price={item.priceHalf} id={item.id} />
                          </div>
                        )}
                        {'priceFull' in item && (
                          <div className="bg-[#FDFBF7] p-8 rounded-[1.5rem] border border-muted/50 flex flex-col items-center justify-center gap-4 group/box hover:border-primary/20 hover:bg-white transition-all duration-300">
                            <div className="text-center">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full</p>
                              <p className="text-2xl font-black text-foreground">₹{item.priceFull}</p>
                            </div>
                            <QuantityControl name={item.name} variant="Full" price={item.priceFull} id={item.id} />
                          </div>
                        )}
                        {'price' in item && !('price5' in item) && (
                          <div className="col-span-full bg-[#FDFBF7] p-8 rounded-[1.5rem] border border-muted/50 flex items-center justify-between group/box hover:border-primary/20 hover:bg-white transition-all duration-300">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Combo Price</p>
                              <p className="text-2xl font-black text-foreground">₹{item.price}</p>
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
