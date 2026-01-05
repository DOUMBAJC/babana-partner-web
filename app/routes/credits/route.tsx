import { useState } from 'react';
import { Layout, Card } from '~/components';
import { 
  Coins, 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Zap, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { usePageTitle, useAuth, useTranslation } from '~/hooks';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '~/components/ui/table';
import { redirect } from 'react-router';

const RECHARGE_PACKAGES = [
  { amount: 20, price: '2,000', popular: false, bonus: 0 },
  { amount: 50, price: '5,000', popular: false, bonus: 5 },
  { amount: 100, price: '10,000', popular: true, bonus: 20 },
  { amount: 200, price: '20,000', popular: false, bonus: 100 },
];

const MOCK_TRANSACTIONS = [
  { id: 1, type: 'recharge', amount: 100, date: '2025-01-05 14:30', status: 'completed', method: 'Orange Money' },
  { id: 2, type: 'usage', amount: -5, date: '2025-01-05 10:15', status: 'completed', description: 'Activation SIM' },
  { id: 3, type: 'usage', amount: -5, date: '2025-01-04 16:45', status: 'completed', description: 'Identification Client' },
  { id: 4, type: 'recharge', amount: 50, date: '2025-01-02 09:00', status: 'completed', method: 'MTN MoMo' },
];

export default function CreditsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const balance = user?.wallet?.balance ?? 0;

  usePageTitle(t.credits.title);

  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");

  const handlePackageSelect = (amount: number) => {
    setSelectedPackage(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedPackage(null);
  };

  // Configuration de couleur basée sur la balance
  const getBalanceColor = () => {
    if (balance < 10) return "rose";
    if (balance < 25) return "amber";
    return "emerald";
  };

  const colorKey = getBalanceColor();
  const colorClasses = {
    rose: "from-rose-500 to-rose-600 shadow-rose-500/20",
    amber: "from-amber-500 to-amber-600 shadow-amber-500/20",
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/20"
  }[colorKey];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.credits.title.split(' ')[0]} <span className="text-babana-cyan">{t.credits.title.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-muted-foreground font-medium">
              {t.credits.subtitle}
            </p>
          </div>
          <Badge variant="outline" className="w-fit py-1.5 px-3 rounded-xl border-babana-cyan/20 bg-babana-cyan/5 text-babana-cyan font-bold gap-2">
            <Zap className="w-3.5 h-3.5 fill-current" />
            {t.credits.badge}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Balance Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className={cn(
              "relative overflow-hidden p-8 border-none ring-1 ring-white/10 shadow-2xl transition-all duration-500",
              "bg-linear-to-br text-white",
              colorClasses
            )}>
              {/* Background patterns */}
              <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-24 h-24 bg-black/10 rounded-full blur-2xl" />
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl ring-1 ring-white/30 shadow-inner">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                
                <div className="space-y-1">
                  <p className="text-white/80 text-xs font-bold uppercase tracking-widest">{t.credits.balance.current}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-6xl font-black tracking-tighter tabular-nums">
                      {balance.toLocaleString()}
                    </span>
                    <Coins className="w-6 h-6 text-white/50 animate-pulse" />
                  </div>
                  <p className="text-white/70 text-sm font-medium">{t.credits.balance.readyFor} {Math.floor(balance )} {t.credits.balance.activations}</p>
                </div>

                <div className="w-full h-px bg-white/20" />

                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="text-center">
                    <p className="text-white/60 text-[10px] uppercase font-bold tracking-wider">{t.credits.balance.stats.today}</p>
                    <p className="text-lg font-bold">-25</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 text-[10px] uppercase font-bold tracking-wider">{t.credits.balance.stats.currentMonth}</p>
                    <p className="text-lg font-bold">+150</p>
                  </div>
                </div>
              </div>

              {/* Shine effect periodically */}
              <div className="absolute inset-0 -translate-x-full animate-[shine_4s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
            </Card>

            <Card className="p-6 border-babana-cyan/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4 text-babana-cyan">
                <div className="p-2 bg-babana-cyan/10 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="font-bold">{t.credits.stats.title}</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: t.credits.stats.avgConsumption, val: `12 / ${t.credits.stats.unitDay}`, color: "text-blue-500" },
                  { label: t.credits.stats.lastRecharge, val: `+100 (${t.credits.stats.yesterday})`, color: "text-emerald-500" },
                  { label: t.credits.stats.estEnd, val: `4 ${t.credits.stats.unitDays}`, color: "text-amber-500" }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <span className="text-sm text-muted-foreground font-medium group-hover:text-foreground transition-colors">{stat.label}</span>
                    <span className={cn("text-sm font-bold", stat.color)}>{stat.val}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recharge Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-6 bg-babana-cyan rounded-full" />
                  <h2 className="text-xl font-bold tracking-tight">{t.credits.recharge.title}</h2>
                </div>
                <Button variant="ghost" size="sm" className="text-xs font-bold text-babana-cyan uppercase tracking-wider">
                  {t.credits.recharge.promoCode}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {RECHARGE_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.amount}
                    onClick={() => handlePackageSelect(pkg.amount)}
                    className={cn(
                      "relative group p-6 rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden",
                      selectedPackage === pkg.amount 
                        ? "bg-babana-cyan/5 border-babana-cyan ring-4 ring-babana-cyan/10" 
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-babana-cyan/40 hover:shadow-xl"
                    )}
                  >
                    {pkg.popular && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-babana-cyan text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-bl-xl shadow-lg">
                          Recommandé
                        </div>
                      </div>
                    )}
                    
                    <div className="relative z-10 flex items-center gap-4">
                      <div className={cn(
                        "p-4 rounded-2xl transition-all duration-300",
                        selectedPackage === pkg.amount ? "bg-babana-cyan text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-babana-cyan/10 group-hover:text-babana-cyan"
                      )}>
                        <Coins className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black">{pkg.amount}</span>
                          <span className="text-xs font-bold text-muted-foreground">{t.credits.recharge.creditsLabel}</span>
                        </div>
                        <p className="text-lg font-bold text-babana-cyan">{pkg.price} FCFA</p>
                      </div>
                    </div>

                    {pkg.bonus > 0 && (
                      <div className="mt-4 flex items-center gap-2">
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[10px] font-black tracking-tighter">
                          +{pkg.bonus} {t.credits.recharge.bonus}
                        </Badge>
                        <span className="text-[10px] font-medium text-muted-foreground italic">{t.credits.recharge.included}</span>
                      </div>
                    )}

                    <div className={cn(
                      "absolute bottom-4 right-4 transition-all duration-300 translate-x-4 opacity-0",
                      selectedPackage === pkg.amount && "translate-x-0 opacity-100"
                    )}>
                      <ChevronRight className="w-5 h-5 text-babana-cyan" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-babana-cyan/30 transition-all duration-300">
                <div className="flex-1 space-y-1">
                  <p className="font-bold">{t.credits.recharge.customAmount}</p>
                  <p className="text-xs text-muted-foreground italic font-medium">{t.credits.recharge.minRequired}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="0"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="w-32 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2 font-black text-center focus:ring-2 focus:ring-babana-cyan transition-all outline-none" 
                    />
                    <Coins className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                  </div>
                  <Button variant="outline" className="rounded-xl border-babana-cyan text-babana-cyan font-bold hover:bg-babana-cyan/10">
                    {t.credits.recharge.validate}
                  </Button>
                </div>
              </div>
              
              <Button className="w-full py-7 rounded-2xl bg-linear-to-r from-babana-cyan to-babana-blue text-white font-black text-lg shadow-xl shadow-babana-cyan/20 hover:shadow-babana-cyan/40 hover:-translate-y-1 transition-all duration-300 group">
                {t.credits.recharge.submit}
                <Plus className="ml-2 group-hover:rotate-90 transition-transform duration-300" />
              </Button>
            </div>

            {/* Transaction History */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-6 bg-slate-400 rounded-full" />
                  <h2 className="text-xl font-bold tracking-tight">{t.credits.history.title}</h2>
                </div>
                <Button variant="link" size="sm" className="text-muted-foreground font-bold hover:text-babana-cyan">
                  {t.credits.history.viewAll} <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>

              <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[100px] font-black uppercase text-[10px]">{t.credits.history.table.type}</TableHead>
                      <TableHead className="font-black uppercase text-[10px]">{t.credits.history.table.details}</TableHead>
                      <TableHead className="font-black uppercase text-[10px]">{t.credits.history.table.date}</TableHead>
                      <TableHead className="text-right font-black uppercase text-[10px]">{t.credits.history.table.credits}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_TRANSACTIONS.map((tx) => (
                      <TableRow key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <TableCell>
                          {tx.type === 'recharge' ? (
                            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
                              <ArrowDownLeft className="w-3 h-3" />
                              {t.credits.history.types.recharge}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                              <ArrowUpRight className="w-3 h-3" />
                              {t.credits.history.types.usage}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                            {tx.method || tx.description}
                          </span>
                        </TableCell>
                        <TableCell className="text-[10px] text-muted-foreground font-medium">
                          {tx.date}
                        </TableCell>
                        <TableCell className={cn(
                          "text-right font-black",
                          tx.amount > 0 ? "text-emerald-500" : "text-rose-500"
                        )}>
                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

              {/* Payment Methods Footer */}
              <div className="flex flex-col items-center justify-center p-8 space-y-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl opacity-60">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t.credits.payment.secureTitle}</p>
                <div className="flex flex-wrap justify-center gap-6">
                  {[t.credits.payment.methods.orange, t.credits.payment.methods.mtn].map(m => (
                    <span key={m} className="text-xs font-bold">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
