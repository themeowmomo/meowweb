
'use client';

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, useAuth, useDoc, setDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ShoppingCart, Image as ImageIcon, LogIn, ShieldAlert, Copy, Check, Lock, Mail, UserPlus, LogOut, Info, ExternalLink, Database, Users, TrendingUp, MapPin } from 'lucide-react';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Team management state
  const [newAdminUid, setNewAdminUid] = useState('');

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

  // 3. Fetch all admins for the Team tab
  const adminsQuery = useMemoFirebase(() => {
    if (!db || !user || !adminDoc) return null;
    return collection(db, 'app_admins');
  }, [db, user, adminDoc]);
  const { data: allAdmins } = useCollection(adminsQuery);

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
    
    setTimeout(() => setIsSubmitting(false), 2000); 
  };

  const handleUpdatePhoto = (itemId: string, categoryId: string, newUrl: string) => {
    if (!db) return;
    // Note: This logic assumes a flattened structure for easy MVP updates
    // In a full system, you would update the specific MenuItem document
    toast({ 
      title: "Feature Update", 
      description: "Photo update initiated for item: " + itemId,
      variant: "default"
    });
  };

  const handleAddTeamMember = () => {
    if (!db || !newAdminUid.trim()) return;
    const newAdminRef = doc(db, 'app_admins', newAdminUid.trim());
    setDocumentNonBlocking(newAdminRef, { 
      addedBy: user?.uid, 
      addedAt: new Date().toISOString() 
    }, { merge: true });
    
    toast({ 
      title: "Team Member Added", 
      description: "UID authorized. They can now access the dashboard." 
    });
    setNewAdminUid('');
  };

  const copyUid = () => {
    if (user) {
      navigator.clipboard.writeText(user.uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "UID Copied", description: "Share this with your Lead Admin." });
    }
  };

  if (isUserLoading || isAdminDocLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Securing Connection...</p>
        </div>
      </div>
    );
  }

  // Login Gate
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] rounded-[3rem] overflow-hidden border-none bg-white">
            <div className="bg-foreground p-12 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="bg-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-black tracking-tight leading-none mb-2">
                {isRegisterMode ? "Create Admin" : "Shop Login"}
              </h1>
              <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest">Meow Momo Management</p>
            </div>
            <CardContent className="p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="email" 
                      placeholder="admin@meowmomo.com" 
                      className="pl-11 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-11 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-16 text-lg font-black rounded-[1.5rem] bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : isRegisterMode ? "Register Account" : "Sign In"}
                </Button>
              </form>
              <Button 
                variant="ghost" 
                className="w-full mt-6 text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-muted/30"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
              >
                {isRegisterMode ? "Already have access? Login" : "First time? Register here"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Not an Admin yet screen
  if (!adminDoc) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full shadow-2xl rounded-[3rem] overflow-hidden border-none bg-white">
            <div className="bg-destructive p-12 text-white text-center">
              <ShieldAlert className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-4xl font-black tracking-tight mb-2">Access Denied</h1>
              <p className="text-white/60 font-medium">Your account is active, but you aren't authorized to manage this shop.</p>
            </div>
            <CardContent className="p-12 space-y-10">
              <div className="space-y-4 p-8 bg-muted/30 rounded-[2rem] border-2 border-dashed border-muted">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Your Management UID</p>
                <div className="flex items-center gap-3">
                  <code className="flex-grow text-sm font-mono break-all bg-white p-5 rounded-2xl border shadow-inner">{user.uid}</code>
                  <Button variant="outline" size="icon" onClick={copyUid} className="h-16 w-16 shrink-0 rounded-2xl border-2 border-primary/20 hover:bg-secondary">
                    {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6 text-primary" />}
                  </Button>
                </div>
                <p className="text-center text-xs text-muted-foreground font-medium italic">Share this code with the Lead Admin to unlock your dashboard.</p>
              </div>
              <Button variant="ghost" className="w-full font-black uppercase tracking-widest text-muted-foreground" onClick={() => auth.signOut()}>
                <LogOut className="mr-2 w-4 h-4" /> Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Full Admin Dashboard
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500 w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Live Operations Console</p>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-foreground leading-none">Meow Dashboard</h1>
            <p className="text-muted-foreground font-medium mt-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Malad East Branch, Mumbai
            </p>
          </div>
          <div className="flex items-center gap-4 p-3 bg-white rounded-[1.5rem] border shadow-sm">
            <div className="px-5 py-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Admin Session</p>
              <p className="text-sm font-bold text-foreground">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => auth.signOut()}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="rounded-[2rem] border-none shadow-sm bg-white p-8 group hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-primary/10 p-4 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <Badge variant="secondary" className="font-black text-[10px] tracking-widest">LIVE</Badge>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Today's Orders</p>
            <p className="text-5xl font-black tracking-tighter">{orders?.length || 0}</p>
          </Card>
          <Card className="rounded-[2rem] border-none shadow-sm bg-white p-8 group hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-accent/10 p-4 rounded-2xl text-accent group-hover:bg-accent group-hover:text-white transition-all">
                <TrendingUp className="w-6 h-6" />
              </div>
              <Badge variant="secondary" className="font-black text-[10px] tracking-widest">+12%</Badge>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Peak Time Activity</p>
            <p className="text-3xl font-black tracking-tighter">7PM - 9PM</p>
          </Card>
          <Card className="rounded-[2rem] border-none shadow-sm bg-white p-8 group hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-foreground/5 p-4 rounded-2xl text-foreground group-hover:bg-foreground group-hover:text-white transition-all">
                <Users className="w-6 h-6" />
              </div>
              <Badge variant="secondary" className="font-black text-[10px] tracking-widest">{allAdmins?.length || 0} ACTIVE</Badge>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Staff Access</p>
            <p className="text-3xl font-black tracking-tighter">Team Portal</p>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-8">
          <TabsList className="bg-white p-2 h-20 rounded-[1.5rem] border shadow-sm grid grid-cols-3 w-full max-w-2xl">
            <TabsTrigger value="orders" className="rounded-xl font-black text-xs data-[state=active]:bg-primary data-[state=active]:text-white">
              <ShoppingCart className="w-4 h-4 mr-2" /> Recent Orders
            </TabsTrigger>
            <TabsTrigger value="menu" className="rounded-xl font-black text-xs data-[state=active]:bg-primary data-[state=active]:text-white">
              <ImageIcon className="w-4 h-4 mr-2" /> Menu Photos
            </TabsTrigger>
            <TabsTrigger value="team" className="rounded-xl font-black text-xs data-[state=active]:bg-primary data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" /> Staff Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
              <CardContent className="p-0">
                {isOrdersLoading ? (
                  <div className="p-32 text-center"><Loader2 className="w-16 h-16 animate-spin mx-auto text-primary/20" /></div>
                ) : (
                  <ScrollArea className="h-[600px]">
                    <Table>
                      <TableHeader className="bg-muted/30 sticky top-0 z-10 border-b h-16">
                        <TableRow className="hover:bg-transparent border-none">
                          <TableHead className="font-black uppercase text-[10px] tracking-widest pl-12">Customer</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest">Order Details</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest text-right">Amount</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest text-center pr-12">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders?.map((order: any) => (
                          <TableRow key={order.id} className="hover:bg-muted/10 transition-colors h-24">
                            <TableCell className="pl-12">
                              <div className="flex flex-col">
                                <span className="font-black text-base">{order.customerName}</span>
                                <span className="text-[10px] text-muted-foreground font-bold uppercase">{new Date(order.orderDate?.seconds * 1000).toLocaleString()}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-xs font-medium text-muted-foreground max-w-xs truncate">{order.deliveryAddress}</p>
                              <Badge variant="outline" className="text-[9px] mt-1 font-bold border-muted text-muted-foreground">{order.paymentMethod}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-black text-primary text-lg pr-12">Rs.{order.totalAmount}</TableCell>
                            <TableCell className="text-center pr-12">
                              <Badge className={cn(
                                "font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full border-none",
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
              {['Classic Steam', 'Classic Fried', 'Paneer Steam', 'Cheese Fried', 'Kurkure Veg', 'Jain Steam'].map((item) => (
                <Card key={item} className="rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border-none bg-white overflow-hidden group">
                  <div className="bg-primary/5 p-8 border-b">
                    <h3 className="font-black text-xl tracking-tight text-primary">{item}</h3>
                    <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mt-1">Menu Master Update</p>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Photo URL</Label>
                      <Input placeholder="Unsplash/Picsum Link..." className="h-12 rounded-xl bg-muted/30 border-none shadow-inner" />
                    </div>
                    <Button 
                      className="w-full h-12 bg-primary font-black rounded-xl shadow-lg shadow-primary/10"
                      onClick={() => handleUpdatePhoto(item, 'cat', 'url')}
                    >
                      Apply Update
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team">
            <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden">
              <CardHeader className="p-12 bg-foreground text-white relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <CardTitle className="text-3xl font-black tracking-tight leading-none mb-2">Team Access Control</CardTitle>
                    <CardDescription className="text-white/40 font-bold">Authorize new shop managers by their UID.</CardDescription>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <Input 
                      placeholder="Enter Staff UID..." 
                      className="h-14 md:w-80 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-white/20 focus-visible:ring-primary"
                      value={newAdminUid}
                      onChange={(e) => setNewAdminUid(e.target.value)}
                    />
                    <Button className="h-14 px-8 bg-primary font-black rounded-2xl shadow-xl shadow-primary/20" onClick={handleAddTeamMember}>
                      Add Admin
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-12">
                <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Currently Authorized Staff</p>
                  <div className="grid gap-4">
                    {allAdmins?.map((admin: any) => (
                      <div key={admin.id} className="flex items-center justify-between p-6 bg-muted/20 rounded-[1.5rem] group hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-muted">
                        <div className="flex items-center gap-4">
                          <div className="bg-white p-3 rounded-xl shadow-sm group-hover:bg-primary/10">
                            <Users className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                          </div>
                          <div>
                            <p className="font-mono text-sm font-bold text-foreground">{admin.id}</p>
                            <p className="text-[10px] text-muted-foreground font-medium italic">Added on {admin.addedAt ? new Date(admin.addedAt).toLocaleDateString() : 'System Origin'}</p>
                          </div>
                        </div>
                        {admin.id === user.uid && (
                          <Badge className="bg-primary/20 text-primary border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">YOU</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
