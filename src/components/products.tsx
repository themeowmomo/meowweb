"use client";

import { useState } from "react";
import { Plus, Minus, Info, X } from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const DEFAULT_MOMO_IMAGE = PlaceHolderImages.find(img => img.id === "momo-veg")?.imageUrl || "https://picsum.photos/seed/momo/400/400";

const MENU_DATA = {
  momos: [
    {
      category: "Classic Veg",
      items: [
        { id: "cv-steam", name: "Classic Veg Steam", price: 50, description: "Traditional steamed dumplings filled with farm-fresh vegetables and secret spices.", imageId: "momo-veg", variant: "Plate" },
        { id: "cv-fried", name: "Classic Veg Fried", price: 60, description: "Crispy golden-fried momos with a juicy vegetable filling.", imageId: "momo-veg", variant: "Plate" },
        { id: "cv-cheese-steam", name: "Cheese Veg Steam", price: 70, description: "Steamed momos loaded with gooey melted cheese and vegetables.", imageId: "momo-veg", variant: "Plate" },
        { id: "cv-cheese-fried", name: "Cheese Veg Fried", price: 80, description: "Crunchy fried momos with a rich cheesy core.", imageId: "momo-veg", variant: "Plate" },
        { id: "cv-peri-peri-steam", name: "Peri Peri Veg Steam", price: 70, description: "Steamed momos tossed in spicy peri peri seasoning.", imageId: "momo-peri-peri", variant: "Plate" },
        { id: "cv-peri-peri-fried", name: "Peri Peri Veg Fried", price: 80, description: "Crispy fried momos with a fiery peri peri kick.", imageId: "momo-peri-peri", variant: "Plate" }
      ]
    },
    {
      category: "Paneer Special",
      items: [
        { id: "pn-steam", name: "Paneer Steam", price: 60, description: "Soft steamed momos packed with fresh marinated paneer chunks.", imageId: "momo-paneer", variant: "Plate" },
        { id: "pn-fried", name: "Paneer Fried", price: 70, description: "Paneer momos deep-fried to perfection for that extra crunch.", imageId: "momo-paneer", variant: "Plate" },
        { id: "pn-cheese-steam", name: "Paneer Cheese Steam", price: 80, description: "Steamed momos with paneer and cheese.", imageId: "momo-paneer", variant: "Plate" },
        { id: "pn-cheese-fried", name: "Paneer Cheese Fried", price: 90, description: "A lethal combination of paneer and extra cheese, fried till golden.", imageId: "momo-paneer", variant: "Plate" },
        { id: "pn-peri-peri-steam", name: "Paneer Peri Peri Steam", price: 90, description: "Steamed paneer momos with peri peri spice.", imageId: "momo-peri-peri", variant: "Plate" },
        { id: "pn-peri-peri-fried", name: "Paneer Peri Peri Fried", price: 99, description: "Fried paneer momos with peri peri spice.", imageId: "momo-peri-peri", variant: "Plate" }
      ]
    },
    {
      category: "Kurkure Crunch",
      items: [
        { id: "kk-veg-fried", name: "Kurkure Veg", price: 70, description: "Ultra-crunchy momos with a special kurkure coating.", imageId: "momo-kurkure", variant: "Plate" },
        { id: "kk-cheese-fried", name: "Kurkure Cheese", price: 90, description: "Kurkure momos with a cheesy filling.", imageId: "momo-kurkure", variant: "Plate" },
        { id: "kk-peri-peri-fried", name: "Kurkure Peri Peri", price: 90, description: "Spicy and crunchy kurkure momos.", imageId: "momo-kurkure", variant: "Plate" },
        { id: "kk-paneer-fried", name: "Kurkure Paneer", price: 99, description: "The ultimate crunch paired with soft, juicy paneer.", imageId: "momo-kurkure", variant: "Plate" },
        { id: "kk-paneer-cheese-fried", name: "Kurkure Paneer Cheese", price: 110, description: "Premium crispy coating with paneer and molten cheese inside.", imageId: "momo-kurkure", variant: "Plate" },
        { id: "kk-paneer-peri-peri-fried", name: "Kurkure Paneer Peri Peri", price: 110, description: "The ultimate crunch paired with soft, juicy paneer and peri peri.", imageId: "momo-kurkure", variant: "Plate" },
      ]
    },
    {
      category: "Jain Special",
      items: [
        { id: "jn-steam", name: "Jain Veg Steam", price: 80, description: "No onion, no garlic, pure taste. Prepared strictly per Jain standards.", imageId: "momo-jain", variant: "Plate" },
        { id: "jn-fried", name: "Jain Veg Fried", price: 90, description: "Crunchy Jain-friendly momos with zero root vegetables.", imageId: "momo-jain", variant: "Plate" },
        { id: "jn-cheese-steam", name: "Jain Cheese Steam", price: 90, description: "Cheesy goodness for our Jain customers, steamed to perfection.", imageId: "momo-jain", variant: "Plate" },
        { id: "jn-cheese-fried", name: "Jain Cheese Fried", price: 99, description: "Cheesy goodness for our Jain customers, fried to perfection.", imageId: "momo-jain", variant: "Plate" },
        { id: "jn-peri-peri-steam", name: "Jain Peri Peri Steam", price: 90, description: "Spicy Jain momos, steamed.", imageId: "momo-jain", variant: "Plate" },
        { id: "jn-peri-peri-fried", name: "Jain Peri Peri Fried", price: 99, description: "Spicy Jain momos, fried.", imageId: "momo-jain", variant: "Plate" },
      ]
    }
  ],
  fries: [
    {
      category: "Crispy Fries",
      items: [
        { id: "fr-salted", name: "Salted Fries", price: 40, description: "Classic golden fries lightly seasoned with sea salt.", imageId: "fries-side", variant: "Plate" },
        { id: "fr-cheese", name: "Cheese Fries", price: 60, description: "Loaded with creamy cheese sauce and herbs.", imageId: "fries-side", variant: "Plate" },
        { id: "fr-peri", name: "Peri Peri Fries", price: 50, description: "Spicy and tangy fries tossed in our signature peri peri mix.", imageId: "fries-side", variant: "Plate" },
        { id: "fr-masala", name: "Masala Fries", price: 50, description: "Mumbai-style masala fries with a local twist.", imageId: "fries-side", variant: "Plate" }
      ]
    }
  ],
  combos: [
    {
      category: "Meal Combos",
      items: [
        { id: "ml-classic-steam", name: "Classic Steam Meal", price: 110, description: "Classic Veg Steam Momos, Half Masala Fries, 250ml Soft Drink. Light, healthy & budget-friendly.", imageId: "combo-meal", variant: "Meal Combo" },
        { id: "ml-classic-fried", name: "Classic Fried Meal", price: 120, description: "Classic Veg Fried Momos, Half Masala Fries, 250ml Soft Drink. Crispy and more flavorful.", imageId: "combo-meal", variant: "Meal Combo" },
        { id: "ml-cheese", name: "Cheese Meal", price: 140, description: "Cheese Fried Momos, Half Cheese Fries, 250ml Soft Drink. Rich, cheesy & filling.", imageId: "combo-meal", variant: "Meal Combo" },
        { id: "ml-peri-peri", name: "Peri Peri Meal", price: 140, description: "Peri Peri Fried Momos, Half Peri Peri Fries, 250ml Soft Drink. Spicy & best for masala lovers.", imageId: "combo-meal", variant: "Meal Combo" },
        { id: "ml-paneer-steam", name: "Paneer Steam Meal", price: 120, description: "Paneer Steam Momos, Half Masala Fries, 250ml Soft Drink. Soft paneer filling + light meal.", imageId: "combo-meal", variant: "Meal Combo" },
        { id: "ml-paneer-fried", name: "Paneer Fried Meal", price: 130, description: "Paneer Fried Momos, Half Masala Fries, 250ml Soft Drink. Crispy outside, juicy paneer inside.", imageId: "combo-meal", variant: "Meal Combo" }
      ]
    }
  ]
};

const classicVegItems = MENU_DATA.momos.find(c => c.category === 'Classic Veg')!.items;
const paneerItems = MENU_DATA.momos.find(c => c.category === 'Paneer Special')!.items;
const kurkureItems = MENU_DATA.momos.find(c => c.category === 'Kurkure Crunch')!.items;
const jainItems = MENU_DATA.momos.find(c => c.category === 'Jain Special')!.items;

const newMomoMenuData = [
  {
    category: "Classic",
    items: [
      { subcategory: "Steam", item: classicVegItems.find(i => i.id === 'cv-steam')! },
      { subcategory: "Fried", item: classicVegItems.find(i => i.id === 'cv-fried')! }
    ]
  },
  {
    category: "Cheese",
    items: [
      { subcategory: "Steam", item: classicVegItems.find(i => i.id === 'cv-cheese-steam')! },
      { subcategory: "Fried", item: classicVegItems.find(i => i.id === 'cv-cheese-fried')! }
    ]
  },
  {
    category: "Peri Peri",
    items: [
      { subcategory: "Steam", item: classicVegItems.find(i => i.id === 'cv-peri-peri-steam')! },
      { subcategory: "Fried", item: classicVegItems.find(i => i.id === 'cv-peri-peri-fried')! }
    ]
  },
  {
    category: "Paneer",
    items: [
      { subcategory: "Steam", item: paneerItems.find(i => i.id === 'pn-steam')! },
      { subcategory: "Fried", item: paneerItems.find(i => i.id === 'pn-fried')! }
    ]
  },
  {
    category: "Paneer Cheese",
    items: [
      { subcategory: "Steam", item: paneerItems.find(i => i.id === 'pn-cheese-steam')! },
      { subcategory: "Fried", item: paneerItems.find(i => i.id === 'pn-cheese-fried')! }
    ]
  },
  {
    category: "Paneer Peri Peri",
    items: [
      { subcategory: "Steam", item: paneerItems.find(i => i.id === 'pn-peri-peri-steam')! },
      { subcategory: "Fried", item: paneerItems.find(i => i.id === 'pn-peri-peri-fried')! }
    ]
  },
  {
    category: "Kurkure",
    items: [
      { subcategory: "Veg", item: kurkureItems.find(i => i.id === 'kk-veg-fried')! },
      { subcategory: "Cheese", item: kurkureItems.find(i => i.id === 'kk-cheese-fried')! },
      { subcategory: "Peri Peri", item: kurkureItems.find(i => i.id === 'kk-peri-peri-fried')! },
      { subcategory: "Paneer", item: kurkureItems.find(i => i.id === 'kk-paneer-fried')! },
      { subcategory: "Paneer Cheese", item: kurkureItems.find(i => i.id === 'kk-paneer-cheese-fried')! },
      { subcategory: "Paneer Peri Peri", item: kurkureItems.find(i => i.id === 'kk-paneer-peri-peri-fried')! }
    ]
  },
  {
    category: "Jain",
    items: [
      { subcategory: "Steam", item: jainItems.find(i => i.id === 'jn-steam')! },
      { subcategory: "Fried", item: jainItems.find(i => i.id === 'jn-fried')! },
      { subcategory: "Cheese Steam", item: jainItems.find(i => i.id === 'jn-cheese-steam')! },
      { subcategory: "Cheese Fried", item: jainItems.find(i => i.id === 'jn-cheese-fried')! },
      { subcategory: "Peri Peri Steam", item: jainItems.find(i => i.id === 'jn-peri-peri-steam')! },
      { subcategory: "Peri Peri Fried", item: jainItems.find(i => i.id === 'jn-peri-peri-fried')! }
    ]
  }
];

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
      image: PlaceHolderImages.find(img => img.id === item.imageId)?.imageUrl || DEFAULT_MOMO_IMAGE
    });
    toast({ title: "Added to Order", description: `${item.name} - ₹${item.price}` });
  };

  const QuantityControl = ({ item }: { item: any }) => {
    const cartItem = cart.find(i => i.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    if (quantity > 0) {
      return (
        <div className="flex items-center gap-1 bg-primary text-white rounded-full p-0.5 shadow-lg shrink-0">
          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-white/20 text-white p-0" onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, quantity - 1, item.variant); }}><Minus className="h-4 w-4" /></Button>
          <span className="text-sm font-bold w-5 text-center">{quantity}</span>
          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-white/20 text-white p-0" onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, quantity + 1, item.variant); }}><Plus className="h-4 w-4" /></Button>
        </div>
      );
    }
    return (
      <Button 
        size="sm" 
        className="h-8 px-4 font-bold rounded-full bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all shadow-md uppercase text-xs"
        onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}
      >
        Add
      </Button>
    );
  };

  const SubCategoryCard = ({ subcategory, item }: { subcategory: string; item: any }) => {
    const imageUrl = PlaceHolderImages.find(img => img.id === item.imageId)?.imageUrl || DEFAULT_MOMO_IMAGE;
    return (
        <div className="flex flex-col">
            <h4 className="font-bold text-sm text-center mb-2 text-foreground/80">{subcategory}</h4>
            <div 
                className="relative w-full aspect-square rounded-2xl overflow-hidden bg-muted shadow-inner cursor-pointer group"
                onClick={() => setSelectedProduct(item)}
            >
                <Image 
                    src={imageUrl} 
                    alt={item.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </div>
            <div className="flex items-center justify-between mt-3">
                <p className="text-lg font-black text-primary">₹{item.price}</p>
                <QuantityControl item={item} />
            </div>
        </div>
    );
  };

  const ProductCard = ({ item }: { item: any }) => {
    const imageUrl = PlaceHolderImages.find(img => img.id === item.imageId)?.imageUrl || DEFAULT_MOMO_IMAGE;
    
    return (
      <Card 
        className="group relative overflow-hidden rounded-2xl border-none bg-white shadow-sm hover:shadow-xl transition-all cursor-pointer"
        onClick={() => setSelectedProduct(item)}
      >
        <div className="flex p-4 gap-4">
          <div className="flex-grow space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 flex items-center justify-center border border-green-600 rounded-sm">
                <span className="h-2 w-2 rounded-full bg-green-600" />
              </span>
              <h5 className="font-bold text-sm tracking-tight text-foreground uppercase">{item.name}</h5>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-primary">₹{item.price}</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{item.variant}</span>
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>
          <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden shadow-inner bg-muted">
            <Image 
              src={imageUrl} 
              alt={item.name} 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-500" 
              data-ai-hint="momo dish"
            />
            <div className="absolute bottom-1 right-1">
              <div className="bg-white/90 backdrop-blur-sm p-1 rounded-md">
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
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl space-y-12">
        <Tabs defaultValue="momos" className="w-full">
          <div className="sticky top-16 z-40 bg-gray-50/80 backdrop-blur-xl py-4">
            <TabsList className="flex w-full max-w-sm mx-auto h-12 bg-white rounded-full p-1 shadow-md border">
              <TabsTrigger value="momos" className="flex-1 rounded-full font-bold text-xs uppercase tracking-widest data-[state='active']:bg-primary data-[state='active']:text-white">Momos</TabsTrigger>
              <TabsTrigger value="fries" className="flex-1 rounded-full font-bold text-xs uppercase tracking-widest data-[state='active']:bg-primary data-[state='active']:text-white">Fries</TabsTrigger>
              <TabsTrigger value="combos" className="flex-1 rounded-full font-bold text-xs uppercase tracking-widest data-[state='active']:bg-primary data-[state='active']:text-white">Meals</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="momos" className="mt-8 space-y-6">
            <Accordion type="multiple" className="w-full space-y-4" defaultValue={newMomoMenuData.map(c => c.category)}>
                {newMomoMenuData.map((cat) => (
                  <Card key={cat.category} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <AccordionItem value={cat.category} className="border-none">
                        <AccordionTrigger className="p-4 hover:no-underline">
                            <h3 className="text-base font-black uppercase tracking-wider text-foreground/90">{cat.category}</h3>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6">
                                {cat.items.map(({ subcategory, item }) => (
                                    <SubCategoryCard key={item.id} subcategory={subcategory} item={item} />
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                  </Card>
                ))}
            </Accordion>
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
        <DialogContent className="p-0 sm:max-w-[450px] overflow-hidden rounded-2xl border-none shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogDescription>{selectedProduct?.description}</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="flex flex-col">
              <div className="relative h-64 w-full">
                <Image 
                  src={PlaceHolderImages.find(img => img.id === selectedProduct.imageId)?.imageUrl || DEFAULT_MOMO_IMAGE} 
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
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">100% Pure Veg</span>
                  </div>
                  <span className="text-2xl font-black text-primary">₹{selectedProduct.price}</span>
                </div>
                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">About this Dish</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedProduct.description} This dish is prepared with the finest ingredients sourced directly from local vendors in Malad East. Our tech-driven supply chain ensures maximum freshness.
                  </p>
                </div>
                <div className="pt-4 border-t flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Portion Size</span>
                    <span className="text-sm font-bold text-foreground">{selectedProduct.variant}</span>
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
