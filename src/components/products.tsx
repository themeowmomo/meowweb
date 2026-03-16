
"use client";

import { Star, Plus, Minus, Leaf, Utensils, Zap, Package, Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

const RESTAURANT_ID = 'meow-momo';

export function Products() {
  const { addToCart, cart, updateQuantity } = useCart();
  const { toast } = useToast();
  const db = useFirestore();

  // Fetch Categories from Firestore
  const categoriesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'restaurants', RESTAURANT_ID, 'menuCategories');
  }, [db]);
  const { data: categories, isLoading: isCategoriesLoading } = useCollection(categoriesQuery);

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

        {isCategoriesLoading ? (
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
            <p className="mt-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Preparing Menu...</p>
          </div>
        ) : (
          <Tabs defaultValue="momos" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-[#F8F5F2] p-2 h-auto rounded-[2rem] border shadow-sm grid grid-cols-3 w-full max-w-lg">
                <TabsTrigger value="momos" className="flex items-center gap-2 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest">
                  <Utensils className="w-4 h-4" /> Momos
                </TabsTrigger>
                <TabsTrigger value="fries" className="flex items-center gap-2 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest">
                  <Zap className="w-4 h-4" /> Fries
                </TabsTrigger>
                <TabsTrigger value="meal" className="flex items-center gap-2 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest">
                  <Package className="w-4 h-4" /> Combos
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="momos" className="mt-0 outline-none">
              <Accordion type="single" collapsible className="space-y-4" defaultValue={categories?.[0]?.id}>
                {categories?.filter(c => !c.name.toLowerCase().includes('fries') && !c.name.toLowerCase().includes('combo')).map((cat) => (
                  <AccordionItem key={cat.id} value={cat.id} className="border-none">
                    <AccordionTrigger className="hover:no-underline py-6 px-8 bg-muted/20 rounded-[2rem] group data-[state=open]:bg-primary data-[state=open]:text-white transition-all shadow-sm">
                      <div className="flex items-center gap-6 text-left">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white/20">
                          {cat.imageUrl ? (
                            <img src={cat.imageUrl} alt={cat.name} className="object-cover w-full h-full" />
                          ) : (
                            <Utensils className="w-full h-full p-3 opacity-20" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-2xl font-black font-headline tracking-tighter leading-none">{cat.name}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60">{cat.description || 'Specialty'}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-10 pb-4 px-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <MenuItemGrid catId={cat.id} AddButton={AddButton} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="fries" className="mt-0 outline-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {categories?.filter(c => c.name.toLowerCase().includes('fries')).map((cat) => (
                  <MenuItemGrid key={cat.id} catId={cat.id} AddButton={AddButton} isFries />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="meal" className="mt-0 outline-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories?.filter(c => c.name.toLowerCase().includes('combo') || c.name.toLowerCase().includes('meal')).map((cat) => (
                  <MenuItemGrid key={cat.id} catId={cat.id} AddButton={AddButton} isCombo />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </section>
  );
}

function MenuItemGrid({ catId, AddButton, isFries, isCombo }: { catId: string, AddButton: any, isFries?: boolean, isCombo?: boolean }) {
  const db = useFirestore();
  const itemsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'restaurants', RESTAURANT_ID, 'menuCategories', catId, 'menuItems');
  }, [db, catId]);
  
  const { data: items, isLoading } = useCollection(itemsQuery);

  if (isLoading) return <div className="flex items-center justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <>
      {items?.map((item: any) => (
        <Card key={item.id} className={cn(
          "overflow-hidden transition-all flex flex-col bg-white",
          isCombo ? "rounded-[3rem] shadow-sm border-2" : "rounded-[2.5rem] border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
        )}>
          <div className={cn("relative w-full overflow-hidden", isFries ? "h-56" : "h-64")}>
            {item.imageUrl && (
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000"
              />
            )}
            <div className="absolute top-5 left-5 flex gap-2">
              <Badge className="bg-white/95 text-primary border-none shadow-md font-black text-[9px] px-3 py-1">PURE VEG</Badge>
              {item.isJain && <Badge className="bg-accent text-accent-foreground border-none shadow-md font-black text-[9px] px-3 py-1">JAIN</Badge>}
            </div>
          </div>
          <CardHeader className="p-8 pb-4">
            <div className="flex justify-between items-start">
              <CardTitle className={cn("font-black tracking-tighter", isCombo ? "text-2xl" : "text-xl")}>{item.name}</CardTitle>
              {!isCombo && (
                <div className="flex items-center text-accent">
                  <Star className="w-4 h-4 fill-accent" />
                  <span className="text-xs font-black ml-1.5">4.9</span>
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
          </CardHeader>
          <CardContent className="p-8 mt-auto space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-muted/50">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-muted-foreground tracking-widest uppercase">Price</span>
                <span className="text-xl font-black text-primary">Rs.{item.price}</span>
              </div>
              <AddButton name={item.name} price={item.price} variant="Standard" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
