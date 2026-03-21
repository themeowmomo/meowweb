
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq() {
  const faqs = [
    {
      question: "Are your momos really 100% Pure Veg?",
      answer: "Yes, absolutely! We operate a strictly vegetarian kitchen. We do not use any meat products, and our preparation process ensures there is zero cross-contamination. We are proud to serve the vegetarian community of Malad East."
    },
    {
      question: "What is your 'Jain Special' menu?",
      answer: "Our Jain momos are prepared specifically for those who avoid onion, garlic, and root vegetables. We use specialized ingredients and separate preparation steps to ensure they strictly adhere to Jain dietary requirements while maintaining excellent taste."
    },
    {
      question: "Where are you located in Malad East?",
      answer: "We are located on Jain Mandir Road in Tanji Nagar, Kurar Village, Malad East, Mumbai (400097). We are a popular local spot for evening snacks in the neighborhood."
    },
    {
      question: "Do you offer home delivery?",
      answer: "We currently facilitate orders primarily via WhatsApp for pickup and local delivery in nearby areas of Malad East. You can browse our menu on this site and click 'Order' to finalize your request with us on WhatsApp."
    },
    {
      question: "Where can I find Jain momos in Malad East?",
      answer: "You can find authentic Jain momos at Meow Momo in Kurar Village, Malad East. We offer a dedicated Jain menu prepared without onion and garlic. Our Jain special momos are highly popular among customers looking for pure Jain food in Mumbai."
    },
    {
      question: "What varieties of veg momos do you offer in Malad East?",
      answer: "At Meow Momo, we offer a wide variety of veg momos including steam momos, fried momos, kurkure momos, cheese momos, and paneer momos. Each variety is crafted to deliver a unique taste experience. Whether you prefer spicy peri peri momos or classic flavors, we have something for everyone."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Got Questions?</h2>
          <h3 className="text-3xl md:text-5xl font-black font-headline tracking-tighter">Frequently Asked Questions</h3>
          <p className="text-muted-foreground text-lg">Everything you need to know about our delicious momos and service in Malad East.</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`} className="border-none bg-white rounded-[1.5rem] px-8 shadow-sm">
              <AccordionTrigger className="hover:no-underline py-6 text-left font-black text-foreground uppercase tracking-tight text-sm">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
