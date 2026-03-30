'use client';

import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Minus, Trash2, Send, User, MapPin, Loader2, Package, ChevronRight, CreditCard, Wallet, Store, Truck } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { placeholderImages as PlaceHolderImages } from "@/app/lib/placeholder-images.json";
import { cn } from "@/lib/utils";

const DEFAULT_IMAGE = PlaceHolderImages.find(img => img.id === "brand-logo")?.imageUrl || "https://picsum.photos/seed/momo/100/100";

export function CartSheet() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, customerInfo, updateCustomerInfo, clearCart, saveOrderToFirestore } = useCart();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleWhatsAppOrder = async () => {
    if (cart.length === 0) return;
    if (!customerInfo.name.trim()) {
      toast({ title: "Details Required", description: "Please fill in your name.", variant: "destructive" });
      return;
    }
    if (customerInfo.orderType === 'delivery' && !customerInfo.address.trim()) {
      toast({ title: "Details Required", description: "Please fill in your delivery address.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    const orderId = await saveOrderToFirestore();
    const shopNumber = "918850859140";
    
    const header = "*NEW ORDER FROM MEOW MOMO*%0A";
    const separator = "--------------------------%0A";
    const typeLabel = customerInfo.orderType === 'pickup' ? "🏪 *STORE PICKUP*" : "🚚 *DELIVERY*";
    const customerSection = `*Recipient:* ${customerInfo.name}%0A${customerInfo.orderType === 'delivery' ? `*Address:* ${customerInfo.address}%0A` : ""}${orderId ? `*Order ID:* ${orderId}%0A` : ""}*Order Type:* ${typeLabel}%0A`;
    const itemsSection = "%0A*Items Selection:*%0A" + cart.map(item => `- ${item.name} (5 Pieces) x ${item.quantity}: Rs.${item.price * item.quantity}`).join("%0A") + "%0A";
    const paymentText = customerInfo.paymentMethod === 'upi' ? "Pay via UPI" : "Cash on Delivery";
    const summarySection = `%0A*Summary:*%0A*Payment:* ${paymentText}%0A*Total: Rs.${totalPrice}*%0A`;
    const footer = "--------------------------%0A_Sent via Meow Momo Web_";

    const fullMessage = header + separator + customerSection + itemsSection + summarySection + footer;

    if (customerInfo.paymentMethod === 'upi') {
      const upiUrl = `upi://pay?pa=amitjaisawal0123-2@okhdfcbank&pn=Meow%20Momo&am=${totalPrice}&cu=INR&tn=Order-${orderId || 'Momo'}`;
      window.location.href = upiUrl;
      setTimeout(() => { window.open(`https://wa.me/${shopNumber}?text=${fullMessage}`, "_blank"); }, 3500);
    } else {
      window.open(`https://wa.me/${shopNumber}?text=${fullMessage}`, "_blank");
    }
    setIsProcessing(false);
  };

  if (!mounted) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {totalItems > 0 && !isOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-full px-4 sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          <SheetTrigger asChild>
            <Button className="w-full sm:w-[320px] h-14 bg-foreground text-white rounded-full shadow-2xl flex items-center justify-between px-2 group hover:bg-foreground/95 border-none">
              <div className="flex flex-col text-left pl-4">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">{totalItems} Portions</p>
                <p className="text-base font-black tracking-tight">₹{totalPrice}</p>
              </div>
              <div className="flex items-center gap-2 bg-primary px-5 h-10 rounded-full transition-all duration-300">
                <span className="text-[10px] font-black uppercase tracking-widest">Basket</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Button>
          </SheetTrigger>
        </div>
      )}

      <SheetContent 
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-full sm:max-w-md flex flex-col p-0 border-none rounded-t-[2.5rem] sm:rounded-l-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="px-5 py-4 border-b bg-white">
          <SheetHeader className="text-left">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl"><ShoppingBag className="w-5 h-5 text-primary" /></div>
              <div>
                <SheetTitle className="text-lg font-black tracking-tighter text-foreground uppercase">Your Basket</SheetTitle>
                <SheetDescription className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Checkout summary</SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <ScrollArea className="flex-grow px-6">
          <div className="py-6 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Items</h3>
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-[9px] text-destructive uppercase font-black h-7 px-2">Clear All</Button>
              </div>
              <div className="space-y-3">
                {cart.length === 0 ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <Package className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground">Your basket is empty!</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-muted/20 p-3 rounded-2xl">
                      <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-white shadow-inner">
                        <Image 
                          src={item.image || DEFAULT_IMAGE} 
                          alt={item.name} 
                          fill 
                          className="object-cover" 
                          onError={(e) => { (e.target as any).src = DEFAULT_IMAGE }} 
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-between py-0.5">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm text-foreground leading-tight">{item.name}</h4>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-5 w-5 -mt-1" onClick={() => removeFromCart(item.id, item.variant)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-base font-black text-primary">₹{item.price * item.quantity}</p>
                          <div className="flex items-center gap-2 bg-white rounded-lg border px-1.5 py-0.5 shadow-sm">
                            <button className="text-primary hover:bg-primary/5 rounded h-6 w-6 flex items-center justify-center transition-colors" onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}><Minus className="h-3.5 w-3.5" /></button>
                            <span className="text-sm font-black w-5 text-center">{item.quantity}</span>
                            <button className="text-primary hover:bg-primary/5 rounded h-6 w-6 flex items-center justify-center transition-colors" onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}><Plus className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {cart.length > 0 && (
              <>
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary" /> Order Type
                  </h3>
                  <RadioGroup value={customerInfo.orderType} onValueChange={(val) => updateCustomerInfo({ orderType: val as any })} className="grid grid-cols-2 gap-3">
                    <Label 
                      htmlFor="pickup" 
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 cursor-pointer transition-all",
                        customerInfo.orderType === 'pickup' ? 'border-primary bg-primary/5' : 'border-muted/50 bg-white'
                      )}
                    >
                      <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
                      <Store className={cn("w-5 h-5", customerInfo.orderType === 'pickup' ? 'text-primary' : 'text-muted-foreground')} /> 
                      <span className="text-[9px] font-black uppercase tracking-widest">Store Pickup</span>
                    </Label>
                    <Label 
                      htmlFor="delivery" 
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 cursor-pointer transition-all",
                        customerInfo.orderType === 'delivery' ? 'border-primary bg-primary/5' : 'border-muted/50 bg-white'
                      )}
                    >
                      <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
                      <Truck className={cn("w-5 h-5", customerInfo.orderType === 'delivery' ? 'text-primary' : 'text-muted-foreground')} /> 
                      <span className="text-[9px] font-black uppercase tracking-widest">Delivery</span>
                    </Label>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Recipient Details
                  </h3>
                  <div className="grid gap-3">
                    <div className="space-y-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Name</Label>
                      <Input placeholder="Enter your name" value={customerInfo.name} onChange={(e) => updateCustomerInfo({ name: e.target.value })} className="rounded-xl h-11 border-muted/50 text-base" />
                    </div>
                    {customerInfo.orderType === 'delivery' && (
                      <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Delivery Address</Label>
                        <Input placeholder="Full delivery address" value={customerInfo.address} onChange={(e) => updateCustomerInfo({ address: e.target.value })} className="rounded-xl h-11 border-muted/50 text-base" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" /> Payment Method
                  </h3>
                  <RadioGroup value={customerInfo.paymentMethod} onValueChange={(val) => updateCustomerInfo({ paymentMethod: val as any })} className="grid grid-cols-2 gap-3">
                    <Label 
                      htmlFor="cod" 
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 cursor-pointer transition-all",
                        customerInfo.paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-muted/50 bg-white'
                      )}
                    >
                      <RadioGroupItem value="cod" id="cod" className="sr-only" />
                      <Wallet className={cn("w-5 h-5", customerInfo.paymentMethod === 'cod' ? 'text-primary' : 'text-muted-foreground')} /> 
                      <span className="text-[9px] font-black uppercase tracking-widest">Cash on Delivery</span>
                    </Label>
                    <Label 
                      htmlFor="upi" 
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 cursor-pointer transition-all",
                        customerInfo.paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-muted/50 bg-white'
                      )}
                    >
                      <RadioGroupItem value="upi" id="upi" className="sr-only" />
                      <Send className={cn("w-5 h-5", customerInfo.paymentMethod === 'upi' ? 'text-primary' : 'text-muted-foreground')} /> 
                      <span className="text-[9px] font-black uppercase tracking-widest">Pay via UPI</span>
                    </Label>
                  </RadioGroup>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {cart.length > 0 && (
          <div className="p-5 bg-white border-t">
            <div className="flex justify-between items-center mb-4 px-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Payable</span>
              <span className="text-xl font-black text-primary tracking-tighter">Rs. {totalPrice}</span>
            </div>
            <div className="grid gap-3">
              <Button onClick={handleWhatsAppOrder} disabled={isProcessing} className="w-full h-14 bg-primary text-sm font-black rounded-2xl shadow-lg shadow-primary/20 uppercase tracking-widest">
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Order <Send className="ml-2 w-4 h-4" /></>}
              </Button>
              <Button variant="ghost" onClick={() => setIsOpen(false)} className="w-full h-10 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
