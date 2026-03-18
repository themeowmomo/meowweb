
"use client";

import { useState } from "react";
import { Plus, Minus, Utensils, Zap, Package, Flame, Heart, Sparkles } from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
      category: "Kurkure Momos",
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

  const handleAddToCart = (name: string, price: number, variant: string, id: string) => {
    addToCart({ id: `${id}-${variant}`, name, price, variant });
    toast({ title: "Added to Order", description: `${name} (${variant}) - ₹${price}` });
  };

  const QuantityControl = ({ name, variant, price, id }: { name: string, variant: string, price: number, id: string }) => {
    const itemId = `${id}-${variant}`;
    const cartItem = cart.find(item => item.id === itemId);
    const quantity = cartItem ? cartItem.quantity : 0;

    if (quantity > 0) {
      return (
        <div className="flex items-center gap-2 bg-primary text-white rounded-lg p-1 shadow-sm">
          <Button size="icon" variant="ghost" className="h-6 w-6 rounded-md hover:bg-white/20 text-white p-0" onClick={() => updateQuantity(itemId, quantity - 1, variant)}><Minus className="h-3 w-3" /></Button>
          <span className="text-xs font-black w-4 text-center">{quantity}</span>
          <Button size="icon" variant="ghost" className="h-6 w-6 rounded-md hover:bg-white/20 text-white p-0" onClick={() => updateQuantity(itemId, quantity + 1, variant)}><Plus className="h-3 w-3" /></Button>
        </div>
      );
    }
    return <Button size="sm" variant="outline" className="h-8 px-4 text-[10px] font-black rounded-lg border-primary text-primary hover:bg-primary hover:text-white transition-all" onClick={() => handleAddToCart(name, price, variant, id)}>Add</Button>;
  };

  return (
    <section id="menu" className="py-8 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 max-w-5xl space-y-12">
        <div className="text-center space-y-2">
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1 font-black tracking-widest text-[10px] rounded-full uppercase">100% PURE VEG & JAIN SPECIALIST</Badge>
          <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tighter text-foreground leading-none">Our Special Menu</h2>
        </div>

        <Tabs defaultValue="momos" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-16 bg-white border rounded-[1.5rem] p-1 sticky top-20 z-40 shadow-sm">
            <TabsTrigger value="momos" className="rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Utensils className="w-3.5 h-3.5" /> Momos
            </TabsTrigger>
            <TabsTrigger value="fries" className="rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" /> Fries
            </TabsTrigger>
            <TabsTrigger value="combos" className="rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Package className="w-3.5 h-3.5" /> Combos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="momos" className="mt-8">
            <Accordion type="multiple" defaultValue={["momos-0"]} className="space-y-6">
              {MENU_DATA.momos.map((category, catIdx) => (
                <AccordionItem key={catIdx} value={`momos-${catIdx}`} className="border-none bg-white rounded-[2.5rem] shadow-sm border border-primary/5 overflow-hidden transition-all data-[state=open]:shadow-xl data-[state=open]:border-primary/10">
                  <AccordionTrigger className="sticky top-[136px] z-30 bg-white hover:no-underline px-8 py-5 group transition-all data-[state=open]:border-b">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-all"><Utensils className="w-5 h-5" /></div>
                      <h4 className="text-lg font-black text-foreground uppercase tracking-widest">{category.category}</h4>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-8 sm:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.items.map((item: any, itemIdx: number) => (
                        <Card key={itemIdx} className="rounded-3xl border-none shadow-sm bg-muted/5 overflow-hidden hover:shadow-md transition-all">
                          <CardContent className="p-6 space-y-4">
                            <h5 className="text-lg font-black tracking-tight flex items-center gap-2 uppercase">
                              {item.name.toLowerCase().includes('peri') ? <Flame className="w-4 h-4 text-primary" /> : item.name.toLowerCase().includes('cheese') ? <Heart className="w-4 h-4 text-primary" /> : <Sparkles className="w-4 h-4 text-primary" />}
                              {item.name}
                            </h5>
                            <div className="space-y-4">
                              {item.variants.map((v: any, vIdx: number) => (
                                <div key={vIdx} className="space-y-2">
                                  <p className="text-[9px] font-black text-primary/60 uppercase tracking-widest ml-1">{v.label}</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-primary/5">
                                      <div className="flex flex-col"><span className="text-[8px] font-black text-muted-foreground uppercase">5 PCS</span><span className="text-sm font-black">₹{v.price5}</span></div>
                                      <QuantityControl name={`${item.name} ${v.label}`} variant="5 PCS" price={v.price5} id={`${v.id}-5`} />
                                    </div>
                                    <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-primary/5">
                                      <div className="flex flex-col"><span className="text-[8px] font-black text-muted-foreground uppercase">11 PCS</span><span className="text-sm font-black">₹{v.price11}</span></div>
                                      <QuantityControl name={`${item.name} ${v.label}`} variant="11 PCS" price={v.price11} id={`${v.id}-11`} />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="fries" className="mt-8">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MENU_DATA.fries[0].items.map((item: any, idx: number) => (
                  <div key={idx} className="bg-muted/5 p-6 rounded-[2rem] space-y-4 border border-primary/5">
                    <h5 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" /> {item.name}
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
                        <div className="flex flex-col"><span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Half</span><span className="text-base font-black">₹{item.priceHalf}</span></div>
                        <QuantityControl name={item.name} variant="Half" price={item.priceHalf} id={`${item.id}-half`} />
                      </div>
                      <div className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
                        <div className="flex flex-col"><span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Full</span><span className="text-base font-black">₹{item.priceFull}</span></div>
                        <QuantityControl name={item.name} variant="Full" price={item.priceFull} id={`${item.id}-full`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="combos" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MENU_DATA.combos[0].items.map((item: any, idx: number) => (
                <Card key={idx} className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden group hover:scale-[1.02] transition-all">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Package className="w-6 h-6" /></div>
                      <Badge className="bg-primary text-white border-none font-black text-[10px] uppercase">Special Offer</Badge>
                    </div>
                    <div>
                      <h5 className="text-xl font-black uppercase tracking-tight">{item.name}</h5>
                      <p className="text-xs text-muted-foreground font-medium italic mt-1">{item.desc}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-dashed">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Meal Combo</span>
                        <span className="text-2xl font-black text-primary">₹{item.price}</span>
                      </div>
                      <QuantityControl name={item.name} variant="Combo" price={item.price} id={item.id} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
