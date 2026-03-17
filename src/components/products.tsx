
"use client";

import { useState, useEffect } from "react";
import { Star, Plus, Minus, Leaf, Utensils, Zap, Package, Info, ChevronRight, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { cn } from "@/lib/utils";

const RESTAURANT_ID = 'meow-momo';

export function Products() {
  const { addToCart, cart, updateQuantity } = useCart();
  const { toast } = useToast();
  const db = useFirestore();
  const [activeTab, setActiveTab] = useState("momos");

  // Fetch Categories
  const categoriesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'restaurants', RESTAURANT_ID, 'menuCategories'), orderBy('name', 'asc'));
  }, [db]);
  const { data: categories, isLoading: isCatsLoading } = useCollection(categoriesQuery);

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

  const filteredCategories = categories?.filter(cat => {
    if (activeTab === 'momos') return cat.name.toLowerCase().includes('momo');
    if (activeTab === 'fries') return cat.name.toLowerCase().includes('fry') || cat.name.toLowerCase().includes('fries');
    if (activeTab === 'combos') return cat.name.toLowerCase().includes('meal') || cat.name.toLowerCase().includes('combo');
    return true;
  });

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

        {/* Professional Sticky Nav Bar */}
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

        <div className="space-y-16">
          {isCatsLoading ? (
            <div className="p-20 text-center"><Info className="w-10 h-10 animate-pulse mx-auto opacity-20" /></div>
          ) : filteredCategories?.map((cat) => (
            <div key={cat.id} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-col items-center gap-2">
                <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase">{cat.name}</h3>
                <p className="text-muted-foreground text-sm font-medium">{cat.description}</p>
                <div className="w-24 h-1 bg-primary rounded-full mt-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <MenuItemsList catId={cat.id} QuantityControl={QuantityControl} />
              </div>
            </div>
          ))}

          {!isCatsLoading && filteredCategories?.length === 0 && (
            <div className="p-32 text-center bg-muted/10 rounded-[3rem] border-2 border-dashed border-muted">
              <Utensils className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="font-bold text-muted-foreground">No items found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MenuItemsList({ catId, QuantityControl }: { catId: string, QuantityControl: any }) {
  const db = useFirestore();
  const itemsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'restaurants', RESTAURANT_ID, 'menuCategories', catId, 'menuItems'), orderBy('name', 'asc'));
  }, [db, catId]);
  const { data: items } = useCollection(itemsQuery);

  return (
    <>
      {items?.map((item) => (
        <Card key={item.id} className="rounded-[2.5rem] border-none shadow-xl bg-white hover:shadow-2xl transition-all duration-500 overflow-hidden group border-2 border-transparent hover:border-primary/5">
          <CardContent className="p-10 space-y-8">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2">
                <h4 className="text-2xl font-black leading-none tracking-tight">{item.name}</h4>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.description}</p>
              </div>
              {item.isJain && (
                <Badge className="bg-accent/10 text-accent-foreground border-none text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shrink-0">
                  Jain Special
                </Badge>
              )}
            </div>

            {/* Price Selection Grid - Improved Margins & Spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Option 1 (5 PCS or Half) */}
              <div className="bg-[#FDFBF7] p-8 rounded-[1.5rem] border border-muted/50 flex items-center justify-between group/box hover:border-primary/20 hover:bg-white transition-all duration-300">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {item.categoryId.toLowerCase().includes('fry') ? 'Half' : '5 PCS'}
                  </p>
                  <p className="text-2xl font-black text-foreground">₹{item.price}</p>
                </div>
                <div className="ml-4">
                  <QuantityControl 
                    name={item.name} 
                    variant={item.categoryId.toLowerCase().includes('fry') ? 'Half' : '5 PCS'} 
                    price={item.price} 
                    id={item.id} 
                  />
                </div>
              </div>

              {/* Option 2 (11 PCS or Full) - Only for non-meals */}
              {!item.categoryId.toLowerCase().includes('meal') && (
                <div className="bg-[#FDFBF7] p-8 rounded-[1.5rem] border border-muted/50 flex items-center justify-between group/box hover:border-primary/20 hover:bg-white transition-all duration-300">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {item.categoryId.toLowerCase().includes('fry') ? 'Full' : '11 PCS'}
                    </p>
                    <p className="text-2xl font-black text-foreground">₹{item.price === 50 ? 100 : item.price === 60 ? 120 : item.price === 70 ? 140 : item.price === 80 ? 160 : item.price === 90 ? 180 : Math.round(item.price * 1.8)}</p>
                  </div>
                  <div className="ml-4">
                    <QuantityControl 
                      name={item.name} 
                      variant={item.categoryId.toLowerCase().includes('fry') ? 'Full' : '11 PCS'} 
                      price={item.price === 50 ? 100 : item.price === 60 ? 120 : item.price === 70 ? 140 : item.price === 80 ? 160 : item.price === 90 ? 180 : Math.round(item.price * 1.8)} 
                      id={item.id} 
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
