import { ArrowLeft, ArrowRight, Save, Loader2 } from 'lucide-react';
import { Button } from '~/components';
import { toast } from 'sonner';

interface FormFooterProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  prevStep: () => void;
  nextStep: () => void;
  onCancel: () => void;
  isStepValid: boolean;
  isFormValid: boolean;
  loading: boolean;
  loadingText: string;
  submitText: string;
  cancelText: string;
  nextText?: string;
  prevText?: string;
  onNextValidationFailed?: () => void;
  nextValidationErrorMsg?: string;
}

export function FormFooter({
  isFirstStep,
  isLastStep,
  prevStep,
  nextStep,
  onCancel,
  isStepValid,
  isFormValid,
  loading,
  loadingText,
  submitText,
  cancelText,
  nextText = "Suivant",
  prevText = "Précédent",
  onNextValidationFailed,
  nextValidationErrorMsg
}: FormFooterProps) {
  
  const handleNext = () => {
    if (isStepValid) {
      nextStep();
    } else {
      if (onNextValidationFailed) onNextValidationFailed();
      if (nextValidationErrorMsg) toast.error(nextValidationErrorMsg);
    }
  };

  return (
    <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
      <Button 
        type="button" 
        variant="outline"
        onClick={isFirstStep ? onCancel : prevStep}
        className="h-12 px-6 rounded-xl border-2 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary font-bold transition-all duration-300 w-full sm:w-auto flex items-center justify-center group"
        disabled={loading}
      >
        {!isFirstStep ? (
          <>
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            {prevText}
          </>
        ) : (
          <span className="group-hover:-translate-x-1 transition-transform">{cancelText}</span>
        )}
      </Button>
      
      {!isLastStep ? (
        <Button 
          type="button" 
          disabled={!isStepValid}
          onClick={handleNext}
          className={`group relative h-12 rounded-xl px-10 font-bold shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto overflow-hidden ${
            isStepValid
              ? 'text-white'
              : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60 shadow-none'
          }`}
          style={{
            background: isStepValid
              ? 'linear-gradient(135deg, #5FC8E9 0%, #3BA5C7 100%)'
              : undefined
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          <span className="relative z-10 flex items-center justify-center">
            {nextText}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>
      ) : (
        <Button 
          type="submit" 
          disabled={loading || !isFormValid}
          className="group relative h-12 sm:h-13 rounded-xl px-10 font-bold text-base overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl hover:shadow-2xl disabled:shadow-lg w-full sm:w-auto"
          style={{
            background: isFormValid 
              ? 'linear-gradient(135deg, #5FC8E9 0%, #3BA5C7 50%, #2A8FB5 100%)' 
              : 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          
          <div className="relative z-10 flex items-center justify-center text-white">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2.5" />
                <span className="font-bold">{loadingText}</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2.5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
                <span className="font-bold">{submitText}</span>
              </>
            )}
          </div>
        </Button>
      )}
    </div>
  );
}
