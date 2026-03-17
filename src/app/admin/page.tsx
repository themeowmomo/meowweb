'use client';

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useAuth, useDoc } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ShoppingCart, ShieldAlert, Copy, Check, Lock, LogOut, Users, DollarSign, Activity, Settings } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { cn } from '@/lib/utils';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const RESTAURANT_ID = 'meow-momo';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Management state
  const [newAdminUid, setNewAdminUid] = useState('');

  // 1. Check if the user exists in the app_admins collection
  const adminDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'app_admins', user.uid);
  }, [db, user]);
  
  const { data: adminDoc, isLoading: isAdminDocLoading } = useDoc(adminDocRef);

  // 2. Fetch orders (Only if authorized and admin check is finished)
  const ordersQuery = useMemoFirebase(() => {
    if (!db || !user || isAdminDocLoading || !adminDoc) return null;
    return query(
      collection(db, 'restaurants', RESTAURANT_ID, 'orders'),
      orderBy('orderDate', 'desc')
    );
  }, [db, user, adminDoc, isAdminDocLoading]);
  const { data: orders, isLoading: isOrdersLoading } = useCollection(ordersQuery);

  // 3. Fetch all admins (Only if authorized and admin check is finished)
  const adminsQuery = useMemoFirebase(() => {
    if (!db || !user || isAdminDocLoading || !adminDoc) return null;
    return collection(db, 'app_admins');
  }, [db, user, adminDoc, isAdminDocLoading]);
  const { data: allAdmins, isLoading: isAdminsLoading } = useCollection(adminsQuery);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (isRegisterMode) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Account Created", description: "Your admin account is ready. Now verify your UID." });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Welcome back!", description: "Signed in successfully." });
      }
    } catch (err: any) {
      toast({
        title: "Authentication Error",
        description: err.message || "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTeamMember = () => {
    if (!db || !newAdminUid.trim()) return;
    const newAdminRef = doc(db, 'app_admins', newAdminUid.trim());
    setDocumentNonBlocking(newAdminRef, { 
      addedBy: user?.uid, 
      addedAt: new Date().toISOString(),
      email: 'Member UID Authorised'
    }, { merge: true });
    
    toast({ title: "Staff Authorized", description: "UID added to admin pool." });
    setNewAdminUid('');
  };

  const copyUid = () => {
    if (user) {
      navigator.clipboard.writeText(user.uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "UID Copied" });
    }
  };

  const totalRevenue = orders?.reduce((acc: number, order: any) => acc + (order.totalAmount || 0), 0) || 0;
  const pendingOrders = orders?.filter((o: any) => o.status === 'Pending').length || 0;

  if (isUserLoading || isAdminDocLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/10">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-2xl rounded-[3rem] overflow-hidden border-none bg-white">
            <div className="bg-foreground p-12 text-white text-center">
              <Lock className="w-12 h-12 text-primary mx-auto mb-6" />
              <h1 className="text-3xl font-black tracking-tight mb-2">
                {isRegisterMode ? "Create Admin" : "Shop Login"}
              </h1>
              <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest">Authorized Personnel Only</p>
            </div>
            <CardContent className="p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</Label>
                  <Input 
                    type="email" 
                    placeholder="admin@meowmomo.com" 
                    className="h-14 rounded-2xl bg-muted/30 border-none px-6"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-14 rounded-2xl bg-muted/30 border-none px-6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-16 text-lg font-black rounded-2xl bg-primary shadow-xl hover:bg-primary/90 transition-all"
                >
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : isRegisterMode ? "Register Now" : "Sign In"}
                </Button>
              </form>
              <Button 
                variant="ghost" 
                className="w-full mt-6 text-xs font-black uppercase tracking-widest text-muted-foreground"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
              >
                {isRegisterMode ? "Already have an account? Login" : "First time? Click here to Register"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!adminDoc) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4 text-center">
          <Card className="max-w-2xl w-full shadow-2xl rounded-[3rem] overflow-hidden border-none bg-white p-12">
            <ShieldAlert className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl font-black mb-4 tracking-tighter">Authorization Required</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Your account is created, but you need to be authorized in the database. Copy your UID below and add it to the <strong>app_admins</strong> collection in Firebase.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center mb-10">
              <code className="text-sm font-mono bg-muted p-5 rounded-2xl border w-full sm:w-auto break-all">{user.uid}</code>
              <Button variant="outline" size="icon" onClick={copyUid} className="h-16 w-16 rounded-2xl flex-shrink-0">
                {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6 text-primary" />}
              </Button>
            </div>
            <div className="space-y-4">
              <div className="bg-primary/5 p-6 rounded-2xl text-left border border-primary/10">
                <h4 className="font-black text-xs uppercase tracking-widest text-primary mb-2">Setup Guide</h4>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal pl-4">
                  <li>Go to Firebase Console &gt; Firestore Database</li>
                  <li>Create collection <strong>app_admins</strong></li>
                  <li>Add document with ID: <strong>(Paste your UID)</strong></li>
                  <li>Refresh this page</li>
                </ol>
              </div>
              <Button variant="ghost" onClick={() => auth.signOut()} className="font-black text-xs uppercase">Sign Out & Try Again</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-foreground leading-none">Command Center</h1>
            <p className="text-muted-foreground font-medium mt-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" /> Malad East Outlet Live
            </p>
          </div>
          <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 hover:bg-muted" onClick={() => auth.signOut()}>
            <LogOut className="mr-2 w-4 h-4" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total Revenue", value: isOrdersLoading ? "..." : `Rs.${totalRevenue}`, icon: DollarSign, color: "text-green-600" },
            { label: "Active Orders", value: isOrdersLoading ? "..." : pendingOrders, icon: ShoppingCart, color: "text-blue-600" },
            { label: "Team Size", value: isAdminsLoading ? "..." : allAdmins?.length || 0, icon: Users, color: "text-purple-600" },
          ].map((stat, i) => (
            <Card key={i} className="rounded-3xl border-none shadow-sm bg-white p-6 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-2xl bg-muted/30", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-black">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="orders" className="space-y-8">
          <TabsList className="bg-white p-2 h-16 rounded-2xl border shadow-sm grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="orders" className="rounded-xl font-black text-[10px] uppercase tracking-widest">
              <ShoppingCart className="w-4 h-4 mr-2" /> Orders
            </TabsTrigger>
            <TabsTrigger value="team" className="rounded-xl font-black text-[10px] uppercase tracking-widest">
              <Users className="w-4 h-4 mr-2" /> Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <ScrollArea className="h-[600px]">
                {isOrdersLoading ? (
                  <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto opacity-20" /></div>
                ) : orders && orders.length > 0 ? (
                  <Table>
                    <TableHeader className="bg-muted/30 h-16">
                      <TableRow>
                        <TableHead className="pl-12 font-black uppercase text-[10px] tracking-widest">Customer</TableHead>
                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Address</TableHead>
                        <TableHead className="text-right font-black uppercase text-[10px] tracking-widest">Amount</TableHead>
                        <TableHead className="text-center pr-12 font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders?.map((order: any) => (
                        <TableRow key={order.id} className="h-20 hover:bg-muted/10 transition-colors">
                          <TableCell className="pl-12 font-black">{order.customerName}</TableCell>
                          <TableCell className="text-xs text-muted-foreground leading-relaxed max-w-[200px] truncate">{order.deliveryAddress}</TableCell>
                          <TableCell className="text-right font-black text-primary">Rs.{order.totalAmount}</TableCell>
                          <TableCell className="text-center pr-12">
                            <Badge variant={order.status === 'Pending' ? 'destructive' : 'secondary'} className="rounded-full px-4 py-1 text-[10px]">
                              {order.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-32 text-center space-y-4">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground/20 mx-auto" />
                    <p className="font-bold text-muted-foreground">No active orders.</p>
                  </div>
                )}
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-10">
              <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black tracking-tight">Access Control</h2>
                  <p className="text-muted-foreground text-sm max-w-sm">Authorize new staff members by adding their UID below.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input 
                    placeholder="Paste Staff UID..." 
                    className="h-14 sm:w-80 rounded-xl border-2 px-5"
                    value={newAdminUid}
                    onChange={(e) => setNewAdminUid(e.target.value)}
                  />
                  <Button className="h-14 px-8 bg-primary font-black rounded-xl shadow-lg" onClick={handleAddTeamMember}>
                    Add Staff
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allAdmins?.map((admin: any) => (
                  <div key={admin.id} className="flex items-center justify-between p-5 bg-muted/20 rounded-2xl border border-transparent hover:border-primary/10 transition-all">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-white p-2 rounded-lg shadow-sm shrink-0">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-mono text-[10px] font-bold truncate">{admin.id}</span>
                    </div>
                    {admin.id === user.uid && <Badge className="bg-primary/20 text-primary border-none font-black text-[9px] rounded-full px-2 py-0.5">YOU</Badge>}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}