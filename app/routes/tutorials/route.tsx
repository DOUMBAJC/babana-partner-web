import type { Route } from "./+types/route";
import { Layout } from "~/components";
import { useTranslation, usePageTitle, useAuth, usePermissions } from "~/hooks";
import { Link } from "react-router";
import { getAccessibleTutorials, translateTutorials, type Tutorial } from "./data";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Search,
  Sparkles,
  UserPlus,
  Zap,
  Settings,
  BarChart3
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { cn } from "~/lib/utils";
import { Input } from "~/components/ui/input";

const categoryIcons = {
  'getting-started': Sparkles,
  'customers': UserPlus,
  'sales': Zap,
  'admin': Settings,
  'advanced': BarChart3,
};

const difficultyColors = {
  beginner: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
  intermediate: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30',
  advanced: 'bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30',
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tutoriels - BABANA" },
    { name: "description", content: "Apprenez à utiliser la plateforme BABANA avec nos guides étape par étape" },
  ];
}

export async function loader() {
  return {};
}

export default function TutorialsPage() {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const { can, isAdmin } = usePermissions();
  usePageTitle(t.pages.tutorials.title);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Tutorial['category'] | 'all'>('all');

  // Obtenir les tutoriels accessibles selon les permissions et les traduire
  const accessibleTutorials = useMemo(() => {
    const tutorials = getAccessibleTutorials(
      user,
      (permission) => can(permission),
      () => isAdmin()
    );
    return translateTutorials(tutorials, t.pages.tutorials);
  }, [user, can, isAdmin, t.pages.tutorials]);

  const filteredTutorials = useMemo(() => {
    return accessibleTutorials.filter(tutorial => {
      const matchesSearch = searchQuery === "" || 
        tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [accessibleTutorials, searchQuery, selectedCategory]);

  // Calculer les catégories disponibles basées sur les tutoriels accessibles
  const availableCategories = useMemo(() => {
    const categorySet = new Set<Tutorial['category']>();
    accessibleTutorials.forEach(tutorial => {
      categorySet.add(tutorial.category);
    });
    return Array.from(categorySet).sort((a, b) => {
      // Ordre de priorité des catégories
      const order: Record<Tutorial['category'], number> = {
        'getting-started': 1,
        'customers': 2,
        'sales': 3,
        'admin': 4,
        'advanced': 5,
      };
      return (order[a] || 99) - (order[b] || 99);
    });
  }, [accessibleTutorials]);

  // Réinitialiser la catégorie sélectionnée si elle n'est plus disponible
  const categories = availableCategories;

  // Compter les tutoriels par catégorie
  const tutorialsByCategory = useMemo(() => {
    const counts: Record<Tutorial['category'], number> = {
      'getting-started': 0,
      'customers': 0,
      'sales': 0,
      'admin': 0,
      'advanced': 0,
    };
    accessibleTutorials.forEach(tutorial => {
      counts[tutorial.category] = (counts[tutorial.category] || 0) + 1;
    });
    return counts;
  }, [accessibleTutorials]);

  useEffect(() => {
    // Si la catégorie sélectionnée n'est plus disponible, réinitialiser à 'all'
    if (selectedCategory !== 'all' && !categories.includes(selectedCategory)) {
      setSelectedCategory('all');
    }
  }, [categories, selectedCategory]);

  return (
    <Layout>
      <main className="min-h-screen pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-br from-babana-cyan/10 via-white/50 to-babana-navy/5 dark:from-babana-navy dark:via-gray-900/50 dark:to-babana-cyan/10 py-16 md:py-24">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-babana-cyan/20 dark:bg-babana-cyan/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-babana-navy/20 dark:bg-babana-navy/30 rounded-full blur-3xl animate-pulse delay-1000" />
          
          <div className="container relative mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-purple-500 to-pink-500 shadow-2xl shadow-purple-500/30 mb-6 animate-in fade-in zoom-in duration-700">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-linear-to-r from-babana-navy via-babana-cyan to-babana-navy dark:from-babana-cyan dark:via-white dark:to-babana-cyan bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
                {t.pages.tutorials.center}
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                {t.pages.tutorials.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="container mx-auto px-4 -mt-8 mb-12">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t.pages.tutorials.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg border-2 border-babana-cyan/20 focus:border-babana-cyan rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              />
            </div>

            {/* Category Filters */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    "px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 flex items-center gap-2",
                    selectedCategory === 'all'
                      ? "bg-babana-cyan text-white border-babana-cyan shadow-lg shadow-babana-cyan/30"
                      : "bg-white/80 dark:bg-gray-800/80 border-transparent hover:border-babana-cyan/50 text-foreground"
                  )}
                >
                  {t.pages.tutorials.all}
                  <span className={cn(
                    "ml-1 px-2 py-0.5 rounded-full text-xs font-bold",
                    selectedCategory === 'all'
                      ? "bg-white/20 text-white"
                      : "bg-babana-cyan/10 text-babana-cyan"
                  )}>
                    {accessibleTutorials.length}
                  </span>
                </button>
                {categories.map((category) => {
                  const Icon = categoryIcons[category];
                  const categoryKey = category === 'getting-started' ? 'gettingStarted' : category;
                  const count = tutorialsByCategory[category] || 0;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 flex items-center gap-2",
                        selectedCategory === category
                          ? "bg-babana-cyan text-white border-babana-cyan shadow-lg shadow-babana-cyan/30"
                          : "bg-white/80 dark:bg-gray-800/80 border-transparent hover:border-babana-cyan/50 text-foreground"
                      )}
                    >
                      <Icon className={cn(
                        "w-4 h-4",
                        selectedCategory === category
                          ? "text-white"
                          : "text-foreground"
                      )} />
                      {t.pages.tutorials.categories[categoryKey as keyof typeof t.pages.tutorials.categories]}
                      <span className={cn(
                        "ml-1 px-2 py-0.5 rounded-full text-xs font-bold",
                        selectedCategory === category
                          ? "bg-white/20 text-white"
                          : "bg-babana-cyan/10 text-babana-cyan"
                      )}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Tutorials Grid */}
        <section className="container mx-auto px-4 mb-12">
          {filteredTutorials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {filteredTutorials.map((tutorial, index) => {
                const Icon = tutorial.icon;
                return (
                  <Link
                    key={tutorial.id}
                    to={`/tutorials/${tutorial.id}`}
                    className="group animate-in fade-in slide-in-from-bottom-8 duration-700"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Card className="h-full border-2 transition-all duration-500 overflow-hidden relative backdrop-blur-sm border-transparent hover:border-babana-cyan/50 hover:shadow-2xl hover:shadow-babana-cyan/10 dark:hover:shadow-babana-cyan/20 bg-white/80 dark:bg-gray-800/80 hover:-translate-y-2">
                      {/* Gradient Background */}
                      <div className={cn(
                        "absolute top-0 left-0 right-0 h-2 bg-linear-to-r",
                        tutorial.color
                      )} />
                      
                      <CardContent className="p-6">
                        {/* Icon */}
                        <div className="mb-4">
                          <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 bg-linear-to-br",
                            tutorial.color
                          )}>
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-3 mb-4">
                          <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-babana-cyan line-clamp-2">
                            {tutorial.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {tutorial.description}
                          </p>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "border px-3 py-1 text-xs font-semibold",
                              difficultyColors[tutorial.difficulty]
                            )}
                          >
                            {t.pages.tutorials.difficulty[tutorial.difficulty]}
                          </Badge>
                          
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{tutorial.duration}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <TrendingUp className="w-3 h-3" />
                            <span>{tutorial.steps.length} {t.pages.tutorials.meta.steps}</span>
                          </div>
                        </div>

                        {/* Prerequisites */}
                        {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
                          <div className="mb-4 pt-4 border-t border-border/50">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">
                              {t.pages.tutorials.meta.prerequisites}:
                            </p>
                            <ul className="space-y-1">
                              {tutorial.prerequisites.map((prereq, idx) => (
                                <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-babana-cyan" />
                                  {prereq}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Action */}
                        <div className="flex items-center text-babana-cyan font-semibold text-sm group-hover:gap-2 transition-all mt-4 pt-4 border-t border-border/50">
                          <span>{t.pages.tutorials.actions.start}</span>
                          <svg 
                            className="w-4 h-4 ml-1 group-hover:ml-2 transition-all group-hover:translate-x-1" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </CardContent>

                      {/* Hover Effect Bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-babana-cyan to-babana-blue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 animate-in fade-in duration-700">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {t.pages.tutorials.empty.title}
              </h3>
              <p className="text-muted-foreground">
                {t.pages.tutorials.empty.message}
              </p>
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}

