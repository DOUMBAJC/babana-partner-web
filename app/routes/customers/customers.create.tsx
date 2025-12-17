import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  User as UserIcon, 
  Phone, 
  CreditCard,
  Loader2,
  Save,
  Mail,
  MapPin,
  ArrowLeft
} from 'lucide-react';
import {
  Card,
  Input,
  Button,
  Label,
  Layout
} from '~/components';
import { useTranslation, usePageTitle } from '~/hooks';
import { customerService } from '~/lib/customer.service'

export default function CustomerCreatePage() {
  const { t } = useTranslation();
  usePageTitle(t.pages.customers.create.title);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idCard: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = customerService.createCustomer({
            full_name: `${formData.firstName} ${formData.lastName}`,
            id_card_type_id: 1, // Default type, should be selectable in real app
            id_card_number: formData.idCard,
            phone: formData.phone,
            email: formData.email,
            address: formData.address
         })

         console.log(response);
         

        setLoading(false);
        // In real app: save to DB, then navigate
        // navigate('/sales/activation', { 
        //     state: { 
        //         customer: { ...formData, name: `${formData.firstName} ${formData.lastName}` } 
        //     } 
        // });
    } catch (error) {
        
    }
  };

  return (
    <Layout>
       <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
         {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse-slow" />
            <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-secondary/20 blur-[100px] rounded-full mix-blend-screen opacity-40 animate-pulse-slow delay-1000" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          
          <div className="mb-8">
            <Button 
                variant="ghost" 
                onClick={() => navigate('/customers/search')}
                className="group pl-0 hover:bg-transparent hover:text-primary transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                {t.customerSearch.results.cancel}
            </Button>
          </div>

          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60 drop-shadow-sm">
                {t.customerCreate.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t.customerCreate.subtitle}
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-xl ring-1 ring-white/10 dark:ring-white/5 overflow-hidden">
             
             {/* Card Top Decoration */}
             <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-purple-500 to-primary" />

             <form onSubmit={handleSave}>
              <div className="p-8 md:p-10 space-y-8">
                
                {/* Section: Personal Info */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-border/50 pb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <UserIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{t.customerCreate.personalInfo}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 group">
                            <Label htmlFor="firstName" className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">
                                {t.customerCreate.fields.firstName}
                            </Label>
                            <Input 
                                id="firstName"
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                className="bg-background/50 border-input focus:ring-primary/20 h-11 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2 group">
                            <Label htmlFor="lastName" className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">
                                {t.customerCreate.fields.lastName}
                            </Label>
                            <Input 
                                id="lastName"
                                required
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                className="bg-background/50 border-input focus:ring-primary/20 h-11 rounded-xl"
                            />
                        </div>
                         <div className="space-y-2 group md:col-span-2">
                            <Label htmlFor="idCard" className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">
                                {t.customerCreate.fields.idCard}
                            </Label>
                             <div className="relative">
                                <CreditCard className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input 
                                    id="idCard"
                                    required
                                    value={formData.idCard}
                                    onChange={(e) => setFormData({...formData, idCard: e.target.value})}
                                    className="pl-10 bg-background/50 border-input focus:ring-primary/20 h-11 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Contact Info */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-border/50 pb-2">
                        <div className="p-2 bg-secondary/10 rounded-lg text-secondary-foreground">
                            <Phone className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{t.customerCreate.contactInfo}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 group">
                             <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">
                                {t.customerCreate.fields.phone}
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input 
                                    id="phone"
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="pl-10 bg-background/50 border-input focus:ring-primary/20 h-11 rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 group">
                             <Label htmlFor="email" className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">
                                {t.customerCreate.fields.email}
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input 
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="pl-10 bg-background/50 border-input focus:ring-primary/20 h-11 rounded-xl"
                                />
                            </div>
                        </div>
                         <div className="space-y-2 group md:col-span-2">
                             <Label htmlFor="address" className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">
                                {t.customerCreate.fields.address}
                            </Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input 
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    className="pl-10 bg-background/50 border-input focus:ring-primary/20 h-11 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-border/40 flex justify-end gap-4">
                     <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate('/customers/search')}
                        className="h-12 rounded-xl px-6"
                    >
                        {t.customerSearch.results.cancel}
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl px-8 font-semibold shadow-lg shadow-primary/20 transition-all"
                    >
                        {loading ? (
                             <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                             <Save className="w-5 h-5 mr-2" />
                        )}
                        {t.customerCreate.save}
                    </Button>
                </div>

              </div>
             </form>
          </Card>
        </div>
       </div>
    </Layout>
  );
}
