import { CheckCircle, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export interface StepDefinition<T extends string> {
  id: T;
  label: string;
  title: string;
  icon: any;
  isValid: boolean;
  validationErrorMsg?: string;
  touchFields?: () => void;
}

interface StepIndicatorProps<T extends string> {
  steps: StepDefinition<T>[];
  activeStep: T;
  onStepClick: (stepId: T) => void;
}

export function StepIndicator<T extends string>({
  steps,
  activeStep,
  onStepClick
}: StepIndicatorProps<T>) {
  const currentIndex = steps.findIndex(s => s.id === activeStep);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 relative">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border/50 -z-10 hidden md:block" />
      
      {steps.map((step, index) => {
        const isCompleted = step.isValid;
        const isActive = activeStep === step.id;
        const isPast = steps.slice(0, index).every(s => s.isValid);
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <button
              type="button"
              onClick={() => {
                // Allow clicking any step that is already valid, OR the next one if previous are valid
                if (index === 0 || steps.slice(0, index).every(s => s.isValid)) {
                  onStepClick(step.id);
                } else {
                  // Find first invalid step before this one
                  const firstInvalid = steps.slice(0, index).find(s => !s.isValid);
                  if (firstInvalid?.touchFields) firstInvalid.touchFields();
                  toast.error(firstInvalid?.validationErrorMsg || `Veuillez d'abord compléter l'étape ${steps.indexOf(firstInvalid!) + 1}`);
                }
              }}
              className={`group relative flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 w-full md:w-auto ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105 ring-2 ring-primary/20 ring-offset-2 ring-offset-background'
                  : isCompleted && !isActive
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 hover:bg-green-500/20'
                    : 'bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50'
              } ${index > 0 && !steps.slice(0, index).every(s => s.isValid) ? 'opacity-50 cursor-not-allowed hover:bg-card' : ''}`}
            >
              <div className={`p-2 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-white/20' 
                  : isCompleted ? 'bg-green-500/20' : 'bg-muted/50 group-hover:bg-muted'
              }`}>
                {isCompleted && !isActive ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <div className="text-left">
                <p className={`text-xs font-medium uppercase tracking-wider ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground/70'}`}>
                  {step.label}
                </p>
                <p className="font-bold text-sm tracking-tight">{step.title}</p>
              </div>
            </button>

            {index < steps.length - 1 && (
              <div className="flex items-center justify-center md:hidden">
                <ChevronRight className="w-5 h-5 text-muted-foreground/50 rotate-90" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
