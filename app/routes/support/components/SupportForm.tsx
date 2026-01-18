import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  Button, 
  Input, 
  Textarea, 
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components";
import { useTranslation } from "~/hooks";
import { 
  MessageSquare, 
  Send, 
  CheckCircle2,
  User,
  AtSign,
  FileText,
  AlertCircle,
  AlertTriangle,
  Info,
  Image,
  X,
  Sparkles,
  Zap,
  Star
} from "lucide-react";
import type { useSupportForm } from "../hooks/useSupportForm";
import { ImageUpload } from "~/components/forms/ImageUpload";
import { useState } from "react";

interface SupportFormProps {
  formData: ReturnType<typeof useSupportForm>["formData"];
  focusedField: ReturnType<typeof useSupportForm>["focusedField"];
  isSubmitting: boolean;
  isSubmitted: boolean;
  error?: string;
  attachment: ReturnType<typeof useSupportForm>["attachment"];
  onFieldFocus: (field: string | null) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPriorityChange: (priority: "low" | "normal" | "high" | "urgent") => void;
  onAttachmentChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SupportForm({
  formData,
  focusedField,
  isSubmitting,
  isSubmitted,
  error,
  attachment,
  onFieldFocus,
  onChange,
  onPriorityChange,
  onAttachmentChange,
  onSubmit,
}: SupportFormProps) {
  const { t, language } = useTranslation();
  const [showImageUpload, setShowImageUpload] = useState(false);

  return (
    <Card className="border-2 border-babana-cyan/30 dark:border-babana-cyan/20 shadow-2xl backdrop-blur-xl bg-linear-to-br from-card/95 via-card/90 to-card/95 dark:from-card/90 dark:via-card/85 dark:to-card/90 relative overflow-hidden group">
      {/* Effet de brillance animé spectaculaire */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-babana-cyan/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-2000 ease-in-out" />
      
      {/* Grille de particules animées */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-babana-cyan rounded-full animate-pulse"
            style={{
              left: `${(i * 5) % 100}%`,
              top: `${(i * 7) % 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}
      </div>
      
      {/* Orbes de lumière animés */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-babana-cyan/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-babana-navy/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-babana-blue/10 rounded-full blur-3xl animate-pulse delay-2000" />
      
      {/* Effet de bordure lumineuse */}
      <div className="absolute inset-0 rounded-lg bg-linear-to-r from-babana-cyan/0 via-babana-cyan/20 to-babana-cyan/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      
      <CardHeader className="space-y-3 relative z-10 pb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Halo animé autour de l'icône */}
            <div className="absolute inset-0 bg-babana-cyan/30 rounded-xl blur-xl animate-pulse" />
            <div className="relative p-4 rounded-xl bg-linear-to-br from-babana-cyan via-babana-blue to-babana-cyan bg-size-[200%_auto] text-white shadow-2xl shadow-babana-cyan/40 animate-gradient group-hover:shadow-babana-cyan/60 group-hover:scale-105 transition-all duration-500">
              <MessageSquare className="w-6 h-6 relative z-10" />
            </div>
            {/* Étoiles décoratives */}
            <Star className="absolute -top-1 -right-1 w-3 h-3 text-babana-cyan animate-pulse" style={{ animationDelay: '0.5s' }} />
            <Star className="absolute -bottom-1 -left-1 w-2 h-2 text-babana-blue animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="flex-1">
            <CardTitle className="text-3xl md:text-4xl font-extrabold bg-linear-to-r from-babana-cyan via-babana-blue to-babana-cyan bg-clip-text text-transparent bg-size-[200%_auto] animate-gradient group-hover:scale-105 transition-transform duration-500 inline-block">
              {t.pages.support.form.title}
            </CardTitle>
            <CardDescription className="text-base mt-2 text-muted-foreground/90 font-medium">
              {t.pages.support.form.subtitle}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-6 relative overflow-hidden">
            {/* Effets de particules animées */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-babana-cyan/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>
            
            {/* Icône de succès avec animation */}
            <div className="relative z-10">
              <div className="absolute inset-0 bg-green-500/30 rounded-full blur-2xl animate-ping" />
              <div className="relative p-6 rounded-full bg-linear-to-br from-green-500/20 via-green-400/20 to-babana-cyan/20 backdrop-blur-sm border-2 border-green-500/30 shadow-2xl shadow-green-500/20">
                <CheckCircle2 className="w-16 h-16 text-green-500 animate-scale-in" />
              </div>
            </div>
            
            <div className="relative z-10 text-center space-y-3">
              <h3 className="text-3xl font-bold bg-linear-to-r from-green-600 to-babana-cyan bg-clip-text text-transparent animate-fade-in">
                {t.pages.support.form.success.title}
              </h3>
              <p className="text-muted-foreground text-center max-w-md text-lg animate-fade-in delay-200">
                {t.pages.support.form.success.message}
              </p>
            </div>
            
            {/* Confettis animés */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor: ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6'][Math.floor(Math.random() * 4)],
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} encType="multipart/form-data" className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 border-2 border-destructive/30 text-destructive text-sm backdrop-blur-sm animate-slide-in-from-top relative overflow-hidden">
                <div className="absolute inset-0 bg-destructive/5 animate-pulse" />
                <div className="relative flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-5">
              {/* Champ Nom */}
              <div className="space-y-2 group">
                <Label htmlFor="full_name" className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
                  <User className="w-4 h-4 text-babana-cyan" />
                  <span>{t.pages.support.form.name}</span>
                  <span className="text-destructive">*</span>
                </Label>
              <div className="relative">
                <div className={`absolute inset-0 rounded-md bg-linear-to-r from-babana-cyan/30 via-babana-blue/30 to-babana-cyan/30 opacity-0 blur-2xl transition-opacity duration-500 ${focusedField === 'full_name' ? 'opacity-100 animate-pulse' : ''}`} />
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={onChange}
                  onFocus={() => onFieldFocus('full_name')}
                  onBlur={() => onFieldFocus(null)}
                  required
                  placeholder={t.pages.support.form.namePlaceholder}
                  className="relative border-2 border-input/50 bg-background/60 backdrop-blur-md transition-all duration-500 focus:border-babana-cyan focus:ring-4 focus:ring-babana-cyan/30 focus:bg-background hover:border-babana-cyan/60 hover:shadow-lg hover:shadow-babana-cyan/20 pl-10 h-12 text-base"
                />
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-500 ${focusedField === 'full_name' ? 'scale-125' : ''}`}>
                  <User className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'full_name' ? 'text-babana-cyan drop-shadow-lg' : 'text-muted-foreground'}`} />
                </div>
              </div>
              </div>
              
              {/* Champ Email */}
              <div className="space-y-2 group">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
                  <AtSign className="w-4 h-4 text-babana-cyan" />
                  <span>{t.pages.support.form.email}</span>
                  <span className="text-destructive">*</span>
                </Label>
              <div className="relative">
                <div className={`absolute inset-0 rounded-md bg-linear-to-r from-babana-cyan/30 via-babana-blue/30 to-babana-cyan/30 opacity-0 blur-2xl transition-opacity duration-500 ${focusedField === 'email' ? 'opacity-100 animate-pulse' : ''}`} />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={onChange}
                  onFocus={() => onFieldFocus('email')}
                  onBlur={() => onFieldFocus(null)}
                  required
                  placeholder={t.pages.support.form.emailPlaceholder}
                  className="relative border-2 border-input/50 bg-background/60 backdrop-blur-md transition-all duration-500 focus:border-babana-cyan focus:ring-4 focus:ring-babana-cyan/30 focus:bg-background hover:border-babana-cyan/60 hover:shadow-lg hover:shadow-babana-cyan/20 pl-10 h-12 text-base"
                />
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-500 ${focusedField === 'email' ? 'scale-125' : ''}`}>
                  <AtSign className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-babana-cyan drop-shadow-lg' : 'text-muted-foreground'}`} />
                </div>
              </div>
              </div>
            </div>

            {/* Champ Sujet */}
            <div className="space-y-2 group">
              <Label htmlFor="subject" className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
                <FileText className="w-4 h-4 text-babana-cyan" />
                <span>{t.pages.support.form.subject}</span>
                <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <div className={`absolute inset-0 rounded-md bg-linear-to-r from-babana-cyan/30 via-babana-blue/30 to-babana-cyan/30 opacity-0 blur-2xl transition-opacity duration-500 ${focusedField === 'subject' ? 'opacity-100 animate-pulse' : ''}`} />
                <Input 
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={onChange}
                  onFocus={() => onFieldFocus('subject')}
                  onBlur={() => onFieldFocus(null)}
                  required
                  placeholder={t.pages.support.form.subjectPlaceholder}
                  className="relative border-2 border-input/50 bg-background/60 backdrop-blur-md transition-all duration-500 focus:border-babana-cyan focus:ring-4 focus:ring-babana-cyan/30 focus:bg-background hover:border-babana-cyan/60 hover:shadow-lg hover:shadow-babana-cyan/20 pl-10 h-12 text-base"
                />
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-500 ${focusedField === 'subject' ? 'scale-125' : ''}`}>
                  <FileText className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'subject' ? 'text-babana-cyan drop-shadow-lg' : 'text-muted-foreground'}`} />
                </div>
              </div>
            </div>

            {/* Champ Priorité */}
            <div className="space-y-2 group">
              <Label htmlFor="priority" className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
                <AlertCircle className="w-4 h-4 text-babana-cyan" />
                <span>{t.pages.support.form.priority}</span>
              </Label>
              <div className="relative">
                <div className={`absolute inset-0 rounded-xl bg-linear-to-r from-babana-cyan/30 via-babana-blue/30 to-babana-cyan/30 opacity-0 blur-2xl transition-opacity duration-500 ${focusedField === 'priority' ? 'opacity-100 animate-pulse' : ''}`} />
                <Select
                  value={formData.priority}
                  onValueChange={onPriorityChange}
                  onOpenChange={(open) => {
                    if (open) onFieldFocus('priority');
                    else onFieldFocus(null);
                  }}
                >
                  <SelectTrigger 
                    id="priority"
                    className="relative border-2 border-input/50 bg-background/60 backdrop-blur-md transition-all duration-500 focus:border-babana-cyan focus:ring-4 focus:ring-babana-cyan/30 hover:border-babana-cyan/60 hover:shadow-lg hover:shadow-babana-cyan/20 pl-10 pr-20 h-12"
                  >
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                      {formData.priority === 'urgent' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      {formData.priority === 'high' && <AlertCircle className="w-4 h-4 text-orange-500" />}
                      {formData.priority === 'normal' && <Info className="w-4 h-4 text-blue-500" />}
                      {formData.priority === 'low' && <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
                    </div>
                    <SelectValue className="pl-2">
                      {t.pages.support.form.priorities[formData.priority as keyof typeof t.pages.support.form.priorities]}
                    </SelectValue>
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                        formData.priority === 'urgent' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                        formData.priority === 'high' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' :
                        formData.priority === 'normal' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' :
                        'bg-gray-500/20 text-gray-500 dark:text-gray-400 border border-gray-500/30 dark:border-gray-400/30'
                      }`}>
                        {formData.priority === 'urgent' && '🔥'}
                        {formData.priority === 'high' && '⚡'}
                        {formData.priority === 'normal' && '📋'}
                        {formData.priority === 'low' && '📌'}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-popover/95 backdrop-blur-xl border-2 border-border/80">
                    <SelectItem value="low" className="flex items-center gap-2 cursor-pointer">
                      <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="flex-1">{t.pages.support.form.priorities.low}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-500/20 text-gray-500 dark:text-gray-400 border border-gray-500/30">📌</span>
                    </SelectItem>
                    <SelectItem value="normal" className="flex items-center gap-2 cursor-pointer">
                      <Info className="w-4 h-4 text-blue-500" />
                      <span className="flex-1">{t.pages.support.form.priorities.normal}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-500 border border-blue-500/30">📋</span>
                    </SelectItem>
                    <SelectItem value="high" className="flex items-center gap-2 cursor-pointer">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span className="flex-1">{t.pages.support.form.priorities.high}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-orange-500/20 text-orange-500 border border-orange-500/30">⚡</span>
                    </SelectItem>
                    <SelectItem value="urgent" className="flex items-center gap-2 cursor-pointer">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="flex-1">{t.pages.support.form.priorities.urgent}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-500 border border-red-500/30">🔥</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Champ Message */}
            <div className="space-y-2 group">
              <div className="flex items-center justify-between">
                <Label htmlFor="message" className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
                  <MessageSquare className="w-4 h-4 text-babana-cyan" />
                  <span>{t.pages.support.form.message}</span>
                  <span className="text-destructive">*</span>
                </Label>
                <span className={`text-xs transition-colors duration-300 ${
                  formData.message.length > 500 ? 'text-destructive' : 
                  formData.message.length > 300 ? 'text-orange-500' : 
                  'text-muted-foreground'
                }`}>
                  {formData.message.length} / 1000
                </span>
              </div>
              <div className="relative">
                <div className={`absolute inset-0 rounded-md bg-linear-to-r from-babana-cyan/30 via-babana-blue/30 to-babana-cyan/30 opacity-0 blur-2xl transition-opacity duration-500 ${focusedField === 'message' ? 'opacity-100 animate-pulse' : ''}`} />
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={onChange}
                  onFocus={() => onFieldFocus('message')}
                  onBlur={() => onFieldFocus(null)}
                  required
                  rows={6}
                  maxLength={1000}
                  placeholder={t.pages.support.form.messagePlaceholder}
                  className="relative border-2 border-input/50 bg-background/60 backdrop-blur-md transition-all duration-500 focus:border-babana-cyan focus:ring-4 focus:ring-babana-cyan/30 focus:bg-background hover:border-babana-cyan/60 hover:shadow-lg hover:shadow-babana-cyan/20 resize-none pt-12 text-base"
                />
                <div className={`absolute left-3 top-4 transition-all duration-500 ${focusedField === 'message' ? 'scale-125' : ''}`}>
                  <MessageSquare className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'message' ? 'text-babana-cyan drop-shadow-lg' : 'text-muted-foreground'}`} />
                </div>
              </div>
            </div>

            {/* Bouton pour joindre une image */}
            <div className="space-y-4">
              {!showImageUpload && !attachment && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowImageUpload(true)}
                  className="w-full h-16 border-2 border-dashed border-babana-cyan/40 hover:border-babana-cyan/80 hover:bg-linear-to-r hover:from-babana-cyan/10 hover:via-babana-blue/10 hover:to-babana-cyan/10 transition-all duration-500 group relative overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-babana-cyan/30"
                >
                  {/* Effet de brillance spectaculaire */}
                  <div className="absolute inset-0 bg-linear-to-r from-babana-cyan/0 via-babana-cyan/20 to-babana-cyan/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out" />
                  
                  {/* Particules animées */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-babana-cyan rounded-full animate-ping"
                        style={{
                          left: `${20 + i * 10}%`,
                          top: '50%',
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="relative z-10 flex items-center justify-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-babana-cyan/30 rounded-xl blur-lg animate-pulse" />
                      <div className="relative p-3 rounded-xl bg-linear-to-br from-babana-cyan/20 via-babana-blue/20 to-babana-cyan/20 group-hover:from-babana-cyan/30 group-hover:via-babana-blue/30 group-hover:to-babana-cyan/30 transition-all duration-500 border-2 border-babana-cyan/30 group-hover:border-babana-cyan/60">
                        <Image className="w-6 h-6 text-babana-cyan relative z-10" />
                      </div>
                      <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-babana-cyan animate-pulse" style={{ animationDelay: '0.3s' }} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-lg text-babana-cyan group-hover:text-babana-cyan/90 transition-colors">
                        {language === 'fr' ? 'Joindre une image' : 'Attach an image'}
                      </span>
                      <span className="text-xs text-muted-foreground group-hover:text-babana-cyan/70 transition-colors">
                        {language === 'fr' ? '(optionnel)' : '(optional)'}
                      </span>
                    </div>
                    <Zap className="w-5 h-5 text-babana-cyan opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                  </div>
                </Button>
              )}
              
              {/* Composant ImageUpload visible conditionnellement */}
              {showImageUpload && !attachment && (
                <div className="relative animate-slide-down">
                  {/* Effet de bordure lumineuse */}
                  <div className="absolute -inset-1 bg-linear-to-r from-babana-cyan via-babana-blue to-babana-cyan rounded-xl opacity-50 blur-sm animate-pulse" />
                  <div className="relative bg-background/95 backdrop-blur-sm rounded-xl p-1">
                    <div className="flex items-center justify-between mb-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-babana-cyan/10">
                          <Image className="w-4 h-4 text-babana-cyan" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {language === 'fr' ? 'Sélectionnez votre image' : 'Select your image'}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowImageUpload(false)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <ImageUpload
                      name="attachment"
                      label=""
                      onChange={(file) => {
                        onAttachmentChange(file);
                        if (file) {
                          setShowImageUpload(false);
                        }
                      }}
                      error={error && error.includes('attachment') ? error : undefined}
                      helperText={language === 'fr' ? 'JPEG, PNG, GIF, WEBP (max. 2MB)' : 'JPEG, PNG, GIF, WEBP (max. 2MB)'}
                      texts={{
                        change: language === 'fr' ? "Changer l'image" : "Change image",
                        dragDrop: language === 'fr' ? "Cliquez ou glissez une image" : "Click or drag an image",
                        fileType: "JPEG, PNG, GIF, WEBP (max. 2MB)"
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* Aperçu de l'image sélectionnée */}
              {attachment && (
                <div className="relative group/image animate-slide-down">
                  {/* Effet de bordure lumineuse */}
                  <div className="absolute -inset-1 bg-linear-to-r from-babana-cyan via-babana-blue to-babana-cyan rounded-xl opacity-30 blur-sm group-hover/image:opacity-60 transition-opacity" />
                  <div className="relative p-5 rounded-xl border-2 border-babana-cyan/40 bg-linear-to-br from-babana-cyan/10 via-babana-blue/10 to-babana-cyan/10 backdrop-blur-sm shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="relative group/preview">
                        <div className="absolute inset-0 bg-babana-cyan/20 rounded-xl blur-lg animate-pulse" />
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-babana-cyan/40 shadow-lg group-hover/preview:border-babana-cyan/60 transition-all duration-300">
                          <img 
                            src={URL.createObjectURL(attachment)} 
                            alt="Preview" 
                            className="w-full h-full object-cover group-hover/preview:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate mb-1">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {(attachment.size / 1024).toFixed(1)} KB
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 rounded-md bg-babana-cyan/20 border border-babana-cyan/30">
                            <span className="text-xs font-medium text-babana-cyan">✓ Image prête</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onAttachmentChange(null);
                          setShowImageUpload(false);
                        }}
                        className="h-10 w-10 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 border-2 border-destructive/20 hover:border-destructive/40 transition-all duration-300 hover:scale-110"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !formData.full_name || !formData.email || !formData.subject || !formData.message}
              className="w-full bg-linear-to-r from-babana-cyan via-babana-blue to-babana-cyan bg-size-[200%_auto] hover:opacity-95 text-white shadow-2xl hover:shadow-[0_0_40px_rgba(95,200,233,0.6)] transition-all duration-700 h-20 text-lg font-bold relative overflow-hidden group animate-gradient disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Effet de brillance spectaculaire */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-2000 ease-in-out bg-linear-to-r from-transparent via-white/30 to-transparent" />
              
              {/* Halo lumineux */}
              <div className="absolute inset-0 bg-babana-cyan/20 rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Particules animées multiples */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-white/60 rounded-full animate-ping"
                    style={{
                      left: `${10 + (i * 7)}%`,
                      top: '50%',
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: `${1 + (i % 3) * 0.5}s`,
                    }}
                  />
                ))}
              </div>
              
              {/* Effet de vague animée */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
              
              <span className="relative z-10 flex items-center justify-center gap-4">
                {isSubmitting ? (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/30 rounded-full blur-lg animate-pulse" />
                      <div className="relative w-6 h-6 border-3 border-white/40 border-t-white rounded-full animate-spin" />
                    </div>
                    <span className="text-lg">{t.pages.support.form.sending}</span>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/20 rounded-xl blur-md group-hover:bg-white/30 transition-all duration-300" />
                      <div className="relative p-2 rounded-xl bg-white/10 group-hover:bg-white/20 border-2 border-white/20 group-hover:border-white/40 transition-all duration-300 group-hover:scale-110">
                        <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                      </div>
                    </div>
                    <span className="text-xl tracking-wide">{t.pages.support.form.submit}</span>
                    <Zap className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" />
                  </>
                )}
              </span>
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

