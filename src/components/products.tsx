"use client";

import { Check, Info, Star, ShoppingCart, PlusCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";

const momoCategories = [
  {
    id: "classic-momos",
    title: "Classic Momos",
    description: "Our signature steam and fried momos made with fresh vegetables and thin dough.",
    variants: [
      { name: "Veg Steam", price: 60 },
      { name: "Veg Fried", price: 70 },
      { name: "Jain Available", price: 60, isJain: true }
    ],
    accent: "bg-primary"
  },
  {
    id: "cheese-paneer",
    title: "Cheese & Paneer",
    description: "Loaded with gooey cheese or protein-rich paneer for a heavy and satisfying snack.",
    variants: [
      { name: "Cheese Fried", price: 110 },
      { name: "Paneer Steam", price: 90 },
      { name: "Paneer Fried", price: 100 }
    ],
    accent: "bg-accent",
    popular: true
  },
  {
    id: "specialty-crunch",
    title: "Specialty Crunch",
    description: "Extra crunchy Kurkure momos and fiery Peri Peri variants for spice lovers.",
    variants: [
      { name: "Kurkure Veg", price: 110 },
      { name: "Peri Peri Fried", price: 90 },
      { name: "Peri Peri Steam", price: 80 }
    ],
    accent: "bg-foreground"
  }
];

const friesItems = [
  { id: "f-salted", name: "Salted Fries", half: 35, full: 70, icon: "🍟" },
  { id: "f-cheese", name: "Cheese Fries", half: 50, full: 99, icon: "🧀" },
  { id: "f-peri", name: "Peri Peri Fries", half: 45, full: 90, icon: "🔥" },
  { id: "f-masala", name: "Masala Fries", half: 40, full: 80, icon: "🌶️" },
];

const mealCombos = [
  {
    id: "c-classic-steam",
    title: "Classic Steam Meal",
    price: 99,
    items: ["5pcs Classic Steam", "Half Masala Fries", "250ml Soft Drink"],
    accent: "border-primary/20"
  },
  {
    id: "c-classic-fried",
    title: "Classic Fried Meal",
    price: 110,
    items: ["5pcs Classic Fried", "Half Masala Fries", "250ml Soft Drink"],
    accent: "border-primary/20"
  },
  {
    id: "c-paneer-steam",
    title: "Paneer Steam Meal",
    price: 110,
    items: ["5pcs Paneer Steam", "Half Masala Fries", "250ml Soft Drink"],
    accent: "border-primary/20"
  },
  {
    id: "c-paneer-fried",
    title: "Paneer Fried Meal",
    price: 120,
    items: ["5pcs Paneer Fried", "Half Masala Fries", "250ml Soft Drink"],
    accent: "border-primary/20"
  },
  {
    id: "c-cheese-meal",
    title: "Cheese Meal",
    price: 130,
    items: ["5pcs Cheese Fried", "Half Cheese Fries", "250ml Soft Drink"],
    accent: "border-accent",
    featured: true
  },
  {
    id: "c-peri-meal",
    title: "Peri Peri Meal",
    price: 130,
    items: ["5pcs Peri Peri Fried", "Half Peri Fries", "250ml Soft Drink"],
    accent: "border-primary/40"
  }
];

export function Products() {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item: any, price: number, variant?: string) => {
    addToCart({
      id: item.id || item.title || item.name,
      name: item.title || item.name,
      price: price,
      variant: variant
    });
    
    toast({
      title: "Added to cart",
      description: `${item.title || item.name} ${variant ? `(${variant})` : ''} added successfully!`,
    });
  };

  return (
    <section id="menu" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold font-headline tracking-tight">Our Delicious Menu</h2>
          <p className="text-muted-foreground text-lg">
            Freshly prepared, pure veg and Jain friendly. Add your favorites to cart!
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
              {momoCategories.map((cat) => (
                <Card key={cat.id} className={`relative flex flex-col h-full border-2 transition-all hover:shadow-2xl ${cat.popular ? 'border-primary shadow-xl' : 'border-transparent bg-muted/30'}`}>
                  {cat.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-primary hover:bg-primary text-white px-4 py-1">MOST LOVED</Badge>
                    </div>
                  )}
                  <CardHeader className="pt-8">
                    <div className={`w-12 h-1.5 mb-6 rounded-full ${cat.accent}`} />
                    <CardTitle className="text-2xl font-bold">{cat.title}</CardTitle>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-2">{cat.description}</p>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <div className="space-y-3">
                      {cat.variants.map((variant, vIdx) => (
                        <div key={vIdx} className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm border border-black/5 hover:border-primary/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="bg-secondary p-1 rounded-full"><Check className="w-3.5 h-3.5 text-primary" /></div>
                            <div>
                              <span className="text-sm font-bold">{variant.name}</span>
                              <p className="text-xs text-primary font-bold">₹{variant.price}</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-primary hover:bg-primary hover:text-white rounded-full p-2 h-8 w-8"
                            onClick={() => handleAddToCart(cat, variant.price, variant.name)}
                          >
                            <PlusCircle className="w-5 h-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fries" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {friesItems.map((item) => (
                <Card key={item.id} className="border-none bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <CardHeader className="text-center pb-2">
                    <span className="text-4xl mb-2">{item.icon}</span>
                    <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-primary/10">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground font-medium text-xs">Half Portion</span>
                        <span className="text-lg font-bold text-primary">₹{item.half}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="rounded-full border-primary/20 text-primary h-8"
                        onClick={() => handleAddToCart(item, item.half, "Half")}
                      >
                        Add <ShoppingCart className="ml-1 w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground font-medium text-xs">Full Portion</span>
                        <span className="text-lg font-bold text-primary">₹{item.full}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="default" 
                        className="rounded-full bg-primary h-8"
                        onClick={() => handleAddToCart(item, item.full, "Full")}
                      >
                        Add <ShoppingCart className="ml-1 w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="combos" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mealCombos.map((combo) => (
                <Card key={combo.id} className={`border-2 ${combo.featured ? 'border-accent shadow-lg bg-accent/5' : 'border-muted'} hover:border-primary/50 transition-all`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold text-primary">{combo.title}</CardTitle>
                      <Badge variant="secondary" className="text-lg font-bold">₹{combo.price}</Badge>
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
                    <Button 
                      className={`w-full ${combo.featured ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-primary'}`}
                      onClick={() => handleAddToCart(combo, combo.price)}
                    >
                      Add Combo to Cart
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
