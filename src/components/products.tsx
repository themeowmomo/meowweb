"use client";

import { Star, Plus, ShoppingBag, Info, Leaf } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const momoCategories = [
  {
    id: "classic-veg",
    title: "Classic (Veg)",
    image: "cat-classic",
    items: [
      { id: "c1", name: "Steam", p5: 50, p11: 100, desc: "Light and healthy steamed veg momos." },
      { id: "c2", name: "Fried", p5: 60, p11: 120, desc: "Golden fried crispy vegetable momos." },
      { id: "c3", name: "Cheese Steam", p5: 65, p11: 140, desc: "Steamed momos with melting cheese center." },
      { id: "c4", name: "Cheese Fried", p5: 75, p11: 160, desc: "Crispy fried momos oozing with cheese." },
      { id: "c5", name: "Peri Peri Steam", p5: 70, p11: 140, desc: "Spicy peri-peri seasoned steamed momos." },
      { id: "c6", name: "Peri Peri Fried", p5: 80, p11: 160, desc: "Hot and spicy peri-peri fried delights." },
    ]
  },
  {
    id: "paneer-special",
    title: "Paneer Specialty",
    image: "cat-paneer",
    items: [
      { id: "p1", name: "Paneer Steam", p5: 60, p11: 120, desc: "Soft paneer filling in steamed dumplings." },
      { id: "p2", name: "Paneer Fried", p5: 70, p11: 140, desc: "Crispy fried momos with rich paneer." },
      { id: "p3", name: "Paneer Cheese Steam", p5: 80, p11: 160, desc: "Double delight of paneer and cheese." },
      { id: "p4", name: "Paneer Cheese Fried", p5: 90, p11: 180, desc: "Crunchy paneer and cheese combination." },
      { id: "p5", name: "Paneer Peri Peri Steam", p5: 90, p11: 180, desc: "Spiced paneer in steamed casing." },
      { id: "p6", name: "Paneer Peri Peri Fried", p5: 99, p11: 199, desc: "Fiery paneer fried momos." },
    ]
  },
  {
    id: "kurkure-crunch",
    title: "Kurkure Fried",
    image: "cat-kurkure",
    items: [
      { id: "k1", name: "Kurkure Veg Fried", p5: 70, p11: 140, desc: "Extra crunchy breaded veg momos." },
      { id: "k2", name: "Kurkure Cheese Fried", p5: 80, p11: 160, desc: "The ultimate crunchy cheesy bite." },
      { id: "k3", name: "Kurkure Peri Peri Fried", p5: 80, p11: 160, desc: "Spicy and crunchy texture bomb." },
      { id: "k4", name: "Kurkure Paneer Fried", p5: 90, p11: 180, desc: "Paneer center with kurkure crunch." },
      { id: "k5", name: "Kurkure Paneer Cheese Fried", p5: 99, p11: 199, desc: "Crunchy, cheesy, and paneer-rich." },
      { id: "k6", name: "Kurkure Paneer Peri Peri Fried", p5: 110, p11: 220, desc: "The boldest spicy crunchy momo." },
    ]
  },
  {
    id: "jain-momos",
    title: "Jain Specialized",
    image: "cat-jain",
    items: [
      { id: "j1", name: "Jain Steam", p5: 80, p11: 150, desc: "Strictly Jain prepared steamed momos." },
      { id: "j2", name: "Jain Fried", p5: 90, p11: 170, desc: "Golden fried Jain vegetable momos." },
      { id: "j3", name: "Jain Cheese Steam", p5: 90, p11: 180, desc: "Cheesy delight without root veg." },
      { id: "j4", name: "Jain Cheese Fried", p5: 99, p11: 190, desc: "Fried cheesy treats for Jain diet." },
      { id: "j5", name: "Jain Peri Peri Steam", p5: 90, p11: 180, desc: "Spicy Jain friendly steamed momos." },
      { id: "j6", name: "Jain Peri Peri Fried", p5: 99, p11: 190, desc: "Spicy fried momos for Jain lovers." },
    ]
  }
];

const friesItems = [
  { id: "f1", name: "Salted Fries", half: 35, full: 70, desc: "Classic salted potato fries." },
  { id: "f2", name: "Cheese Fries", half: 50, full: 99, desc: "Fries topped with rich cheese sauce." },
  { id: "f3", name: "Peri Peri Fries", half: 45, full: 90, desc: "Spicy peri-peri seasoned fries." },
  { id: "f4", name: "Masala Fries", half: 40, full: 80, desc: "Zesty Indian masala seasoned fries." },
];

const mealCombos = [
  { id: "m1", title: "Classic Steam Meal", price: 90, items: ["5pcs Steam", "Half Fries", "Drink"], desc: "The perfect light evening meal." },
  { id: "m2", title: "Classic Fried Meal", price: 99, items: ["5pcs Fried", "Half Fries", "Drink"], desc: "Satisfying crispy meal combo." },
  { id: "m3", title: "Paneer Steam Meal", price: 110, items: ["5pcs Paneer", "Half Fries", "Drink"], desc: "Protein packed paneer meal." },
  { id: "m4", title: "Paneer Fried Meal", price: 120, items: ["5pcs Paneer", "Half Fries", "Drink"], desc: "Rich and crispy paneer meal." },
  { id: "m5", title: "Cheese Meal", price: 130, items: ["5pcs Cheese", "Half Cheese Fries", "Drink"], desc: "For the ultimate cheese lover.", featured: true },
  { id: "m6", title: "Peri Peri Meal", price: 130, items: ["5pcs Peri Peri", "Half Peri Fries", "Drink"], desc: "Spice up your evening!" },
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

  const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || "";

  return (
    <section id="menu" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="bg-primary/10 text-primary border-none mb-2 px-4 py-1">
            <Leaf className="w-3 h-3 mr-2" /> 100% PURE VEG & JAIN
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold font-headline tracking-tight">Browse Our Menu</h2>
          <p className="text-muted-foreground text-lg">
            Order your favorite snacks online and pick them up or get them delivered via WhatsApp!
          </p>
        </div>

        <Tabs defaultValue="classic-veg" className="w-full">
          <div className="flex justify-start md:justify-center mb-12 overflow-x-auto no-scrollbar pb-2">
            <TabsList className="bg-secondary/50 p-1 h-auto flex flex-nowrap whitespace-nowrap">
              {momoCategories.map(cat => (
                <TabsTrigger key={cat.id} value={cat.id} className="px-6 py-3 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
                  {cat.title}
                </TabsTrigger>
              ))}
              <TabsTrigger value="fries" className="px-6 py-3 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Fries</TabsTrigger>
              <TabsTrigger value="combos" className="px-6 py-3 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Meal Combos</TabsTrigger>
            </TabsList>
          </div>

          {/* Momo Categories Content */}
          {momoCategories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {cat.items.map((item) => (
                  <Card key={item.id} className="overflow-hidden border-muted/60 hover:shadow-2xl transition-all group flex flex-col">
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image 
                        src={getImage(cat.image)} 
                        alt={item.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        data-ai-hint="momo plate"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-white/90 text-primary border-none shadow-sm backdrop-blur-md">Pure Veg</Badge>
                        {cat.id === 'jain-momos' && <Badge className="bg-accent/90 text-accent-foreground border-none shadow-sm backdrop-blur-md">Jain</Badge>}
                      </div>
                    </div>
                    <CardHeader className="p-5 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
                        <div className="flex items-center text-accent">
                          <Star className="w-4 h-4 fill-accent" />
                          <span className="text-xs font-bold ml-1">4.9</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{item.desc}</p>
                    </CardHeader>
                    <CardContent className="p-5 flex-grow">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-secondary/30 p-3 rounded-xl">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">5 Pieces</span>
                            <span className="text-lg font-extrabold text-primary">Rs.{item.p5}</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-primary hover:bg-primary/90 rounded-full h-10 w-10 p-0 shadow-md"
                            onClick={() => handleAddToCart(item.name, item.p5, "5-PCS")}
                          >
                            <Plus className="w-5 h-5" />
                          </Button>
                        </div>
                        <div className="flex justify-between items-center bg-secondary/30 p-3 rounded-xl">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">11 Pieces (Full)</span>
                            <span className="text-lg font-extrabold text-primary">Rs.{item.p11}</span>
                          </div>
                          <Button 
                            variant="secondary"
                            size="sm" 
                            className="bg-white border hover:bg-secondary rounded-full h-10 w-10 p-0 shadow-sm"
                            onClick={() => handleAddToCart(item.name, item.p11, "11-PCS")}
                          >
                            <Plus className="w-5 h-5 text-primary" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}

          {/* Fries Content */}
          <TabsContent value="fries" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {friesItems.map((item) => (
                <Card key={item.id} className="overflow-hidden border-muted/60 hover:shadow-xl transition-all flex flex-col">
                  <div className="relative h-48 w-full">
                    <Image 
                      src={getImage("cat-fries")} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                      data-ai-hint="french fries"
                    />
                  </div>
                  <CardHeader className="p-5 pb-2">
                    <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </CardHeader>
                  <CardContent className="p-5 flex-grow space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Half</span>
                        <span className="text-base font-bold text-primary">Rs.{item.half}</span>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full h-8 px-3" onClick={() => handleAddToCart(item.name, item.half, "Half")}>
                        Add
                      </Button>
                    </div>
                    <div className="flex justify-between items-center border-t pt-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Full</span>
                        <span className="text-base font-bold text-primary">Rs.{item.full}</span>
                      </div>
                      <Button size="sm" className="bg-primary rounded-full h-8 px-3" onClick={() => handleAddToCart(item.name, item.full, "Full")}>
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Combos Content */}
          <TabsContent value="combos" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {mealCombos.map((combo) => (
                <Card key={combo.id} className={`overflow-hidden transition-all flex flex-col ${combo.featured ? 'border-primary shadow-xl ring-2 ring-primary/10' : 'border-muted'}`}>
                  <div className="relative h-48 w-full">
                    <Image 
                      src={getImage("cat-combo")} 
                      alt={combo.title} 
                      fill 
                      className="object-cover"
                      data-ai-hint="meal combo"
                    />
                    {combo.featured && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-accent text-accent-foreground">BEST VALUE</Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-5 pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-bold">{combo.title}</CardTitle>
                      <span className="text-xl font-black text-primary">Rs.{combo.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{combo.desc}</p>
                  </CardHeader>
                  <CardContent className="p-5 flex-grow">
                    <ul className="space-y-2">
                      {combo.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" /> {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="p-5 pt-0">
                    <Button 
                      className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                      onClick={() => handleAddToCart(combo.title, combo.price)}
                    >
                      Add Meal to Cart <ShoppingBag className="ml-2 w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Loyalty Program Card */}
        <div className="mt-20 p-8 bg-foreground text-white rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:bg-primary/30 transition-all duration-700" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-inner">
              <Star className="w-16 h-16 text-accent" fill="currentColor" />
            </div>
            <div className="flex-grow text-center md:text-left space-y-4">
              <h3 className="text-3xl font-black font-headline tracking-tight">Meow Momo Rewards</h3>
              <p className="text-primary-foreground/70 text-lg leading-relaxed max-w-2xl">
                Every plate brings you closer to a free meal! Buy 10 plates and get 1 plate of <span className="text-accent font-bold">Classic Steam Momos</span> absolutely FREE.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <Badge variant="outline" className="border-white/20 text-white px-4 py-2">Digital Tracking</Badge>
                <Badge variant="outline" className="border-white/20 text-white px-4 py-2">WhatsApp Redemption</Badge>
              </div>
            </div>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-white hover:text-primary transition-all font-black h-16 px-10 text-lg rounded-2xl shadow-xl shadow-black/20" asChild>
              <a href={`https://wa.me/918850859140?text=Hi, I want to join the Meow Momo Rewards Club!`}>Join the Club</a>
            </Button>
          </div>
        </div>

        {/* Portion Guide */}
        <div className="mt-12 p-6 bg-secondary/30 rounded-2xl flex flex-col md:flex-row items-center gap-6 text-sm border border-primary/5">
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <Info className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground leading-relaxed text-center md:text-left">
            <strong className="text-foreground">Order Guide:</strong> We offer flexible portions to satisfy any level of hunger. 
            <span className="font-bold text-primary mx-1">5-PCS</span> is perfect for a light snack, while 
            <span className="font-bold text-primary mx-1">11-PCS</span> is ideal for a full meal. 
            All Jain items are prepared in a dedicated contamination-free area.
          </p>
        </div>
      </div>
    </section>
  );
}