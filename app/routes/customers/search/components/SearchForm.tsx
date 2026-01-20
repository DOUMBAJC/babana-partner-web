import { Form } from 'react-router';
import {
  CreditCard,
  AlertCircle,
  CheckCircle,
  Search,
  CardSim,
  Info
} from 'lucide-react';
import {
  Input,
  Button,
  Label,
} from '~/components';
import { EnhancedSelect, SelectItem } from '~/components/EnhancedSelect';
import { useTranslation } from '~/hooks';
import type { IdCardType } from '~/types/customer.types';
import type { SearchQuery } from '../config';

interface SearchFormProps {
  searchQuery: SearchQuery;
  onSearchQueryChange: (query: SearchQuery) => void;
  idCardTypes: IdCardType[];
  validationError: string;
  simNumberValidationError: string;
  onIdCardNumberChange: (value: string) => void;
  onIdCardTypeChange: (value: string) => void;
  onSimNumberChange: (value: string) => void;
  isLocked: boolean;
  selectedCardType?: IdCardType;
  isSearching?: boolean;
}

/**
 * Formulaire de recherche de client par carte d'identité
 */
export function SearchForm({
  searchQuery,
  onSearchQueryChange,
  idCardTypes,
  validationError,
  simNumberValidationError,
  onIdCardNumberChange,
  onIdCardTypeChange,
  onSimNumberChange,
  isLocked,
  selectedCardType,
  isSearching = false
}: SearchFormProps) {
  const { t } = useTranslation();

  // Vérifier si au moins un critère est rempli
  const hasSimNumber = !!searchQuery.sim_number?.trim();
  const hasIdCard = !!searchQuery.id_card_type_id && !!searchQuery.id_card_number?.trim();
  const canSearch = hasSimNumber || hasIdCard;
  const hasErrors = !!validationError || !!simNumberValidationError;

  return (
    <Form method="post" className="space-y-6">
      <input type="hidden" name="intent" value="search" />
      
      {/* Section SIM Number - Optionnel mais mis en avant */}
      <div className="space-y-3 group relative">
        {/* Effet de brillance au focus */}
        <div className="absolute -inset-1 bg-linear-to-r from-primary/0 via-primary/10 to-primary/0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-xl" />
        
        <div className="relative bg-linear-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl p-5 border border-primary/10 group-focus-within:border-primary/30 transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-primary/10 rounded-lg group-focus-within:bg-primary/20 transition-colors">
              <CardSim className="h-4 w-4 text-primary" />
            </div>
            <Label 
              htmlFor="sim_number" 
              className="text-sm font-semibold text-foreground group-focus-within:text-primary transition-colors duration-300"
            >
              {t.customerSearch.fields.simNumber}
            </Label>
            <div className="relative group/info">
              <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-primary transition-colors" />
              <div className="absolute left-0 top-6 w-72 p-3 bg-popover border border-border rounded-xl shadow-xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all duration-200 z-50 text-xs text-muted-foreground backdrop-blur-sm">
                <div className="font-medium text-foreground mb-1">💡 Astuce</div>
                {t.customerSearch.fields.simNumberDescription}
              </div>
            </div>
          </div>
          <div className="relative">
            <CardSim className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground transition-all duration-300 group-focus-within:text-primary pointer-events-none z-10" />
            <Input 
              id="sim_number"
              name="sim_number"
              disabled={isLocked || isSearching}
              className={`pl-12 h-12 bg-background/80 backdrop-blur-sm border-2 transition-all duration-300 focus:bg-background focus:ring-2 focus:ring-primary/30 rounded-xl text-lg hover:border-primary/50 shadow-sm ${
                simNumberValidationError 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' 
                  : 'border-input group-focus-within:border-primary/50'
              } ${isSearching ? 'opacity-60 cursor-wait' : ''}`}
              placeholder={t.customerSearch.fields.simNumberPlaceholder}
              value={searchQuery.sim_number || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Seulement les chiffres
                onSimNumberChange(value);
              }}
              maxLength={9}
            />
          </div>
        </div>
        {simNumberValidationError && (
          <div className="flex items-start gap-2 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <p className="text-sm">{simNumberValidationError}</p>
          </div>
        )}
        {!simNumberValidationError && searchQuery.sim_number && searchQuery.sim_number.length === 9 && (
          <div className="flex items-start gap-2 text-green-600 dark:text-green-400 animate-in fade-in slide-in-from-top-1 duration-200">
            <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <p className="text-sm">Format valide</p>
          </div>
        )}
      </div>

      {/* Séparateur visuel avec texte amélioré */}
      <div className="relative flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-linear-to-r from-transparent via-border to-border relative">
          <div className="absolute right-0 w-8 h-full bg-linear-to-r from-transparent to-border" />
        </div>
        <div className="relative">
          <span className="relative z-10 text-xs font-bold text-muted-foreground px-4 py-2 bg-muted/80 backdrop-blur-sm border border-border/50 rounded-full shadow-sm">
            OU
          </span>
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-md opacity-50 animate-pulse" />
        </div>
        <div className="flex-1 h-px bg-linear-to-l from-transparent via-border to-border relative">
          <div className="absolute left-0 w-8 h-full bg-linear-to-l from-transparent to-border" />
        </div>
      </div>

      {/* Section Carte d'identité */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type de carte */}
        <div className="space-y-3 group">
          <Label
            htmlFor="id_card_type_id"
            className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors duration-300"
          >
            {hasSimNumber 
              ? t.customerSearch.fields.idCardType 
              : t.customerSearch.fields.idCardTypeRequired
            }
          </Label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground transition-all duration-300 group-focus-within:text-primary pointer-events-none z-10" />
            <input type="hidden" name="id_card_type_id" value={searchQuery.id_card_type_id || ''} />
            <div className="pl-12">
              <EnhancedSelect
                value={searchQuery.id_card_type_id}
                onValueChange={onIdCardTypeChange}
                placeholder={t.customerSearch.fields.selectType}
                disabled={isLocked}
                required={!hasSimNumber}
                className="pl-12"
                aria-label={hasSimNumber ? t.customerSearch.fields.idCardType : t.customerSearch.fields.idCardTypeRequired}
              >
                {idCardTypes.map((type: IdCardType) => (
                  <SelectItem
                    key={type.id}
                    value={type.id.toString()}
                  >
                    {type.name} ({type.code})
                  </SelectItem>
                ))}
              </EnhancedSelect>
            </div>
          </div>
        </div>

        {/* Numéro de carte */}
        <div className="space-y-3 group">
          <Label 
            htmlFor="idCardNumber" 
            className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors duration-300"
          >
            {hasSimNumber 
              ? t.customerSearch.fields.idCardNumber 
              : t.customerSearch.fields.idCardNumberRequired
            }
          </Label>
          <div className="space-y-2">
            <div className="relative">
              <CreditCard className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground transition-all duration-300 group-focus-within:text-primary" />
              <Input 
                id="id_card_number"
                name="id_card_number"
                disabled={isLocked}
                className={`pl-12 h-12 bg-background/50 border-input transition-all duration-300 focus:bg-background focus:ring-2 focus:ring-primary/20 rounded-xl text-lg hover:border-primary/50 ${
                  validationError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                }`}
                placeholder={t.customerSearch.fields.idCardNumberPlaceholder}
                value={searchQuery.id_card_number}
                onChange={(e) => onIdCardNumberChange(e.target.value)}
                required={!hasSimNumber}
              />
            </div>
            {validationError && (
              <div className="flex items-start gap-2 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <p className="text-sm">{validationError}</p>
              </div>
            )}
            {selectedCardType?.validation_pattern && !validationError && searchQuery.id_card_number && (
              <div className="flex items-start gap-2 text-green-600 dark:text-green-400 animate-in fade-in slide-in-from-top-1 duration-200">
                <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <p className="text-sm">Format valide</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message d'aide amélioré */}
      {!canSearch && (
        <div className="relative overflow-hidden rounded-xl border border-blue-500/30 bg-linear-to-br from-blue-500/10 via-blue-500/5 to-transparent p-5 shadow-lg">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-blue-500/5 to-transparent animate-[shimmer_3s_infinite]" />
          <div className="relative flex items-start gap-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 animate-pulse" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                💡 Information importante
              </p>
              <p className="text-sm text-blue-600/90 dark:text-blue-400/90">
                {t.customerSearch.errors.atLeastOneField}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-6">
        <Button 
          type="submit" 
          disabled={hasErrors || !canSearch || isSearching}
          className="group relative w-full sm:w-auto px-12 h-16 text-lg font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #5FC8E9 0%, #3BA5C7 50%, #2A8FB8 100%)',
          }}
        >
          {/* Effet de brillance animé */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          
          {/* Overlay au hover avec gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Particules animées */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-2 left-1/4 w-1 h-1 bg-white/60 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
            <div className="absolute top-4 right-1/3 w-1 h-1 bg-white/60 rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
            <div className="absolute bottom-3 left-1/2 w-1 h-1 bg-white/60 rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
          </div>
          
          {/* Contenu */}
          <div className="relative z-10 flex items-center justify-center gap-3 text-white">
            {isSearching ? (
              <>
                <div className="relative w-6 h-6">
                  <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-spin" />
                  <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin" style={{ animationDuration: '0.6s' }} />
                </div>
                <span className="tracking-wide">{t.customerSearch.searching}</span>
              </>
            ) : (
              <>
                <Search className="w-6 h-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                <span className="tracking-wide">{t.customerSearch.searchButton}</span>
                <div className="w-2 h-2 bg-white/80 rounded-full group-hover:scale-150 transition-transform duration-300" />
              </>
            )}
          </div>
          
          {/* Ombre portée animée avec glow */}
          <div className="absolute -inset-2 bg-linear-to-r from-primary/40 via-primary/60 to-primary/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 animate-pulse" />
        </Button>
      </div>
    </Form>
  );
}

