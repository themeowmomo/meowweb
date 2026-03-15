
'use client';

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, useAuth, useDoc } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ShoppingCart, Image as ImageIcon, LogIn, ShieldAlert, Copy, Check, Lock, Mail, UserPlus, LogOut, Info, ExternalLink, Database } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { useToast } from '@/hooks/use-toast';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { cn } from '@/lib/utils';

const RESTAURANT_ID = 'meow-momo';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');
  const [copied, setCopied] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // Login form state
  const [email, setEmail] = useState('admin@meowmomo.com');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Check if the user exists in the app_admins collection
  const adminDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'app_admins', user.uid);
  }, [db, user]);
  
  const { data: adminDoc, isLoading: isAdminDocLoading } = useDoc(adminDocRef);

  // 2. Fetch orders ONLY if we have confirmed the user is an admin
  const ordersQuery = useMemoFirebase(() => {
    if (!db || !user || !adminDoc) return null;
    return query(
      collection(db, 'restaurants', RESTAURANT_ID, 'orders'),
      orderBy('orderDate', 'desc')
    );
  }, [db, user, adminDoc]);
  
  const { data: orders, isLoading: isOrdersLoading } = useCollection(ordersQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Required Fields",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    if (isRegisterMode) {
      initiateEmailSignUp(auth, email, password);
      toast({ title: "Account Registration", description: "Creating your admin account... Please wait." });
    } else {
      initiateEmailSignIn(auth, email, password);
      toast({ title: "Logging In", description: "Verifying your credentials..." });
    }
    
    // Reset loading state after a delay (auth state change will handle the UI transition)
    setTimeout(() => setIsSubmitting(false), 2000); 
  };

  const handleUpdatePhoto = (itemId: string, categoryId: string, newUrl: string) => {
    if (!db) return;
    const itemRef = doc(db, 'restaurants', RESTAURANT_ID, 'menuCategories', categoryId, 'menuItems', itemId);
    updateDocumentNonBlocking(itemRef, { imageUrl: newUrl });
    toast({ 
      title: "Update Initiated", 
      description: "The photo update has been sent to the server." 
    });
  };

  const copyUid = () => {
    if (user) {
      navigator.clipboard.writeText(user.uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "UID Copied", description: "Add this to 'app_admins' in Firebase console." });
    }
  };

  if (isUserLoading || isAdminDocLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Verifying Identity...</p>
        </div>
      </div>
    );
  }

  // Not logged in at all
  if (!user) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden border-none bg-white">
            <div className="bg-primary p-12 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <ShieldAlert className="w-14 h-14 mx-auto mb-4" />
              <h1 className="text-3xl font-black tracking-tight leading-none">
                {isRegisterMode ? "Register Admin" : "Admin Login"}
              </h1>
              <p className="text-primary-foreground/80 mt-3 font-medium text-sm">Meow Momo Secure Portal</p>
            </div>
            <CardContent className="p-10">
              <div className="mb-6 p-4 bg-secondary/30 rounded-xl border border-secondary text-secondary-foreground text-xs flex gap-3 items-start">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">
                  {isRegisterMode 
                    ? "Enter your email and set your password to create a new admin account." 
                    : "Login with your admin credentials. If it's your first time, click 'Register' below."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Admin Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="admin@meowmomo.com" 
                      className="pl-11 h-12 rounded-xl bg-muted/40 border-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                    {isRegisterMode ? "Set Password" : "Password"}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-11 h-12 rounded-xl bg-muted/40 border-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 text-lg font-black rounded-2xl bg-primary shadow-xl shadow-primary/20 hover:translate-y-[-2px] active:translate-y-[0px] transition-all"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      {isRegisterMode ? <UserPlus className="mr-2 w-5 h-5" /> : <LogIn className="mr-2 w-5 h-5" />}
                      {isRegisterMode ? "Create My Account" : "Sign In"}
                    </>
                  )}
                </Button>
              </form>
              <div className="mt-8 pt-8 border-t border-dashed flex flex-col gap-4">
                <Button 
                  variant="ghost" 
                  className="w-full text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-muted/30"
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                >
                  {isRegisterMode ? "Already have an account? Sign In" : "First time? Click here to Register"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Logged in but not in app_admins collection
  if (!adminDoc) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4 py-20">
          <Card className="max-w-2xl w-full shadow-2xl rounded-[2.5rem] overflow-hidden border-none bg-white">
            <div className="bg-destructive p-10 text-white text-center">
              <ShieldAlert className="w-14 h-14 mx-auto mb-4" />
              <h1 className="text-3xl font-black tracking-tight">Authorization Required</h1>
              <p className="text-destructive-foreground/90 mt-2 font-medium">You are logged in, but you aren't an authorized Admin yet.</p>
            </div>
            <CardContent className="p-10 space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary">
                  <Database className="w-6 h-6" />
                  <h2 className="text-lg font-black uppercase tracking-widest">How to Authorize (Firebase Console)</h2>
                </div>
                
                <div className="grid gap-4 text-sm">
                  <div className="flex gap-4 items-start">
                    <div className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center font-black shrink-0">1</div>
                    <p className="pt-0.5 leading-relaxed">
                      Go to your <strong>Firebase Console</strong> and select this project.
                    </p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center font-black shrink-0">2</div>
                    <p className="pt-0.5 leading-relaxed">
                      Navigate to <strong>Firestore Database</strong> on the left sidebar.
                    </p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center font-black shrink-0">3</div>
                    <p className="pt-0.5 leading-relaxed">
                      Click <strong>+ Start collection</strong> and name it <code className="bg-muted px-2 py-0.5 rounded font-black text-primary">app_admins</code>.
                    </p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center font-black shrink-0">4</div>
                    <p className="pt-0.5 leading-relaxed">
                      Paste your <strong>UID</strong> (below) as the <strong>Document ID</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-6 bg-muted/30 rounded-3xl border-2 border-dashed border-muted">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Your Admin UID (Click to Copy)</p>
                <div className="flex items-center gap-3">
                  <code className="flex-grow text-sm font-mono break-all bg-white p-4 rounded-xl border shadow-inner">{user.uid}</code>
                  <Button variant="outline" size="icon" onClick={copyUid} className="h-14 w-14 shrink-0 rounded-xl border-2 border-primary/20 hover:bg-secondary">
                    {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6 text-primary" />}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <Button size="lg" className="w-full bg-primary font-black h-14 rounded-2xl" asChild>
                  <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">
                    Open Firebase Console <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </Button>
                <Button variant="ghost" className="w-full text-xs font-black uppercase tracking-widest text-muted-foreground h-12" onClick={() => auth.signOut()}>
                  <LogOut className="mr-2 w-4 h-4" /> Sign Out & Try Different Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Authorized Admin UI
  return (
    <div className="min-h-screen bg-muted/10">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-500 w-2 h-2 rounded-full animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">System Online</p>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground leading-none">Shop Dashboard</h1>
            <p className="text-muted-foreground font-medium mt-1">Real-time order flow and menu control.</p>
          </div>
          <div className="flex items-center gap-4 p-2 bg-white rounded-2xl border shadow-sm">
            <div className="px-4 py-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Signed in as</p>
              <p className="text-sm font-bold text-foreground">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => auth.signOut()}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="orders" className="space-y-8" onValueChange={setActiveTab}>
          <div className="flex justify-center md:justify-start">
            <TabsList className="bg-white p-1.5 h-16 rounded-2xl border shadow-sm grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="orders" className="rounded-xl font-black text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <ShoppingCart className="w-4 h-4 mr-2" /> Live Orders
              </TabsTrigger>
              <TabsTrigger value="menu" className="rounded-xl font-black text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <ImageIcon className="w-4 h-4 mr-2" /> Menu Photos
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="orders">
            <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-black tracking-tight">Recent Activity</CardTitle>
                  <Badge variant="secondary" className="bg-muted/50 text-muted-foreground font-bold">{orders?.length || 0} Total Orders</Badge>
                </div>
                <CardDescription className="text-sm font-medium">Track incoming requests and status updates.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isOrdersLoading ? (
                  <div className="p-20 text-center"><Loader2 className="w-12 h-12 animate-spin mx-auto text-primary opacity-20" /></div>
                ) : !orders || orders.length === 0 ? (
                  <div className="p-20 text-center">
                    <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="w-8 h-8 text-muted-foreground opacity-30" />
                    </div>
                    <p className="text-muted-foreground font-bold italic">No active orders found.</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[600px]">
                    <Table>
                      <TableHeader className="bg-muted/20 border-y">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="font-black uppercase text-[10px] tracking-widest pl-8 h-14">Date & Time</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest h-14">Customer</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest h-14 text-right">Amount</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest h-14 text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order: any) => (
                          <TableRow key={order.id} className="hover:bg-muted/10 transition-colors border-b last:border-0">
                            <TableCell className="font-medium text-xs pl-8">
                              {order.orderDate?.toDate ? order.orderDate.toDate().toLocaleString() : new Date(order.orderDate).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-black text-sm">{order.customerName}</span>
                                <span className="text-[10px] text-muted-foreground italic truncate max-w-[200px]">{order.deliveryAddress}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-black text-primary pr-8">Rs.{order.totalAmount}</TableCell>
                            <TableCell className="text-center pr-8">
                              <Badge className={cn(
                                "font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-lg border-none",
                                order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                              )}>
                                {order.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="rounded-[2.5rem] shadow-xl border-none bg-white overflow-hidden group">
                <CardHeader className="bg-primary/5 p-10">
                  <CardTitle className="flex items-center gap-3 text-primary font-black text-2xl tracking-tight">
                    <ImageIcon className="w-7 h-7" /> Categories
                  </CardTitle>
                  <CardDescription className="font-medium text-primary/60">Update primary menu card photos.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                  <div className="space-y-6">
                    <div className="p-6 bg-muted/30 rounded-3xl space-y-4 border-2 border-dashed border-muted transition-all hover:border-primary/20">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Classic Veg Collection</p>
                      <Input placeholder="Image URL (Unsplash/Picsum)..." className="rounded-xl h-12 bg-white border-none shadow-inner" id="classic-img-url" />
                      <Button 
                        className="w-full bg-primary font-black shadow-lg shadow-primary/20 rounded-xl h-12 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        onClick={() => {
                          const url = (document.getElementById('classic-img-url') as HTMLInputElement).value;
                          if(url) handleUpdatePhoto('c1', 'classic-veg', url);
                        }}
                      >
                        Update Photo
                      </Button>
                    </div>
                    <div className="p-6 bg-muted/30 rounded-3xl space-y-4 border-2 border-dashed border-muted transition-all hover:border-primary/20">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Paneer Specialist Range</p>
                      <Input placeholder="Image URL (Unsplash/Picsum)..." className="rounded-xl h-12 bg-white border-none shadow-inner" id="paneer-img-url" />
                      <Button 
                        className="w-full bg-primary font-black shadow-lg shadow-primary/20 rounded-xl h-12 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        onClick={() => {
                          const url = (document.getElementById('paneer-img-url') as HTMLInputElement).value;
                          if(url) handleUpdatePhoto('p1', 'paneer-special', url);
                        }}
                      >
                        Update Photo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1 md:col-span-2 rounded-[3rem] shadow-2xl bg-foreground text-white border-none relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <CardHeader className="p-12">
                  <CardTitle className="text-3xl font-black tracking-tight leading-none">Intelligence Hub</CardTitle>
                  <CardDescription className="text-white/40 font-medium mt-2">Aggregated shop data for the Malad East branch.</CardDescription>
                </CardHeader>
                <CardContent className="p-12 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="bg-white/5 backdrop-blur-md p-10 rounded-[2rem] border border-white/10 shadow-inner group hover:bg-white/10 transition-all">
                      <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-4">Cumulative Orders</p>
                      <p className="text-6xl font-black tracking-tighter group-hover:scale-110 transition-transform origin-left">{orders?.length || 0}</p>
                      <p className="text-xs text-white/30 mt-4 font-bold">Lifetime Total Since Launch</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md p-10 rounded-[2rem] border border-white/10 shadow-inner group hover:bg-white/10 transition-all flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-4">Location Statistics</p>
                        <p className="text-2xl font-black tracking-tight leading-none">Kurar Village</p>
                        <p className="text-sm text-white/40 mt-1 font-bold">Malad East, Mumbai</p>
                      </div>
                      <div className="mt-8 flex items-center gap-2">
                        <Badge className="bg-green-500/20 text-green-400 border-none font-black text-[9px] uppercase px-3 py-1">Peak Time: 7PM - 9PM</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
