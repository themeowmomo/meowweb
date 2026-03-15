
"use client";

import { Star, Plus, Minus, ShoppingBag, Leaf, Check, Utensils, Zap, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const momoCategories = [
  {
    id: "classic-veg",
    title: "Classic (Veg)",
    image: "momo-steam-veg",
    items: [
      { id: "c1", name: "Steam", p5: 50, p11: 100, desc: "Light and healthy steamed veg momos.", image: "momo-steam-veg" },
      { id: "c2", name: "Fried", p5: 60, p11: 120, desc: "Golden fried crispy vegetable momos.", image: "momo-fried-veg" },
      { id: "c3", name: "Cheese Steam", p5: 65, p11: 140, desc: "Steamed momos with melting cheese center.", image: "momo-cheese-steam" },
      { id: "c4", name: "Cheese Fried", p5: 75, p11: 160, desc: "Crispy fried momos oozing with cheese.", image: "momo-cheese-fried" },
      { id: "c5", name: "Peri Peri Steam", p5: 70, p11: 140, desc: "Spicy peri-peri seasoned steamed momos.", image: "momo-peri-steam" },
      { id: "c6", name: "Peri Peri Fried", p5: 80, p11: 160, desc: "Hot and spicy peri-peri fried delights.", image: "momo-peri-fried" },
    ]
  },
  {
    id: "paneer-special",
    title: "Paneer Specialty",
    image: "momo-paneer-steam",
    items: [
      { id: "p1", name: "Paneer Steam", p5: 60, p11: 120, desc: "Soft paneer filling in steamed dumplings.", image: "momo-paneer-steam" },
      { id: "p2", name: "Paneer Fried", p5: 70, p11: 140, desc: "Crispy fried momos with rich paneer.", image: "momo-paneer-fried" },
      { id: "p3", name: "Paneer Cheese Steam", p5: 80, p11: 160, desc: "Double delight of paneer and cheese.", image: "momo-cheese-steam" },
      { id: "p4", name: "Paneer Cheese Fried", p5: 90, p11: 180, desc: "Crunchy paneer and cheese combination.", image: "momo-cheese-fried" },
      { id: "p5", name: "Paneer Peri Peri Steam", p5: 90, p11: 180, desc: "Spiced paneer in steamed casing.", image: "momo-peri-steam" },
      { id: "p6", name: "Paneer Peri Peri Fried", p5: 99, p11: 199, desc: "Fiery paneer fried momos.", image: "momo-peri-fried" },
    ]
  },
  {
    id: "kurkure-crunch",
    title: "Kurkure Fried",
    image: "momo-kurkure-veg",
    items: [
      { id: "k1", name: "Kurkure Veg Fried", p5: 70, p11: 140, desc: "Extra crunchy breaded veg momos.", image: "momo-kurkure-veg" },
      { id: "k2", name: "Kurkure Cheese Fried", p5: 80, p11: 160, desc: "The ultimate crunchy cheesy bite.", image: "momo-cheese-fried" },
      { id: "k3", name: "Kurkure Peri Peri Fried", p5: 80, p11: 160, desc: "Spicy and crunchy texture bomb.", image: "momo-peri-fried" },
      { id: "k4", name: "Kurkure Paneer Fried", p5: 90, p11: 180, desc: "Paneer center with kurkure crunch.", image: "momo-kurkure-veg" },
      { id: "k5", name: "Kurkure Paneer Cheese Fried", p5: 99, p11: 199, desc: "Crunchy, cheesy, and paneer-rich.", image: "momo-cheese-fried" },
      { id: "k6", name: "Kurkure Paneer Peri Peri Fried", p5: 110, p11: 220, desc: "The boldest spicy crunchy momo.", image: "momo-peri-fried" },
    ]
  },
  {
    id: "jain-momos",
    title: "Jain Specialized",
    image: "momo-jain-steam",
    items: [
      { id: "j1", name: "Jain Steam", p5: 80, p11: 150, desc: "Strictly Jain prepared steamed momos.", image: "momo-jain-steam" },
      { id: "j2", name: "Jain Fried", p5: 90, p11: 170, desc: "Golden fried Jain vegetable momos.", image: "momo-fried-veg" },
      { id: "j3", name: "Jain Cheese Steam", p5: 90, p11: 180, desc: "Cheesy delight without root veg.", image: "momo-cheese-steam" },
      { id: "j4", name: "Jain Cheese Fried", p5: 99, p11: 190, desc: "Fried cheesy treats for Jain diet.", image: "momo-cheese-fried" },
      { id: "j5", name: "Jain Peri Peri Steam", p5: 90, p11: 180, desc: "Spicy Jain friendly steamed momos.", image: "momo-peri-steam" },
      { id: "j6", name: "Jain Peri Peri Fried", p5: 99, p11: 190, desc: "Spicy fried momos for Jain lovers.", image: "momo-peri-fried" },
    ]
  }
];

const friesItems = [
  { id: "f1", name: "Salted Fries", half: 35, full: 70, desc: "Classic salted potato fries." },
  { id: "f2", name: "Cheese Fries", half: 50, full: 99, desc: "Fries topped with rich cheese sauce." },
  { id: "f3", name: "Peri Peri Fries", half: 45, full: 90, desc: "Spicy peri-peri seasoned fries." },
  { id: "f4", name: "Masala Fries", half: 40, full: 80, desc: "Indian masala seasoned fries." },
];

const mealCombos = [
  { id: "m1", title: "Classic Steam Meal", price: 90, items: ["5pcs Steam", "Half Fries", "Drink"], desc: "The perfect light evening meal." },
  { id: "m2", title: "Classic Fried Meal", price: 99, items: ["5pcs Fried", "Half Fries", "Drink"], desc: "Satisfying crispy meal combo." },
  { id: "m5", title: "Cheese Meal", price: 130, items: ["5pcs Cheese", "Half Cheese Fries", "Drink"], desc: "For the ultimate cheese lover.", featured: true },
];

export function Products() {
  const { addToCart, cart, updateQuantity } = useCart();
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

  const AddButton = ({ name, price, variant, className }: { name: string, price: number, variant: string, className?: string }) => {
    const cartItem = cart.find(item => item.name === name && item.variant === variant);
    const quantity = cartItem ? cartItem.quantity : 0;
    const itemId = `${name}-${variant || 'default'}`;

    if (quantity > 0) {
      return (
        <div className={cn("flex items-center gap-2", className)}>
          <Button 
            size="icon" 
            variant="outline"
            className="h-9 w-9 rounded-full border-primary text-primary hover:bg-primary hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              updateQuantity(itemId, quantity - 1, variant);
            }}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm font-black w-4 text-center">{quantity}</span>
          <Button 
            size="icon" 
            variant="outline"
            className="h-9 w-9 rounded-full border-primary text-primary hover:bg-primary hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              updateQuantity(itemId, quantity + 1, variant);
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <Button 
        size="sm" 
        variant="outline"
        className={cn(
          "h-9 px-4 text-xs font-bold transition-all rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white",
          className
        )}
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCart(name, price, variant);
        }}
      >
        <Plus className="w-4 h-4 mr-1.5" /> Add
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
          <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter">Explore Our Menu</h2>
          <p className="text-muted-foreground text-lg font-medium">
            Discover the most delicious freshly prepared evening snacks in Malad East.
          </p>
        </div>

        <Tabs defaultValue="momos" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-[#F8F5F2] p-2 h-auto rounded-[2rem] border shadow-sm grid grid-cols-3 w-full max-w-lg">
              <TabsTrigger 
                value="momos" 
                className="flex items-center gap-2 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg"
              >
                <Utensils className="w-4 h-4" /> Momos
              </TabsTrigger>
              <TabsTrigger 
                value="fries" 
                className="flex items-center gap-2 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg"
              >
                <Zap className="w-4 h-4" /> Fries
              </TabsTrigger>
              <TabsTrigger 
                value="meal" 
                className="flex items-center gap-2 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg"
              >
                <Package className="w-4 h-4" /> Combos
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="momos" className="mt-0 outline-none">
            <Accordion type="single" collapsible className="space-y-4" defaultValue={momoCategories[0].id}>
              {momoCategories.map((cat) => (
                <AccordionItem key={cat.id} value={cat.id} className="border-none">
                  <AccordionTrigger className="hover:no-underline py-6 px-8 bg-muted/20 rounded-[2rem] group data-[state=open]:bg-primary data-[state=open]:text-white transition-all shadow-sm">
                    <div className="flex items-center gap-6 text-left">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white/20">
                        <Image 
                          src={getImage(cat.image)} 
                          alt={cat.title} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-2xl font-black font-headline tracking-tighter leading-none">{cat.title}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60">{cat.items.length} Specialties</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-10 pb-4 px-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {cat.items.map((item) => (
                        <Card key={item.id} className="overflow-hidden border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all group flex flex-col bg-white rounded-[2.5rem]">
                          <div className="relative h-64 w-full overflow-hidden">
                            <Image 
                              src={getImage(item.image)} 
                              alt={item.name} 
                              fill 
                              className="object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute top-5 left-5 flex gap-2">
                              <Badge className="bg-white/95 text-primary border-none shadow-md font-black text-[9px] px-3 py-1">PURE VEG</Badge>
                              {cat.id === 'jain-momos' && <Badge className="bg-accent text-accent-foreground border-none shadow-md font-black text-[9px] px-3 py-1">JAIN</Badge>}
                            </div>
                          </div>
                          <CardHeader className="p-8 pb-4">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-2xl font-black tracking-tighter">{item.name}</CardTitle>
                              <div className="flex items-center text-accent">
                                <Star className="w-4 h-4 fill-accent" />
                                <span className="text-xs font-black ml-1.5">4.9</span>
                              </div>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{item.desc}</p>
                          </CardHeader>
                          <CardContent className="p-8 mt-auto space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-muted/50">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black text-muted-foreground tracking-widest uppercase">5 Pieces</span>
                                <span className="text-xl font-black text-primary">Rs.{item.p5}</span>
                              </div>
                              <AddButton name={item.name} price={item.p5} variant="5-PCS" />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-muted/50">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black text-muted-foreground tracking-widest uppercase">11 Pieces</span>
                                <span className="text-xl font-black text-primary">Rs.{item.p11}</span>
                              </div>
                              <AddButton name={item.name} price={item.p11} variant="11-PCS" />
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

          <TabsContent value="fries" className="mt-0 outline-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {friesItems.map((item) => (
                <Card key={item.id} className="overflow-hidden border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all flex flex-col bg-white rounded-[2.5rem]">
                  <div className="relative h-56 w-full">
                    <Image 
                      src={getImage("momo-fries")} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="p-8 pb-2">
                    <CardTitle className="text-xl font-black tracking-tighter">{item.name}</CardTitle>
                    <p className="text-xs font-medium text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                  </CardHeader>
                  <CardContent className="p-8 mt-auto space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-2xl bg-muted/30">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-muted-foreground">Half</span>
                        <span className="text-xl font-black text-primary">Rs.{item.half}</span>
                      </div>
                      <AddButton name={item.name} price={item.half} variant="Half" />
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-2xl bg-muted/30">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-muted-foreground">Full</span>
                        <span className="text-xl font-black text-primary">Rs.{item.full}</span>
                      </div>
                      <AddButton name={item.name} price={item.full} variant="Full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="meal" className="mt-0 outline-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {mealCombos.map((combo) => (
                <Card key={combo.id} className={cn(
                  "overflow-hidden transition-all flex flex-col relative bg-white rounded-[3rem] shadow-sm",
                  combo.featured ? 'border-primary border-4 shadow-primary/10' : 'border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)]'
                )}>
                  <div className="relative h-64 w-full">
                    <Image 
                      src={getImage("momo-combo")} 
                      alt={combo.title} 
                      fill 
                      className="object-cover"
                    />
                    {combo.featured && (
                      <div className="absolute top-6 right-6">
                        <Badge className="bg-accent text-accent-foreground font-black px-4 py-1.5 shadow-xl rounded-full text-[10px] tracking-widest">MUST TRY</Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-10 pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-2xl font-black tracking-tighter">{combo.title}</CardTitle>
                      <span className="text-2xl font-black text-primary">Rs.{combo.price}</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mt-2">{combo.desc}</p>
                  </CardHeader>
                  <CardContent className="p-10 flex-grow">
                    <div className="bg-[#FDFBF7] p-6 rounded-[2rem] border-2 border-dashed border-muted">
                      <h4 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-[0.2em]">What's Inside</h4>
                      <ul className="space-y-3">
                        {combo.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                            <div className="w-2 h-2 rounded-full bg-accent" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <div className="p-10 pt-0 mt-auto">
                    <AddButton name={combo.title} price={combo.price} variant="Combo" className="w-full h-14 rounded-2xl" />
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
