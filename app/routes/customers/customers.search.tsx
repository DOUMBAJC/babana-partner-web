import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Search, 
  User as UserIcon, 
  Phone, 
  CreditCard,
  Loader2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Search as SearchIcon
} from 'lucide-react';
import {
  Card,
  Input,
  Button,
  Label,
  Badge,
  Layout // Wrapping in Layout for consistent Header/Footer
} from '~/components';
import { useTranslation, usePageTitle } from '~/hooks'; 
// import { useAuth } from '~/hooks/useAuth'; // Commented out for mock
import type { RoleSlug } from '~/types/auth.types';
import { customerService } from '~/lib/customer.service'
import type { Customer } from '~/types/customer.types'


// --- Configuration ---

// Roles with full search access (Name, Phone, ID)
const EXTENDED_SEARCH_ROLES: RoleSlug[] = ['super_admin', 'admin', 'activateur'];

// Roles with limited search access (ID only)
const LIMITED_SEARCH_ROLES: RoleSlug[] = ['ba', 'dsm'];


export default function CustomerSearchPage() {
  const { t } = useTranslation();
  usePageTitle(t.pages.customers.search.title);
  // const { user, isAuthenticated } = useAuth();
  // MOCK FOR VISUALIZATION
  const user = { roles: ['activateur' as RoleSlug], name: 'Mock Activateur' };
  const isAuthenticated = true;
  
  const navigate = useNavigate();
  
  // Search State
  const [searchQuery, setSearchQuery] = useState({
    name: '',
    phone: '',
    idCard: ''
  });
  const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'found' | 'not_found'>('idle');
  const [showNotFoundDialog, setShowNotFoundDialog] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);

  // Access Control
  const hasAccess = user?.roles.some(role => 
    [...EXTENDED_SEARCH_ROLES, ...LIMITED_SEARCH_ROLES].includes(role)
  );
  
  const hasExtendedAccess = user?.roles.some(role => 
    EXTENDED_SEARCH_ROLES.includes(role)
  );

  // Redirect if unauthorized logic
  useEffect(() => {
    // if (!isAuthenticated) {
    //   navigate('/login');
    // }
  }, [isAuthenticated, navigate]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchStatus('loading');
    
    // Simulate API Call
    // setTimeout(() => {
    //   // Mock Logic: 
    //   // If ID Card end with '9', return Not Found. 
    //   // Else return Found.
    //   const isNotFound = searchQuery.idCard.endsWith('9');
      
    //   if (isNotFound) {
    //     setSearchStatus('not_found');
    //     setShowNotFoundDialog(true);
    //   } else {
    //     setSearchStatus('found');
    //   }
    // }, 1500);

    try {
      const response = await customerService.getCustomerByIdCard(searchQuery.idCard);
      
    } catch (error) {
      
    }finally{
      setSearchStatus('found');
    }
  };

  const handleReset = () => {
    setSearchStatus('idle');
    setSearchQuery({ name: '', phone: '', idCard: '' });
  };

  const handleCreateCustomer = () => {
    navigate('/customers/create');
  };

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (isAuthenticated && !hasAccess) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="bg-destructive/10 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center ring-4 ring-destructive/5">
              <ShieldCheck className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{t.customerSearch.accessDenied.title}</h1>
            <p className="text-muted-foreground text-lg">
              {t.customerSearch.accessDenied.message}
            </p>
            <Button 
                className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/25"
                onClick={() => navigate('/')}
            >
              {t.customerSearch.accessDenied.backHome}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const isLocked = searchStatus === 'found';

  return (
    <Layout>
      <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse-slow" />
            <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-secondary/20 blur-[100px] rounded-full mix-blend-screen opacity-40 animate-pulse-slow delay-1000" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60 drop-shadow-sm">
                {t.customerSearch.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t.customerSearch.subtitle}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
                <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary backdrop-blur-sm">
                    <ShieldCheck className="w-3.5 h-3.5 mr-2" />
                    {t.customerSearch.securePortal}
                </Badge>
            </div>
          </div>
          
          <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-xl ring-1 ring-white/10 dark:ring-white/5 overflow-hidden">
            <div className="p-8 md:p-10 space-y-8">
              <div className="flex items-center justify-between border-b border-border/50 pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">{t.customerSearch.searchCriteria}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {hasExtendedAccess ? t.customerSearch.advancedSearch : t.customerSearch.standardSearch}
                        </p>
                    </div>
                </div>
                {searchStatus === 'found' && (
                    <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 px-3 py-1 text-sm">
                        <UserIcon className="w-4 h-4 mr-2" />
                        {t.customerSearch.results.found}
                    </Badge>
                )}
              </div>

              {/* Success Message when Found */}
              {searchStatus === 'found' && (
                 <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-start gap-4">
                    <div className="p-2 bg-green-500/20 rounded-full text-green-600 mt-1">
                        <UserIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-green-700 dark:text-green-400">{t.customerSearch.results.found}</h4>
                        <p className="text-sm text-green-600/90 dark:text-green-400/90 mt-1">{t.customerSearch.results.foundMessage}</p>
                    </div>
                 </div>
              )}

              <form onSubmit={handleSearch} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                  { hasExtendedAccess ? (
                      <>
                        <div className="lg:col-span-6 space-y-3 group">
                            <Label htmlFor="name" className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors duration-300">
                                {t.customerSearch.fields.name}
                            </Label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground transition-all duration-300 group-focus-within:text-primary" />
                                <Input 
                                    id="name"
                                    disabled={isLocked}
                                    className="pl-12 h-12 bg-background/50 border-input transition-all duration-300 focus:bg-background focus:ring-2 focus:ring-primary/20 rounded-xl text-lg hover:border-primary/50"
                                    placeholder={t.customerSearch.fields.namePlaceholder}
                                    value={searchQuery.name}
                                    onChange={(e) => setSearchQuery({...searchQuery, name: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-6 space-y-3 group">
                            <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors duration-300">
                                {t.customerSearch.fields.phone}
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground transition-all duration-300 group-focus-within:text-primary" />
                                <Input 
                                    id="phone"
                                    disabled={isLocked}
                                    className="pl-12 h-12 bg-background/50 border-input transition-all duration-300 focus:bg-background focus:ring-2 focus:ring-primary/20 rounded-xl text-lg hover:border-primary/50"
                                    placeholder={t.customerSearch.fields.phonePlaceholder}
                                    value={searchQuery.phone}
                                    onChange={(e) => setSearchQuery({...searchQuery, phone: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-12 space-y-3 group">
                             <Label htmlFor="idCard" className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors duration-300">
                                {t.customerSearch.fields.idCard}
                            </Label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground transition-all duration-300 group-focus-within:text-primary" />
                                <Input 
                                    id="idCard"
                                    disabled={isLocked}
                                    className="pl-12 h-12 bg-background/50 border-input transition-all duration-300 focus:bg-background focus:ring-2 focus:ring-primary/20 rounded-xl text-lg hover:border-primary/50"
                                    placeholder={t.customerSearch.fields.idCardPlaceholder}
                                    value={searchQuery.idCard}
                                    onChange={(e) => setSearchQuery({...searchQuery, idCard: e.target.value})}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground/60 pl-1">{t.customerSearch.fillFields}</p>
                        </div>
                      </>
                  ): (
                    <div className="lg:col-span-12 space-y-3 group">
                        <Label htmlFor="idCard" className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors duration-300">
                           {t.customerSearch.fields.idCard}
                        </Label>
                        <div className="relative">
                            <CreditCard className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground transition-all duration-300 group-focus-within:text-primary" />
                            <Input 
                                id="idCard"
                                disabled={isLocked}
                                className="pl-12 h-12 bg-background/50 border-input transition-all duration-300 focus:bg-background focus:ring-2 focus:ring-primary/20 rounded-xl text-lg hover:border-primary/50"
                                placeholder={t.customerSearch.fields.idCardPlaceholder}
                                value={searchQuery.idCard}
                                onChange={(e) => setSearchQuery({...searchQuery, idCard: e.target.value})}
                            />
                        </div>
                    </div>
                  )}
                </div>

                {searchStatus === 'found' ? (
                   <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button 
                            type="button"
                            onClick={() => navigate('/sales/activation', { state: { customer: searchQuery } })}
                            className="flex-1 bg-linear-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white h-14 text-lg rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300"
                        >
                            <CreditCard className="w-5 h-5 mr-3" />
                            {t.customerSearch.results.sellSim}
                        </Button>
                        <Button 
                            type="button"
                            onClick={handleReset}
                            variant="outline"
                            className="sm:w-auto h-14 text-lg rounded-xl border-border/50 hover:bg-muted/50"
                        >
                            {t.customerSearch.results.newSearch}
                        </Button>
                   </div>
                ) : (
                    <div className="flex justify-end pt-4">
                        <Button 
                            type="submit" 
                            disabled={searchStatus === 'loading'}
                            className="w-full sm:w-auto bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold px-8 h-14 text-lg rounded-xl transition-all duration-300 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98]"
                        >
                            {searchStatus === 'loading' ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    {t.customerSearch.searching}
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5 mr-2" />
                                    {t.customerSearch.searchButton}
                                </>
                            )}
                        </Button>
                    </div>
                )}
              </form>
            </div>
          </Card>
        </div>
      </div>

       {/* Not Found Dialog (Custom Modal Implementation) */}
       {showNotFoundDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                         <AlertCircle className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                        {t.customerSearch.results.notFound}
                    </h3>
                    <p className="text-muted-foreground">
                        {t.customerSearch.results.notFoundMessage}
                    </p>
                    <div className="flex flex-col gap-3 mt-8">
                        <Button 
                             onClick={handleCreateCustomer}
                             className="w-full h-12 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90"
                        >
                            {t.customerSearch.results.createCustomer}
                        </Button>
                        <Button 
                            variant="ghost" 
                            onClick={() => {
                                setShowNotFoundDialog(false);
                                setSearchStatus('idle');
                            }}
                            className="w-full h-12 text-lg rounded-xl hover:bg-muted"
                        >
                             {t.customerSearch.results.cancel}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
       )}
    </Layout>
  );
}

