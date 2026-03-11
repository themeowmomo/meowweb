
"use client";

import { Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const products = [
  {
    title: "Aether Compute",
    price: "From $0.05/hr",
    description: "High-performance virtual machines with dedicated CPU and RAM resources.",
    features: ["Auto-scaling groups", "Dedicated instance options", "Pre-emptible pricing", "Custom machine types"],
    accent: "bg-primary"
  },
  {
    title: "Aether SQL",
    price: "From $0.12/hr",
    description: "Fully managed relational database service supporting MySQL, PostgreSQL, and SQL Server.",
    features: ["Daily automated backups", "Multi-AZ replication", "Point-in-time recovery", "Performance insights"],
    accent: "bg-accent",
    popular: true
  },
  {
    title: "Aether Storage",
    price: "From $0.02/GB",
    description: "Scalable object storage for all data types with high availability and durability.",
    features: ["Encryption at rest", "Lifecycle management", "Global distribution", "Unlimited scalability"],
    accent: "bg-foreground"
  }
];

export function Products() {
  return (
    <section id="products" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold font-headline tracking-tight">Our Core Services</h2>
          <p className="text-muted-foreground text-lg">
            Choose from our range of enterprise-grade cloud products designed to scale with your business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <Card key={idx} className={`relative flex flex-col h-full border-2 transition-all hover:shadow-2xl hover:-translate-y-1 ${product.popular ? 'border-primary shadow-xl' : 'border-transparent bg-muted/30'}`}>
              {product.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary hover:bg-primary text-white px-4 py-1">MOST POPULAR</Badge>
                </div>
              )}
              <CardHeader className="pt-8">
                <div className={`w-12 h-1.5 mb-6 rounded-full ${product.accent}`} />
                <CardTitle className="text-2xl font-bold">{product.title}</CardTitle>
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-3xl font-bold text-primary">{product.price.split(' ')[1]}</span>
                  <span className="text-muted-foreground text-sm">/ {product.price.split(' ')[0].replace('From', '')}</span>
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
                <Button variant={product.popular ? "default" : "outline"} className={`w-full h-12 ${product.popular ? 'bg-primary' : 'border-primary/20 hover:bg-secondary'}`}>
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
