'use client';

import { useState } from 'react';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/navbar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Phone, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 10) {
      toast({ title: "Invalid Mobile", description: "Please enter a valid 10-digit number.", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    // Map mobile to a pseudo-email for Firebase Auth
    const email = `${mobile}@meowmomo.com`;
    
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Welcome!", description: "Account created successfully." });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Welcome Back!", description: "Logged in successfully." });
      }
      router.push('/');
    } catch (err: any) {
      toast({ title: "Auth Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-12 flex justify-center">
        <Card className="max-w-md w-full shadow-2xl rounded-[2.5rem] border-none overflow-hidden bg-white">
          <div className="bg-primary p-10 text-white text-center">
            <Phone className="w-10 h-10 mx-auto mb-4" />
            <h1 className="text-2xl font-black tracking-tight">{isRegister ? "Join Meow Momo" : "Customer Login"}</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-40">Access your order history & rewards</p>
          </div>
          <CardContent className="p-8">
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mobile Number</Label>
                <Input 
                  type="tel" 
                  placeholder="e.g. 9876543210" 
                  value={mobile} 
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                  className="rounded-xl h-12"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="rounded-xl h-12"
                  required 
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-12 font-black rounded-xl bg-primary shadow-lg mt-2">
                {loading ? <Loader2 className="animate-spin" /> : (
                  isRegister ? <><UserPlus className="w-4 h-4 mr-2" /> Sign Up</> : <><LogIn className="w-4 h-4 mr-2" /> Log In</>
                )}
              </Button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-dashed text-center">
              <Button variant="ghost" onClick={() => setIsRegister(!isRegister)} className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
                {isRegister ? "Already have an account? Login" : "First time? Create account"} <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}