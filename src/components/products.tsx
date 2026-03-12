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
    id: "classic-veg",
    title: "Classic (Veg)",
    description: "Our signature pure veg steam and fried momos.",
    items: [
      { name: "Steam", p5: 50, p11: 100 },
      { name: "Fried", p5: 60, p11: 120 },
      { name: "Cheese Steam", p5: 65, p11: 140 },
      { name: "Cheese Fried", p5: 75, p11: 160 },
      { name: "Peri Peri Steam", p5: 70, p11: 140 },
      { name: "Peri Peri Fried", p5: 80, p11: 160 },
    ],
    accent: "bg-primary"
  },
  {
    id: "paneer-special",
    title: "Paneer Specialty",
    description: "Protein-rich paneer fillings for a satisfying bite.",
    items: [
      { name: "Paneer Steam", p5: 60, p11: 120 },
      { name: "Paneer Fried", p5: 70, p11: 140 },
      { name: "Paneer Cheese Steam", p5: 80, p11: 160 },
      { name: "Paneer Cheese Fried", p5: 90, p11: 180 },
      { name: "Paneer Peri Peri Steam", p5: 90, p11: 180 },
      { name: "Paneer Peri Peri Fried", p5: 99, p11: 199 },
    ],
    accent: "bg-accent",
    popular: true
  },
  {
    id: "kurkure-crunch",
    title: "Kurkure Fried",
    description: "Extra crunchy exterior for the ultimate texture.",
    items: [
      { name: "Kurkure Veg Fried", p5: 70, p11: 140 },
      { name: "Kurkure Cheese Fried", p5: 80, p11: 160 },
      { name: "Kurkure Peri Peri Fried", p5: 80, p11: 160 },
      { name: "Kurkure Paneer Fried", p5: 90, p11: 180 },
      { name: "Kurkure Paneer Cheese Fried", p5: 99, p11: 199 },
      { name: "Kurkure Paneer Peri Peri Fried", p5: 110, p11: 220 },
    ],
    accent: "bg-foreground"
  },
  {
    id: "jain-momos",
    title: "Jain Specialized",
    description: "Strictly prepared without onion, garlic, or root vegetables.",
    items: [
      { name: "Jain Steam", p5: 80, p11: 150 },
      { name: "Jain Fried", p5: 90, p11: 170 },
      { name: "Jain Cheese Steam", p5: 90, p11: 180 },
      { name: "Jain Cheese Fried", p5: 99, p11: 190 },
      { name: "Jain Peri Peri Steam", p5: 90, p11: 180 },
      { name: "Jain Peri Peri Fried", p5: 99, p11: 190 },
    ],
    accent: "bg-primary/60"
  }
];

const friesItems = [
  { id: "f-salted", name: "Salted Fries", half: 35, full: 70, icon: "Fries" },
  { id: "f-cheese", name: "Cheese Fries", half: 50, full: 99, icon: "Cheese" },
  { id: "f-peri", name: "Peri Peri Fries", half: 45, full: 90, icon: "Spicy" },
  { id: "f-masala", name: "Masala Fries", half: 40, full: 80, icon: "Masala" },
];

const mealCombos = [
  {
    id: "c-classic-steam",
    title: "Classic Steam Meal",
    price: 90,
    items: ["Classic Steam - 5pcs", "Masala Fries - Half", "Soft drink - 250 ml"],
    accent: "border-primary/20"
  },
  {
    id: "c-classic-fried",
    title: "Classic Fried Meal",
    price: 99,
    items: ["Classic Fried - 5pcs", "Masala Fries - Half", "Soft drink - 250 ml"],
    accent: "border-primary/20"
  },
  {
    id: "c-paneer-steam",
    title: "Paneer Steam Meal",
    price: 110,
    items: ["Paneer Steam - 5pcs", "Masala Fries - Half", "Soft drink - 250 ml"],
    accent: "border-primary/20"
  },
  {
    id: "c-paneer-fried",
    title: "Paneer Fried Meal",
    price: 120,
    items: ["Paneer Fried - 5pcs", "Masala Fries - Half", "Soft drink - 250 ml"],
    accent: "border-primary/20"
  },
  {
    id: "c-cheese-meal",
    title: "Cheese Meal",
    price: 130,
    items: ["Cheese Fried - 5pcs", "Cheese Fries - Half", "Soft drink - 250 ml"],
    accent: "border-accent",
    featured: true
  },
  {
    id: "c-peri-meal",
    title: "Peri Peri Meal",
    price: 130,
    items: ["Peri Peri Fried - 5pcs", "Peri Fries - Half", "Soft drink - 250 ml"],
    accent: "border-primary/40"
  }
];

export function Products() {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (name: string, price: number, variant?: string) => {
    addToCart({
      id: `${name}-${variant || 'default'}`,
      name: name,
      price: price,
      variant: variant
    });
    
    toast({
      title: "Added to cart",
      description: `${name} ${variant ? `(${variant})` : ''} added!`,
    });
  };

  return (
    <section id="menu" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="bg-primary/10 text-primary border-none mb-2">100% PURE VEG & JAIN</Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold font-headline tracking-tight">Our Delicious Menu</h2>
          <p className="text-muted-foreground text-lg">
            Freshly prepared, hygiene-focused snacks. Select your portion and add to cart!
          </p>
        </div>

        <Tabs defaultValue="momos" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-secondary/50 p-1 h-14">
              <TabsTrigger value="momos" className="px-8 text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Momos</TabsTrigger>
              <TabsTrigger value="fries" className="px-8 text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Fries</TabsTrigger>
              <TabsTrigger value="combos" className="px-8 text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Meal Combos</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="momos" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {momoCategories.map((cat) => (
                <Card key={cat.id} className={`relative border-2 transition-all hover:shadow-xl ${cat.popular ? 'border-primary' : 'border-muted/40 bg-muted/5'}`}>
                  {cat.popular && (
                    <div className="absolute -top-3 left-6 z-10">
                      <Badge className="bg-primary text-white">POPULAR CHOICE</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <div className={`w-2 h-6 rounded-full ${cat.accent}`} />
                      {cat.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">{cat.description}</p>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-3">
                    <div className="grid grid-cols-12 mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <div className="col-span-6">Item Name</div>
                      <div className="col-span-3 text-center">5-PCS</div>
                      <div className="col-span-3 text-center">11-PCS</div>
                    </div>
                    {cat.items.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-12 items-center p-2 rounded-lg bg-white border border-black/5 hover:border-primary/20 transition-all group">
                        <div className="col-span-6">
                          <span className="text-sm font-bold group-hover:text-primary transition-colors">{item.name}</span>
                        </div>
                        <div className="col-span-3 flex justify-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 text-xs flex flex-col items-center hover:bg-primary/10 hover:text-primary"
                            onClick={() => handleAddToCart(item.name, item.p5, "5-PCS")}
                          >
                            <span className="font-bold">Rs.{item.p5}</span>
                            <span className="text-[8px] uppercase">Add</span>
                          </Button>
                        </div>
                        <div className="col-span-3 flex justify-center">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="h-8 px-2 text-xs flex flex-col items-center bg-secondary/50"
                            onClick={() => handleAddToCart(item.name, item.p11, "11-PCS")}
                          >
                            <span className="font-bold">Rs.{item.p11}</span>
                            <span className="text-[8px] uppercase">Add</span>
                          </Button>
                        </div>
                      </div>
                    ))}
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
                    <span className="text-lg font-bold mb-2 block text-primary uppercase tracking-tighter">{item.icon}</span>
                    <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-primary/10">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground font-medium text-[10px] uppercase">Half Portion</span>
                        <span className="text-lg font-bold text-primary">Rs.{item.half}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="rounded-full border-primary/20 text-primary h-8"
                        onClick={() => handleAddToCart(item.name, item.half, "Half")}
                      >
                        <PlusCircle className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground font-medium text-[10px] uppercase">Full Portion</span>
                        <span className="text-lg font-bold text-primary">Rs.{item.full}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="default" 
                        className="rounded-full bg-primary h-8"
                        onClick={() => handleAddToCart(item.name, item.full, "Full")}
                      >
                        <PlusCircle className="w-4 h-4" />
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
                <Card key={combo.id} className={`flex flex-col border-2 ${combo.featured ? 'border-accent shadow-lg bg-accent/5' : 'border-muted'} hover:border-primary/50 transition-all`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold text-primary">{combo.title}</CardTitle>
                      <Badge variant="secondary" className="text-lg font-bold">Rs.{combo.price}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-2">
                      {combo.items.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-1 h-1 rounded-full bg-accent" /> {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={`w-full ${combo.featured ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-primary'}`}
                      onClick={() => handleAddToCart(combo.title, combo.price)}
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
              <p className="text-primary-foreground/80">Every bite counts! Buy 10 plates and get 1 plate of Classic Steam Momos ABSOLUTELY FREE! Join our digital loyalty club on WhatsApp today.</p>
            </div>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-white hover:text-primary transition-all font-bold h-14 px-8" asChild>
              <a href={`https://wa.me/918850859140?text=I'd like to join the Meow Momo Loyalty Club!`}>Join Loyalty Club</a>
            </Button>
          </div>
        </div>

        <div className="mt-12 p-6 bg-secondary/50 rounded-2xl flex items-center gap-4 text-sm border border-primary/10">
          <Info className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-muted-foreground">
            <strong>Portion Guide:</strong> Momos are available in 5-PCS (Half) and 11-PCS (Full). All items are Pure Vegetarian. Jain options are prepared separately with strict adherence to guidelines.
          </p>
        </div>
      </div>
    </section>
  );
}
