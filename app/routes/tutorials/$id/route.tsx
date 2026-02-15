import type { Route } from "./+types/route";
import { Layout } from "~/components";
import { useTranslation, usePageTitle, useAuth, usePermissions } from "~/hooks";
import { Link, useParams } from "react-router";
import { getTutorialById, getAccessibleTutorials, translateTutorial, translateTutorials, type TutorialVideoLinks } from "../data";
import { enrichTutorialWithVideoUrls } from "../video-utils";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { VideoPlayer } from "~/components";
import { 
  ArrowLeft, 
  Clock, 
  TrendingUp, 
  CheckCircle2,
  Lightbulb,
  AlertCircle,
  BookOpen,
  ChevronRight,
  Lock
} from "lucide-react";
import { cn } from "~/lib/utils";
import { NotFound } from "~/components";

export function meta({ params }: Route.MetaArgs) {
  const tutorial = getTutorialById(params.id);
  // Note: Les traductions seront appliquées côté client
  return [
    { title: tutorial ? `${tutorial.title} - Tutoriels BABANA` : "Tutoriel non trouvé" },
    { name: "description", content: tutorial?.description || "Tutoriel non trouvé" },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  // Récupérer les liens des vidéos depuis l'API pour ce tutoriel spécifique
  let videoLinks: Record<string, any> = {};
  
  try {
    const baseUrl = new URL(request.url).origin;
    const tutorialId = params.id;
    const response = await fetch(`${baseUrl}/api/tutorials/videos?tutorialId=${tutorialId}`);
    if (response.ok) {
      const data = await response.json();
      videoLinks = data.videos || {};
    }
  } catch (error) {
    console.warn("[Tutorial Detail] Failed to fetch video links, using fallback:", error);
  }

  return {
    videoLinks,
  };
}

export default function TutorialDetailPage({ loaderData }: Route.ComponentProps) {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { can, isAdmin } = usePermissions();
  
  const tutorial = id ? getTutorialById(id) : undefined;

  // Vérifier l'accès au tutoriel
  const accessibleTutorialsRaw = getAccessibleTutorials(
    user,
    (permission) => can(permission),
    () => isAdmin()
  );

  const hasAccess = tutorial ? accessibleTutorialsRaw.some(t => t.id === tutorial.id) : false;

  if (!tutorial) {
    return <NotFound />;
  }

  // Traduire le tutoriel
  const translatedTutorialRaw = translateTutorial(tutorial, t.pages.tutorials);
  
  // Enrichir avec les URLs des vidéos depuis le serveur
  const videoLinks = (loaderData?.videoLinks || {}) as TutorialVideoLinks;
  const translatedTutorial = enrichTutorialWithVideoUrls(translatedTutorialRaw, videoLinks);
  
  const accessibleTutorials = translateTutorials(accessibleTutorialsRaw, t.pages.tutorials);

  if (!hasAccess) {
    return (
      <Layout>
        <main className="min-h-screen pb-20 flex items-center justify-center">
          <Card className="max-w-md w-full border-2 border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 dark:bg-amber-500/30 mb-6">
                <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                {t.common.accessDenied}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t.pages.tutorials.empty.message}
              </p>
              <Link to="/tutorials">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t.pages.tutorials.actions.back}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </Layout>
    );
  }

  usePageTitle(translatedTutorial.title);

  const Icon = translatedTutorial.icon;
  const accessibleIds = accessibleTutorials.map(t => t.id);
  const currentIndex = accessibleIds.findIndex(tid => tid === translatedTutorial.id);
  const nextTutorial = currentIndex < accessibleTutorials.length - 1 ? accessibleTutorials[currentIndex + 1] : null;
  const prevTutorial = currentIndex > 0 ? accessibleTutorials[currentIndex - 1] : null;

  const difficultyColors = {
    beginner: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
    intermediate: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30',
    advanced: 'bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30',
  };

  return (
    <Layout>
      <main className="min-h-screen pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-br from-babana-cyan/10 via-white/50 to-babana-navy/5 dark:from-babana-navy dark:via-gray-900/50 dark:to-babana-cyan/10 py-12 md:py-16">
          {/* Animated Background */}
          <div className={cn(
            "absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-30",
            `bg-linear-to-br ${translatedTutorial.color}`
          )} />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-babana-navy/20 dark:bg-babana-navy/30 rounded-full blur-3xl animate-pulse delay-1000" />
          
          <div className="container relative mx-auto px-4">
            {/* Back Button */}
            <Link
              to="/tutorials"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group animate-in fade-in slide-in-from-left-4 duration-700"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{t.pages.tutorials.actions.back}</span>
            </Link>

            <div className="max-w-4xl mx-auto">
              {/* Icon */}
              <div className={cn(
                "inline-flex items-center justify-center w-20 h-20 rounded-3xl shadow-2xl mb-6 animate-in fade-in zoom-in duration-700 bg-linear-to-br",
                translatedTutorial.color
              )}>
                <Icon className="w-10 h-10 text-white" />
              </div>

              {/* Title and Meta */}
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "border px-3 py-1 text-sm font-semibold",
                      difficultyColors[translatedTutorial.difficulty]
                    )}
                  >
                    {t.pages.tutorials.difficulty[translatedTutorial.difficulty]}
                  </Badge>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{translatedTutorial.duration}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>{translatedTutorial.steps.length} {t.pages.tutorials.meta.steps}</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-babana-navy via-babana-cyan to-babana-navy dark:from-babana-cyan dark:via-white dark:to-babana-cyan bg-clip-text text-transparent">
                  {translatedTutorial.title}
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {translatedTutorial.description}
                </p>

                {/* Prerequisites */}
                {translatedTutorial.prerequisites && translatedTutorial.prerequisites.length > 0 && (
                  <Card className="border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">
                            {t.pages.tutorials.meta.prerequisites}
                          </h3>
                          <ul className="space-y-1">
                            {translatedTutorial.prerequisites.map((prereq, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
                                {prereq}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        {translatedTutorial.video && (
          <section className="container mx-auto px-4 mt-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1.5 bg-babana-cyan rounded-full" />
                <h2 className="text-2xl font-bold text-foreground">
                  Vidéo du tutoriel
                </h2>
              </div>
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <VideoPlayer
                  src={translatedTutorial.video}
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  controls={true}
                  muted={false}
                  loop={false}
                  autoPlay={false}
                />
              </div>
            </div>
          </section>
        )}

        {/* Steps Section */}
        <section className="container mx-auto px-4 mt-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1.5 bg-babana-cyan rounded-full" />
              <h2 className="text-2xl font-bold text-foreground">
                {t.pages.tutorials.detail.stepsTitle}
              </h2>
            </div>

            <div className="space-y-6">
              {translatedTutorial.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                    <Card className="border-2 border-transparent hover:border-babana-cyan/50 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden group">
                      {/* Step Number Badge */}
                      <div className="relative">
                        <div className={cn(
                          "absolute top-6 left-6 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg bg-linear-to-br z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                          translatedTutorial.color
                        )}>
                          {step.id}
                        </div>
                        
                        {/* Gradient Line */}
                        <div className={cn(
                          "absolute top-0 left-0 right-0 h-1 bg-linear-to-r",
                          translatedTutorial.color
                        )} />
                    </div>

                    <CardContent className="p-6 pt-8 pl-20">
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-babana-cyan transition-colors">
                        {step.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {step.description}
                      </p>

                      {/* Video */}
                      {step.video && (
                        <div className="mb-6 -mx-6">
                          <VideoPlayer
                            src={step.video}
                            className="w-full h-auto rounded-xl"
                            controls={true}
                            muted={false}
                            loop={false}
                            autoPlay={false}
                          />
                        </div>
                      )}

                      {/* Tips */}
                      {step.tips && step.tips.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-border/50">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-babana-cyan/10 dark:bg-babana-cyan/20 shrink-0">
                              <Lightbulb className="w-5 h-5 text-babana-cyan" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                {t.pages.tutorials.detail.practicalTips}
                              </h4>
                              <ul className="space-y-2">
                                {step.tips.map((tip, tipIndex) => (
                                  <li key={tipIndex} className="text-sm text-muted-foreground flex items-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-babana-cyan mt-0.5 shrink-0" />
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Code Example */}
                      {step.code && (
                        <div className="mt-6 pt-6 border-t border-border/50">
                          <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 overflow-x-auto">
                            <pre className="text-sm text-gray-100">
                              <code>{step.code}</code>
                            </pre>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation to Next/Prev Tutorial */}
        <section className="container mx-auto px-4 mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prevTutorial && (
                <Link
                  to={`/tutorials/${prevTutorial.id}`}
                  className="group animate-in fade-in slide-in-from-left-8 duration-700"
                >
                  <Card className="h-full border-2 border-transparent hover:border-babana-cyan/50 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>{t.pages.tutorials.actions.previous}</span>
                      </div>
                      <h3 className="font-bold text-foreground group-hover:text-babana-cyan transition-colors">
                        {prevTutorial.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              )}

              {nextTutorial && (
                <Link
                  to={`/tutorials/${nextTutorial.id}`}
                  className="group animate-in fade-in slide-in-from-right-8 duration-700 md:ml-auto"
                >
                  <Card className="h-full border-2 border-transparent hover:border-babana-cyan/50 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 justify-end">
                        <span>{t.pages.tutorials.actions.next}</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <h3 className="font-bold text-foreground text-right group-hover:text-babana-cyan transition-colors">
                        {nextTutorial.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              )}
            </div>

            {/* Back to List Button */}
            <div className="mt-8 text-center">
              <Link to="/tutorials">
                <Button
                  variant="outline"
                  className="border-2 border-babana-cyan/50 hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/10 hover:border-babana-cyan transition-all duration-300"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {t.pages.tutorials.actions.viewAll}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

