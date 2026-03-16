
'use client';

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, Clock, Send, MessageCircle, User } from "lucide-react";

export default function ContactPage() {
  const shopNumber = "918850859140";
  const amitNumber = "919867977942";
  const karanNumber = "919324810532";

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter">Get in Touch</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Whether you're a regular customer or looking for bulk orders, our founders are just a call away.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <Card className="rounded-[2rem] border-none shadow-sm bg-white p-8">
                <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-black text-xl mb-4">Contact Founders</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Amit Jaiswal</p>
                      <p className="text-sm font-bold">+91 98679 77942</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Karan Sawant</p>
                      <p className="text-sm font-bold">+91 93248 10532</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="rounded-[2rem] border-none shadow-sm bg-white p-8">
                <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-black text-xl mb-2">Visit Us</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Jain Mandir Rd, Tanji Nagar, Kurar Village, Malad East, Mumbai, 400097
                </p>
              </Card>

              <Card className="rounded-[2rem] border-none shadow-sm bg-white p-8">
                <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-black text-xl mb-2">Opening Hours</h3>
                <p className="text-muted-foreground text-sm">Everyday: 4:00 PM – 10:30 PM</p>
                <p className="text-primary font-black text-xs mt-2">Open on Sundays!</p>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden">
                <div className="bg-foreground p-12 text-white">
                  <h2 className="text-3xl font-black tracking-tight">Send a Message</h2>
                  <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-2">We typically reply within 30 minutes</p>
                </div>
                <CardContent className="p-12 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Name</label>
                      <Input placeholder="Enter your name" className="h-14 rounded-2xl bg-muted/30 border-none px-6" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                      <Input placeholder="Enter mobile number" className="h-14 rounded-2xl bg-muted/30 border-none px-6" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                    <Textarea placeholder="How can we help you?" className="min-h-[150px] rounded-2xl bg-muted/30 border-none p-6" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button className="h-16 flex-grow rounded-2xl bg-primary text-lg font-black shadow-xl shadow-primary/20">
                      Send Message <Send className="ml-2 w-5 h-5" />
                    </Button>
                    <Button variant="outline" className="h-16 px-8 rounded-2xl border-2 border-primary text-primary font-black text-lg hover:bg-primary/10" asChild>
                      <a href={`https://wa.me/${shopNumber}`}>
                        <MessageCircle className="mr-2 w-6 h-6" /> WhatsApp Shop
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2254.920425690767!2d72.86143584026658!3d19.18859827663609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b732d1a79a63%3A0xabb8d9fb9768848!2sMeow%20Momo!5e0!3m2!1sen!2sin!4v1773482484300!5m2!1sen!2sin" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Meow Momo Location"
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
