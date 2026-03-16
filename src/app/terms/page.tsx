'use client';

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-24 bg-muted/20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-[3rem] shadow-sm p-12 md:p-20 space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight">Terms of Service</h1>
              <p className="text-muted-foreground">Last Updated: March 2026</p>
            </div>

            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <section className="space-y-4">
                <h2 className="text-2xl font-black text-foreground">1. Acceptance of Terms</h2>
                <p>By accessing and using Meow Momo's website or placing an order, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-foreground">2. Ordering and Delivery</h2>
                <p>We operate as a Pure Veg and Jain specialty outlet. All orders placed through our platform are finalized via WhatsApp. We aim to fulfill orders within the estimated time frame, but delays may occur due to high demand or local traffic in Malad East.</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Minimum order values may apply for specific delivery areas.</li>
                  <li>Payment is accepted via UPI or Cash on Delivery.</li>
                  <li>Prices are subject to change without prior notice.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-foreground">3. Dietary Information</h2>
                <p>While we take extreme care to separate Jain preparations, customers with severe allergies should inform us during the ordering process. We prepare our food in a facility that handles dairy products.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-foreground">4. Loyalty Rewards</h2>
                <p>Our "Buy 10 Plates, Get 1 Free" program is subject to verification. Stamps are issued per plate of momos purchased. The free plate is valid only for our Classic Steam Momos variant.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-foreground">5. Governing Law</h2>
                <p>These terms are governed by the laws of India and are subject to the exclusive jurisdiction of the courts in Mumbai.</p>
              </section>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
