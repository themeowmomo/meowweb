"use client";

import { Star, Plus, ShoppingBag, Leaf, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

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
  const { addToCart, cart } = useCart();
  const { toast } = useToast();

  const isItemInCart = (name: string, variant?: string) => {
    return cart.some(item => item.name === name && item.variant === variant);
  };

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

  const AddButton = ({ name, price, variant, className }: { name: string, price: number, variant: string, className?: string }) => {
    const inCart = isItemInCart(name, variant);
    return (
      <Button 
        size="sm" 
        variant={inCart ? "default" : "outline"}
        className={cn(
          "h-8 px-3 text-xs font-bold transition-all rounded-lg border-2",
          inCart 
            ? "bg-green-600 border-green-600 hover:bg-green-700 text-white" 
            : "border-primary text-primary hover:bg-primary hover:text-white",
          className
        )}
        onClick={() => handleAddToCart(name, price, variant)}
      >
        {inCart ? (
          <><Check className="w-3.5 h-3.5 mr-1" /> Added</>
        ) : (
          <><Plus className="w-3.5 h-3.5 mr-1" /> Add</>
        )}
      </Button>
    );
  };

  return (
    <section id="menu" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="bg-primary/10 text-primary border-none mb-2 px-4 py-1.5">
            <Leaf className="w-3.5 h-3.5 mr-2" /> 100% PURE VEG & JAIN
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tight">Explore Our Menu</h2>
          <p className="text-muted-foreground text-lg">
            Delicious freshly prepared evening snacks for every craving.
          </p>
        </div>

        <Tabs defaultValue="momos" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-muted p-1 h-14 rounded-full border border-border shadow-sm">
              <TabsTrigger value="momos" className="px-10 rounded-full text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                Momos
              </TabsTrigger>
              <TabsTrigger value="fries" className="px-10 rounded-full text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                Fries
              </TabsTrigger>
              <TabsTrigger value="meal" className="px-10 rounded-full text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                Combos
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="momos" className="mt-0 space-y-20">
            {momoCategories.map((cat) => (
              <div key={cat.id} className="space-y-8">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-black font-headline text-foreground">{cat.title}</h3>
                  <div className="h-0.5 bg-muted flex-grow rounded-full" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {cat.items.map((item) => (
                    <Card key={item.id} className="overflow-hidden border-border/50 hover:shadow-xl transition-all group flex flex-col bg-card shadow-sm rounded-2xl">
                      <div className="relative h-56 w-full overflow-hidden">
                        <Image 
                          src={getImage(cat.image)} 
                          alt={item.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          data-ai-hint="momo plate"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <Badge className="bg-white/95 text-primary border-none shadow-md font-bold px-2 py-0.5">Veg</Badge>
                          {cat.id === 'jain-momos' && <Badge className="bg-accent/95 text-accent-foreground border-none shadow-md font-bold px-2 py-0.5">Jain</Badge>}
                        </div>
                      </div>
                      <CardHeader className="p-6 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-bold tracking-tight">{item.name}</CardTitle>
                          <div className="flex items-center text-accent bg-accent/10 px-2 py-0.5 rounded-md">
                            <Star className="w-3.5 h-3.5 fill-accent" />
                            <span className="text-xs font-bold ml-1">4.9</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{item.desc}</p>
                      </CardHeader>
                      <CardContent className="p-6 mt-auto">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-black text-muted-foreground">5 PCS</span>
                              <span className="text-lg font-black text-primary">₹{item.p5}</span>
                            </div>
                            <AddButton name={item.name} price={item.p5} variant="5-PCS" />
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-black text-muted-foreground">11 PCS</span>
                              <span className="text-lg font-black text-primary">₹{item.p11}</span>
                            </div>
                            <AddButton name={item.name} price={item.p11} variant="11-PCS" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="fries" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {friesItems.map((item) => (
                <Card key={item.id} className="overflow-hidden border-border/50 hover:shadow-xl transition-all flex flex-col bg-card shadow-sm rounded-2xl">
                  <div className="relative h-48 w-full">
                    <Image 
                      src={getImage("cat-fries")} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                      data-ai-hint="french fries"
                    />
                  </div>
                  <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-lg font-bold tracking-tight">{item.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                  </CardHeader>
                  <CardContent className="p-6 mt-auto space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30 border border-border/50">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black text-muted-foreground">Half</span>
                        <span className="text-lg font-black text-primary">₹{item.half}</span>
                      </div>
                      <AddButton name={item.name} price={item.half} variant="Half" />
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30 border border-border/50">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black text-muted-foreground">Full</span>
                        <span className="text-lg font-black text-primary">₹{item.full}</span>
                      </div>
                      <AddButton name={item.name} price={item.full} variant="Full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="meal" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {mealCombos.map((combo) => (
                <Card key={combo.id} className={cn(
                  "overflow-hidden transition-all flex flex-col relative bg-card shadow-sm rounded-2xl",
                  combo.featured ? 'border-primary border-2 shadow-primary/10' : 'border-border/50'
                )}>
                  <div className="relative h-52 w-full">
                    <Image 
                      src={getImage("cat-combo")} 
                      alt={combo.title} 
                      fill 
                      className="object-cover"
                      data-ai-hint="meal combo"
                    />
                    {combo.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-accent text-accent-foreground font-black shadow-lg">BEST VALUE</Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-6 pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-bold tracking-tight">{combo.title}</CardTitle>
                      <span className="text-xl font-black text-primary">₹{combo.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{combo.desc}</p>
                  </CardHeader>
                  <CardContent className="p-6 flex-grow">
                    <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                      <h4 className="text-[10px] font-black uppercase text-muted-foreground mb-3 tracking-widest">What's Inside</h4>
                      <ul className="space-y-2">
                        {combo.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0 mt-auto">
                    <Button 
                      className={cn(
                        "w-full h-12 text-base font-black shadow-md transition-all rounded-xl",
                        isItemInCart(combo.title) 
                          ? "bg-green-600 hover:bg-green-700 text-white" 
                          : "bg-primary hover:bg-primary/90 text-white"
                      )}
                      onClick={() => handleAddToCart(combo.title, combo.price)}
                    >
                      {isItemInCart(combo.title) ? (
                        <><Check className="mr-2 w-5 h-5" /> Added to Order</>
                      ) : (
                        <><ShoppingBag className="mr-2 w-5 h-5" /> Add Meal</>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-24 p-10 bg-foreground text-white rounded-[2rem] relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
          <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-12 items-center gap-10">
            <div className="lg:col-span-3 bg-white/10 backdrop-blur-xl p-8 rounded-[1.5rem] border border-white/20 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <Star className="w-16 h-16 text-accent" fill="currentColor" />
            </div>
            <div className="lg:col-span-6 text-center lg:text-left space-y-4">
              <div className="inline-block bg-accent/20 text-accent px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Loyalty Reward</div>
              <h3 className="text-3xl md:text-4xl font-black font-headline tracking-tighter leading-none">Meow Momo Rewards</h3>
              <p className="text-primary-foreground/70 text-lg leading-relaxed max-w-xl">
                Every plate earns you a stamp! Buy 10 plates and your 11th plate of <span className="text-accent font-bold">Classic Steam Momos</span> is FREE.
              </p>
            </div>
            <div className="lg:col-span-3 w-full">
              <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-white hover:text-primary transition-all font-black h-16 text-lg rounded-2xl shadow-xl shadow-black/40" asChild>
                <a href={`https://wa.me/918850859140?text=Hi, I want to join the Meow Momo Loyalty Club!`}>Join Now</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
