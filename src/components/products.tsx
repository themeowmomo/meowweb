"use client";

import { Check, Info, Flame, Utensils, Star, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const momoCategories = [
  {
    title: "Classic Momos",
    price: "From ₹60",
    description: "Our signature steam and fried momos made with fresh vegetables and thin dough.",
    features: ["Veg Steam (₹60)", "Veg Fried (₹70)", "Jain Available", "Spicy Chutney"],
    accent: "bg-primary"
  },
  {
    title: "Cheese & Paneer",
    price: "From ₹90",
    description: "Loaded with gooey cheese or protein-rich paneer for a heavy and satisfying snack.",
    features: ["Cheese Fried (₹110)", "Paneer Steam (₹90)", "Paneer Fried (₹100)", "Mayo Dip Included"],
    accent: "bg-accent",
    popular: true
  },
  {
    title: "Specialty Crunch",
    price: "From ₹110",
    description: "Extra crunchy Kurkure momos and fiery Peri Peri variants for spice lovers.",
    features: ["Kurkure Veg (₹110)", "Peri Peri Fried (₹90)", "Peri Peri Steam (₹80)", "Unique Flavors"],
    accent: "bg-foreground"
  }
];

const friesItems = [
  { name: "Salted Fries", half: "₹35", full: "₹70", icon: "🍟" },
  { name: "Cheese Fries", half: "₹50", full: "₹99", icon: "🧀" },
  { name: "Peri Peri Fries", half: "₹45", full: "₹90", icon: "🔥" },
  { name: "Masala Fries", half: "₹40", full: "₹80", icon: "🌶️" },
];

const mealCombos = [
  {
    title: "Classic Steam Meal",
    price: "₹99",
    items: ["5pcs Classic Steam", "Half Masala Fries", "250ml Soft Drink"],
    accent: "border-primary/20"
  },
  {
    title: "Classic Fried Meal",
    price: "₹110",
    items: ["5pcs Classic Fried", "Half Masala Fries", "250ml Soft Drink"],
    accent: "border-primary/20"
  },
  {
    title: "Paneer Steam Meal",
    price: "₹110",
    items: ["5pcs Paneer Steam", "Half Masala Fries", "250ml Soft Drink"],
    accent: "border-primary/20"
  },
  {
    title: "Paneer Fried Meal",
    price: "₹120",
    items: ["5pcs Paneer Fried", "Half Masala Fries", "250ml Soft Drink"],
    accent: "border-primary/20"
  },
  {
    title: "Cheese Meal",
    price: "₹130",
    items: ["5pcs Cheese Fried", "Half Cheese Fries", "250ml Soft Drink"],
    accent: "border-accent",
    featured: true
  },
  {
    title: "Peri Peri Meal",
    price: "₹130",
    items: ["5pcs Peri Peri Fried", "Half Peri Fries", "250ml Soft Drink"],
    accent: "border-primary/40"
  }
];

export function Products() {
  return (
    <section id="menu" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold font-headline tracking-tight">Our Delicious Menu</h2>
          <p className="text-muted-foreground text-lg">
            Freshly prepared, pure veg and Jain friendly. Pick your favorites!
          </p>
        </div>

        <Tabs defaultValue="momos" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-secondary/50 p-1 h-14">
              <TabsTrigger value="momos" className="px-8 text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Momos</TabsTrigger>
              <TabsTrigger value="fries" className="px-8 text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Fries</TabsTrigger>
              <TabsTrigger value="combos" className="px-8 text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Meal Combos</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="momos" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {momoCategories.map((product, idx) => (
                <Card key={idx} className={`relative flex flex-col h-full border-2 transition-all hover:shadow-2xl hover:-translate-y-1 ${product.popular ? 'border-primary shadow-xl' : 'border-transparent bg-muted/30'}`}>
                  {product.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-primary hover:bg-primary text-white px-4 py-1">MOST LOVED</Badge>
                    </div>
                  )}
                  <CardHeader className="pt-8">
                    <div className={`w-12 h-1.5 mb-6 rounded-full ${product.accent}`} />
                    <CardTitle className="text-2xl font-bold">{product.title}</CardTitle>
                    <div className="flex items-baseline gap-1 pt-2">
                      <span className="text-3xl font-bold text-primary">{product.price}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-6">
                    <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
                    <ul className="space-y-3">
                      {product.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-3 text-sm">
                          <div className="bg-secondary p-1 rounded-full"><Check className="w-3.5 h-3.5 text-primary" /></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pb-8">
                    <Button variant={product.popular ? "default" : "outline"} className={`w-full h-12 ${product.popular ? 'bg-primary' : 'border-primary/20 hover:bg-secondary'}`} asChild>
                      <a href="https://wa.me/919867977942">Order Now</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fries" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {friesItems.map((item, idx) => (
                <Card key={idx} className="border-none bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <CardHeader className="text-center pb-2">
                    <span className="text-4xl mb-2">{item.icon}</span>
                    <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-primary/10">
                      <span className="text-muted-foreground font-medium">Half</span>
                      <span className="text-lg font-bold text-primary">{item.half}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground font-medium">Full</span>
                      <span className="text-lg font-bold text-primary">{item.full}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full text-primary font-bold hover:bg-white/50" asChild>
                      <a href="https://wa.me/919867977942">Add to WhatsApp</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="combos" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mealCombos.map((combo, idx) => (
                <Card key={idx} className={`border-2 ${combo.featured ? 'border-accent shadow-lg bg-accent/5' : 'border-muted'} hover:border-primary/50 transition-all`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold text-primary">{combo.title}</CardTitle>
                      <Badge variant="secondary" className="text-lg font-bold">{combo.price}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {combo.items.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ShoppingCart className="w-4 h-4 text-accent" /> {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className={`w-full ${combo.featured ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-primary'}`} asChild>
                      <a href="https://wa.me/919867977942">Order Combo</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-16 p-8 bg-foreground text-white rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/30 transition-all" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="bg-primary p-6 rounded-2xl shadow-xl shadow-primary/20">
              <Star className="w-12 h-12 text-white" fill="white" />
            </div>
            <div className="flex-grow text-center md:text-left space-y-2">
              <h3 className="text-2xl font-bold font-headline">Meow Momo Loyalty Card</h3>
              <p className="text-primary-foreground/80">Every bite counts! Get a digital stamp on your phone for every purchase. Buy 10 plates and get 1 plate of Classic Steam Momos ABSOLUTELY FREE!</p>
            </div>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-white hover:text-primary transition-all font-bold h-14 px-8">
              Join Loyalty Club
            </Button>
          </div>
        </div>

        <div className="mt-12 p-6 bg-secondary/50 rounded-2xl flex items-center gap-4 text-sm text-primary-foreground border border-primary/10">
          <Info className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-muted-foreground">
            <strong>Note:</strong> All our items are Pure Vegetarian. Jain options (without onion, garlic, and root vegetables) are available for almost all categories. Please mention while ordering.
          </p>
        </div>
      </div>
    </section>
  );
}
