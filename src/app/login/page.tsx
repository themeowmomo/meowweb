
'use client';

import { useState } from 'react';
import { useAuth, initiateGoogleSignIn } from '@/firebase';
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

  const handleGoogleSignIn = () => {
    try {
      initiateGoogleSignIn(auth);
      // Auth listener in Provider will handle redirect/state
    } catch (err: any) {
      toast({ title: "Google Sign-In Failed", description: err.message, variant: "destructive" });
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
          <CardContent className="p-8 space-y-6">
            <Button 
              variant="outline" 
              onClick={handleGoogleSignIn} 
              className="w-full h-12 rounded-xl font-bold border-muted-foreground/20 hover:bg-muted/50 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted" /></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-muted-foreground bg-white px-4">Or use mobile</div>
            </div>

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
