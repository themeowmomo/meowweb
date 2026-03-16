
"use client";

import Script from "next/script";

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-accent/20 text-accent px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-4">Verified Feedback</div>
          <h2 className="text-3xl md:text-6xl font-black font-headline tracking-tighter mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Meow Momo is proud to be one of the highest-rated street food outlets in Malad East, Mumbai.
          </p>
        </div>

        <div className="max-w-6xl mx-auto min-h-[400px]">
          <Script src="https://elfsightcdn.com/platform.js" strategy="afterInteractive" />
          <div 
            className="elfsight-app-d527aaa3-322e-4e48-a283-f2618425bf9c" 
            data-elfsight-app-lazy 
          />
        </div>
      </div>
    </section>
  );
}
