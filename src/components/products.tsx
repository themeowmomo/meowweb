"use client";

import { Check, Info } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const products = [
  {
    title: "Classic Momos",
    price: "From ₹60",
    description: "Our signature steam and fried momos made with fresh vegetables and thin dough.",
    features: ["Steam Available", "Fried Available", "Jain Option Available", "Chutney Included"],
    accent: "bg-primary"
  },
  {
    title: "Cheese & Paneer",
    price: "From ₹90",
    description: "Loaded with gooey cheese or protein-rich paneer for a heavy and satisfying snack.",
    features: ["Cheese Steam/Fried", "Paneer Steam/Fried", "Extra Mayo Dip", "Best Seller"],
    accent: "bg-accent",
    popular: true
  },
  {
    title: "Kurkure & Special",
    price: "From ₹110",
    description: "Extra crunchy Kurkure momos and fiery Peri Peri variants for spice lovers.",
    features: ["Kurkure Crunch", "Peri Peri Spicy", "Masala Fries Combo", "Unique Flavor"],
    accent: "bg-foreground"
  }
];

export function Products() {
  return (
    <section id="menu" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold font-headline tracking-tight">Momo Categories</h2>
          <p className="text-muted-foreground text-lg">
            Delicious freshly prepared momos for every taste. Pure Veg and Jain friendly!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <Card key={idx} className={`relative flex flex-col h-full border-2 transition-all hover:shadow-2xl hover:-translate-y-1 ${product.popular ? 'border-primary shadow-xl' : 'border-transparent bg-muted/30'}`}>
              {product.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary hover:bg-primary text-white px-4 py-1">MOST LOVED</Badge>
                </div>
              )}
              <CardHeader className="pt-8">
                <div className={`w-12 h-1.5 mb-6 rounded-full ${product.accent}`} />
                <CardTitle className="text-2xl font-bold">{product.title}</CardTitle>
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-3xl font-bold text-primary">{product.price}</span>
                  <span className="text-muted-foreground text-sm">/ plate</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-6">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.description}
                </p>
                <ul className="space-y-3">
                  {product.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-sm">
                      <div className="bg-secondary p-1 rounded-full">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
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