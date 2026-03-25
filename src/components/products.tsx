"use client";

import { useState } from "react";
import { Plus, Minus, Info, X, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const MENU_DATA = {
  momos: [
    {
      category: "Classic Veg",
      items: [
        { id: "cv-steam", name: "Classic Veg Steam", price: 50, description: "Traditional steamed dumplings filled with farm-fresh vegetables and secret spices.", imageId: "momo-veg", variant: "5 PCS" },
        { id: "cv-fried", name: "Classic Veg Fried", price: 60, description: "Crispy golden-fried momos with a juicy vegetable filling.", imageId: "momo-veg", variant: "5 PCS" },
        { id: "cv-cheese-steam", name: "Cheese Veg Steam", price: 70, description: "Steamed momos loaded with gooey melted cheese and vegetables.", imageId: "momo-veg", variant: "5 PCS" },
        { id: "cv-cheese-fried", name: "Cheese Veg Fried", price: 80, description: "Crunchy fried momos with a rich cheesy core.", imageId: "momo-veg", variant: "5 PCS" }
      ]
    },
    {
      category: "Paneer Special",
      items: [
        { id: "pn-steam", name: "Paneer Steam", price: 60, description: "Soft steamed momos packed with fresh marinated paneer chunks.", imageId: "momo-paneer", variant: "5 PCS" },
        { id: "pn-fried", name: "Paneer Fried", price: 70, description: "Paneer momos deep-fried to perfection for that extra crunch.", imageId: "momo-paneer", variant: "5 PCS" },
        { id: "pn-cheese-fried", name: "Paneer Cheese Fried", price: 90, description: "A lethal combination of paneer and extra cheese, fried till golden.", imageId: "momo-paneer", variant: "5 PCS" }
      ]
    },
    {
      category: "Kurkure Crunch",
      items: [
        { id: "kk-veg", name: "Kurkure Veg Fried", price: 70, description: "Ultra-crunchy momos with a special kurkure coating.", imageId: "momo-kurkure", variant: "5 PCS" },
        { id: "kk-paneer", name: "Kurkure Paneer Fried", price: 99, description: "The ultimate crunch paired with soft, juicy paneer.", imageId: "momo-kurkure", variant: "5 PCS" },
        { id: "kk-paneer-cheese", name: "Kurkure Paneer Cheese", price: 110, description: "Premium crispy coating with paneer and molten cheese inside.", imageId: "momo-kurkure", variant: "5 PCS" }
      ]
    },
    {
      category: "Jain Special",
      items: [
        { id: "jn-steam", name: "Jain Veg Steam", price: 80, description: "No onion, no garlic, pure taste. Prepared strictly per Jain standards.", imageId: "momo-jain", variant: "5 PCS" },
        { id: "jn-fried", name: "Jain Veg Fried", price: 90, description: "Crunchy Jain-friendly momos with zero root vegetables.", imageId: "momo-jain", variant: "5 PCS" },
        { id: "jn-cheese-fried", name: "Jain Cheese Fried", price: 99, description: "Cheesy goodness for our Jain customers, fried to perfection.", imageId: "momo-jain", variant: "5 PCS" }
      ]
    }
  ],
  fries: [
    {
      category: "Crispy Fries",
      items: [
        { id: "fr-salted", name: "Salted Fries", price: 40, description: "Classic golden fries lightly seasoned with sea salt.", imageId: "fries-side", variant: "Half" },
        { id: "fr-cheese", name: "Cheese Fries", price: 60, description: "Loaded with creamy cheese sauce and herbs.", imageId: "fries-side", variant: "Half" },
        { id: "fr-peri", name: "Peri Peri Fries", price: 50, description: "Spicy and tangy fries tossed in our signature peri peri mix.", imageId: "fries-side", variant: "Half" },
        { id: "fr-masala", name: "Masala Fries", price: 50, description: "Mumbai-style masala fries with a local twist.", imageId: "fries-side", variant: "Half" }
      ]
    }
  ],
  combos: [
    {
      category: "Meal Combos",
      items: [
        { id: "ml-classic-steam", name: "Classic Steam Meal", price: 110, description: "5pcs Steam Momos + Half Masala Fries + Cold Drink.", imageId: "combo-meal", variant: "Combo" },
        { id: "ml-classic-fried", name: "Classic Fried Meal", price: 120, description: "5pcs Fried Momos + Half Masala Fries + Cold Drink.", imageId: "combo-meal", variant: "Combo" },
        { id: "ml-cheese", name: "Cheese Meal", price: 140, description: "5pcs Cheese Fried + Half Cheese Fries + Cold Drink.", imageId: "combo-meal", variant: "Combo" },
        { id: "ml-paneer-fried", name: "Paneer Fried Meal", price: 130, description: "5pcs Paneer Fried + Half Masala Fries + Cold Drink.", imageId: "combo-meal", variant: "Combo" }
      ]
    }
  ]
};

export function Products() {
  const { addToCart, cart, updateQuantity } = useCart();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleAddToCart = (item: any) => {
    addToCart({ 
      id: item.id, 
      name: item.name, 
      price: item.price, 
      variant: item.variant,
      image: PlaceHolderImages.find(img => img.id === item.imageId)?.imageUrl
    });
    toast({ title: "Added to Order", description: `${item.name} - ₹${item.price}` });
  };

  const QuantityControl = ({ item }: { item: any }) => {
    const cartItem = cart.find(i => i.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    if (quantity > 0) {
      return (
        <div className="flex items-center gap-2 bg-primary text-white rounded-xl p-1 shadow-lg shrink-0">
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-white/20 text-white p-0" onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, quantity - 1, item.variant); }}><Minus className="h-4 w-4" /></Button>
          <span className="text-sm font-black w-6 text-center">{quantity}</span>
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-white/20 text-white p-0" onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, quantity + 1, item.variant); }}><Plus className="h-4 w-4" /></Button>
        </div>
      );
    }
    return (
      <Button 
        size="sm" 
        className="h-10 px-6 font-black rounded-xl bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all shadow-md uppercase text-xs"
        onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}
      >
        Add
      </Button>
    );
  };

  const ProductCard = ({ item }: { item: any }) => {
    const imageUrl = PlaceHolderImages.find(img => img.id === item.imageId)?.imageUrl;
    
    return (
      <Card 
        className="group relative overflow-hidden rounded-[2rem] border-none bg-white shadow-sm hover:shadow-xl transition-all cursor-pointer"
        onClick={() => setSelectedProduct(item)}
      >
        <div className="flex p-4 gap-4">
          <div className="flex-grow space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 flex items-center justify-center border border-green-600 rounded-sm">
                <span className="h-2 w-2 rounded-full bg-green-600" />
              </span>
              <h5 className="font-black text-sm tracking-tight text-foreground uppercase">{item.name}</h5>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-primary">₹{item.price}</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{item.variant}</span>
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>
          <div className="relative h-24 w-24 shrink-0 rounded-2xl overflow-hidden shadow-inner bg-muted">
            <Image 
              src={imageUrl || ''} 
              alt={item.name} 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-500" 
              data-ai-hint="momo dish"
            />
            <div className="absolute bottom-1 right-1">
              <div className="bg-white/90 backdrop-blur-sm p-1 rounded-lg">
                <Info className="w-3 h-3 text-primary" />
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 flex justify-end">
          <QuantityControl item={item} />
        </div>
      </Card>
    );
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 max-w-5xl space-y-12">
        <Tabs defaultValue="momos" className="w-full">
          <div className="sticky top-16 z-40 bg-[#F8F9FA]/80 backdrop-blur-xl py-4">
            <TabsList className="flex w-full max-w-sm mx-auto h-12 bg-white rounded-full p-1 shadow-md border">
              <TabsTrigger value="momos" className="flex-1 rounded-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Momos</TabsTrigger>
              <TabsTrigger value="fries" className="flex-1 rounded-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Fries</TabsTrigger>
              <TabsTrigger value="combos" className="flex-1 rounded-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Meals</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="momos" className="mt-8 space-y-12">
            {MENU_DATA.momos.map((cat, idx) => (
              <div key={idx} className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-[0.2em] text-foreground border-l-4 border-primary pl-4">{cat.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cat.items.map((item) => (
                    <ProductCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="fries" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MENU_DATA.fries[0].items.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="combos" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MENU_DATA.combos[0].items.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="p-0 sm:max-w-[450px] overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogDescription>{selectedProduct?.description}</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="flex flex-col">
              <div className="relative h-64 w-full">
                <Image 
                  src={PlaceHolderImages.find(img => img.id === selectedProduct.imageId)?.imageUrl || ''} 
                  alt={selectedProduct.name} 
                  fill 
                  className="object-cover"
                />
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute top-4 right-4 bg-black/20 backdrop-blur-md text-white rounded-full hover:bg-black/40"
                  onClick={() => setSelectedProduct(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <Badge className="bg-primary text-white mb-2 uppercase tracking-widest text-[9px]">Freshly Made</Badge>
                  <h4 className="text-2xl font-black uppercase tracking-tight">{selectedProduct.name}</h4>
                </div>
              </div>
              <div className="p-8 space-y-6 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 flex items-center justify-center border border-green-600 rounded-sm">
                      <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                    </span>
                    <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">100% Pure Veg</span>
                  </div>
                  <span className="text-2xl font-black text-primary">₹{selectedProduct.price}</span>
                </div>
                <div className="space-y-2">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">About this Dish</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedProduct.description} This dish is prepared with the finest ingredients sourced directly from local vendors in Malad East. Our tech-driven supply chain ensures maximum freshness.
                  </p>
                </div>
                <div className="pt-4 border-t flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Portion Size</span>
                    <span className="text-sm font-black text-foreground">{selectedProduct.variant}</span>
                  </div>
                  <QuantityControl item={selectedProduct} />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
