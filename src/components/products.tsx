"use client";

import { useState } from "react";
import { Star, Plus, Minus, Leaf, Utensils, Zap, Package, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Static Menu Data based on user request
const MENU_DATA = {
  momos: [
    {
      category: "Classic Veg (Pure)",
      items: [
        { name: "Classic Steam", p5: 50, p11: 100, isJain: false },
        { name: "Classic Fried", p5: 60, p11: 120, isJain: false },
        { name: "Cheese Steam", p5: 70, p11: 140, isJain: false },
        { name: "Cheese Fried", p5: 80, p11: 160, isJain: false },
        { name: "Peri Peri Steam", p5: 70, p11: 140, isJain: false },
        { name: "Peri Peri Fried", p5: 80, p11: 160, isJain: false },
      ]
    },
    {
      category: "Paneer Special",
      items: [
        { name: "Paneer Steam", p5: 60, p11: 120, isJain: false },
        { name: "Paneer Fried", p5: 70, p11: 140, isJain: false },
        { name: "Paneer Cheese Steam", p5: 80, p11: 160, isJain: false },
        { name: "Paneer Cheese Fried", p5: 90, p11: 180, isJain: false },
        { name: "Paneer Peri Peri Steam", p5: 90, p11: 180, isJain: false },
        { name: "Paneer Peri Peri Fried", p5: 99, p11: 199, isJain: false },
      ]
    },
    {
      category: "Kurkure Crunch (Fried)",
      items: [
        { name: "Kurkure Veg Fried", p5: 70, p11: 140, isJain: false },
        { name: "Kurkure Cheese Fried", p5: 90, p11: 180, isJain: false },
        { name: "Kurkure Peri Peri Fried", p5: 90, p11: 180, isJain: false },
        { name: "Kurkure Paneer Fried", p5: 99, p11: 199, isJain: false },
        { name: "Kurkure Paneer Cheese", p5: 110, p11: 200, isJain: false },
        { name: "Kurkure Paneer Peri Peri", p5: 110, p11: 200, isJain: false },
      ]
    },
    {
      category: "Jain Specialized",
      items: [
        { name: "Jain Steam", p5: 80, p11: 150, isJain: true },
        { name: "Jain Fried", p5: 90, p11: 170, isJain: true },
        { name: "Jain Cheese Steam", p5: 90, p11: 180, isJain: true },
        { name: "Jain Cheese Fried", p5: 99, p11: 190, isJain: true },
        { name: "Jain Peri Peri Steam", p5: 90, p11: 180, isJain: true },
        { name: "Jain Peri Peri Fried", p5: 99, p11: 190, isJain: true },
      ]
    }
  ],
  fries: [
    { name: "Salted Fries", half: 40, full: 70 },
    { name: "Cheese Fries", half: 60, full: 110 },
    { name: "Peri Peri Fries", half: 50, full: 90 },
    { name: "Masala Fries", half: 50, full: 90 },
  ],
  meals: [
    { name: "Classic Steam Meal", price: 110, inclusions: ["5 pcs Classic Steam", "Half Masala Fries", "Soft Drink (250ml)"] },
    { name: "Classic Fried Meal", price: 120, inclusions: ["5 pcs Classic Fried", "Half Masala Fries", "Soft Drink (250ml)"] },
    { name: "Cheese Meal", price: 140, inclusions: ["5 pcs Cheese Fried", "Half Cheese Fries", "Soft Drink (250ml)"] },
    { name: "Peri Peri Meal", price: 140, inclusions: ["5 pcs Peri Peri Fried", "Half Peri Peri Fries", "Soft Drink (250ml)"] },
    { name: "Paneer Steam Meal", price: 120, inclusions: ["5 pcs Paneer Steam", "Half Masala Fries", "Soft Drink (250ml)"] },
    { name: "Paneer Fried Meal", price: 130, inclusions: ["5 pcs Paneer Fried", "Half Masala Fries", "Soft Drink (250ml)"] },
  ]
};

export function Products() {
  const { addToCart, cart, updateQuantity } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (name: string, price: number, variant: string) => {
    addToCart({
      id: `${name}-${variant}`,
      name: name,
      price: price,
      variant: variant
    });
    
    toast({
      title: "Added to cart",
      description: `${name} (${variant}) added!`,
    });
  };

  const QuantityControl = ({ name, variant, price }: { name: string, variant: string, price: number }) => {
    const itemId = `${name}-${variant}`;
    const cartItem = cart.find(item => item.id === itemId);
    const quantity = cartItem ? cartItem.quantity : 0;

    if (quantity > 0) {
      return (
        <div className="flex items-center gap-2">
          <Button 
            size="icon" 
            variant="outline"
            className="h-8 w-8 rounded-full border-primary/40 text-primary"
            onClick={() => updateQuantity(itemId, quantity - 1, variant)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm font-black w-4 text-center">{quantity}</span>
          <Button 
            size="icon" 
            variant="outline"
            className="h-8 w-8 rounded-full border-primary/40 text-primary"
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
        className="h-8 px-3 text-[10px] font-black uppercase tracking-widest rounded-lg border-primary/20 text-primary hover:bg-primary hover:text-white"
        onClick={() => handleAddToCart(name, price, variant)}
      >
        <Plus className="w-3 h-3 mr-1" /> Add
      </Button>
    );
  };

  return (
    <section id="menu" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="bg-primary/10 text-primary border-none mb-2 px-5 py-2 font-black tracking-widest text-[10px] rounded-full">
            <Leaf className="w-3.5 h-3.5 mr-2" /> 100% PURE VEG & JAIN
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter">Meow Menu</h2>
          <p className="text-muted-foreground text-lg font-medium">
            Authentic Mumbai street food with a tech-driven passion for quality.
          </p>
        </div>

        <Tabs defaultValue="momos" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-muted/30 p-2 h-auto rounded-3xl border shadow-sm grid grid-cols-3 w-full max-w-lg">
              <TabsTrigger value="momos" className="flex items-center gap-2 py-4 rounded-2xl text-xs font-black uppercase tracking-widest">
                <Utensils className="w-4 h-4" /> Momos
              </TabsTrigger>
              <TabsTrigger value="fries" className="flex items-center gap-2 py-4 rounded-2xl text-xs font-black uppercase tracking-widest">
                <Zap className="w-4 h-4" /> Fries
              </TabsTrigger>
              <TabsTrigger value="meal" className="flex items-center gap-2 py-4 rounded-2xl text-xs font-black uppercase tracking-widest">
                <Package className="w-4 h-4" /> Combos
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="momos" className="space-y-12">
            {MENU_DATA.momos.map((cat, i) => (
              <div key={i} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">{cat.category}</h3>
                  <div className="flex-grow border-t border-dashed" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.items.map((item, j) => (
                    <Card key={j} className="rounded-[2rem] border-none shadow-sm bg-muted/20 hover:shadow-xl hover:bg-white transition-all overflow-hidden group">
                      <CardContent className="p-8 space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="text-xl font-black leading-tight">{item.name}</h4>
                            <div className="flex gap-2">
                              {item.isJain && <Badge className="bg-accent/20 text-accent-foreground border-none text-[8px] font-black">JAIN</Badge>}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/50 p-4 rounded-2xl border border-transparent hover:border-primary/10 transition-colors">
                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">5 PCS</p>
                            <div className="flex items-center justify-between">
                              <span className="font-black text-lg">₹{item.p5}</span>
                              <QuantityControl name={item.name} variant="5 PCS" price={item.p5} />
                            </div>
                          </div>
                          <div className="bg-white/50 p-4 rounded-2xl border border-transparent hover:border-primary/10 transition-colors">
                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">11 PCS</p>
                            <div className="flex items-center justify-between">
                              <span className="font-black text-lg">₹{item.p11}</span>
                              <QuantityControl name={item.name} variant="11 PCS" price={item.p11} />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="fries">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {MENU_DATA.fries.map((item, i) => (
                <Card key={i} className="rounded-[2rem] border-none shadow-sm bg-muted/20 hover:shadow-xl hover:bg-white transition-all">
                  <CardContent className="p-8 space-y-6">
                    <h4 className="text-xl font-black">{item.name}</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-white/50 p-4 rounded-2xl">
                        <div>
                          <p className="text-[9px] font-black text-muted-foreground">HALF</p>
                          <p className="text-lg font-black">₹{item.half}</p>
                        </div>
                        <QuantityControl name={item.name} variant="Half" price={item.half} />
                      </div>
                      <div className="flex items-center justify-between bg-white/50 p-4 rounded-2xl">
                        <div>
                          <p className="text-[9px] font-black text-muted-foreground">FULL</p>
                          <p className="text-lg font-black">₹{item.full}</p>
                        </div>
                        <QuantityControl name={item.name} variant="Full" price={item.full} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="meal">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MENU_DATA.meals.map((item, i) => (
                <Card key={i} className="rounded-[2.5rem] border-none shadow-sm bg-muted/20 hover:shadow-xl hover:bg-white transition-all relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6">
                    <Package className="w-12 h-12 text-primary opacity-5 group-hover:opacity-20 transition-opacity" />
                  </div>
                  <CardContent className="p-10 space-y-6">
                    <h4 className="text-2xl font-black tracking-tight">{item.name}</h4>
                    <ul className="space-y-2">
                      {item.inclusions.map((inc, j) => (
                        <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {inc}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Meal Price</p>
                        <p className="text-3xl font-black text-primary">₹{item.price}</p>
                      </div>
                      <Button 
                        size="lg" 
                        className="rounded-2xl h-14 px-8 font-black text-sm uppercase shadow-xl shadow-primary/20"
                        onClick={() => handleAddToCart(item.name, item.price, "Combo")}
                      >
                        Order Meal
                      </Button>
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