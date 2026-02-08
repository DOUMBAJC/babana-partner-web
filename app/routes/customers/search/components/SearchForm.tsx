import { useState } from 'react';
import { Form } from 'react-router';
import { CreditCard, AlertCircle, CheckCircle, Search, CardSim, Info, ArrowRight, CheckCircle2} from 'lucide-react';
import { Input, Button, Label} from '~/components';
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

type SearchMethod = 'sim' | 'idcard';

/**
 * Formulaire de recherche de client avec design amélioré pour la clarté
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
  const [activeMethod, setActiveMethod] = useState<SearchMethod>(() => {
    // Déterminer la méthode active en fonction des données existantes
    if (searchQuery.sim_number?.trim()) return 'sim';
    if (searchQuery.id_card_type_id && searchQuery.id_card_number?.trim()) return 'idcard';
    return 'idcard'; // Par défaut, commencer par ID Card
  });

  // Vérifier si au moins un critère est rempli
  const hasSimNumber = !!searchQuery.sim_number?.trim();
  const hasIdCard = !!searchQuery.id_card_type_id && !!searchQuery.id_card_number?.trim();
  const canSearch = hasSimNumber || hasIdCard;
  const hasErrors = !!validationError || !!simNumberValidationError;

  return (
    <Form method="post" className="space-y-6">
      <input type="hidden" name="intent" value="search" />
      
      {/* Onglets modernes avec indication claire de la méthode active */}
      <div className="relative bg-muted/30 rounded-xl p-1.5 border border-border">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveMethod('idcard')}
            className={`relative flex-1 px-5 py-3.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
              activeMethod === 'idcard'
                ? 'bg-background text-primary shadow-md border-2 border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
            disabled={isLocked || isSearching}
          >
            <div className="flex items-center justify-center gap-2">
              <CreditCard className={`h-5 w-5 ${activeMethod === 'idcard' ? 'text-primary' : ''}`} />
              <span>{t.customerSearch.idCardTab}</span>
              {hasIdCard && (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
            </div>
            {activeMethod === 'idcard' && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveMethod('sim')}
            className={`relative flex-1 px-5 py-3.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
              activeMethod === 'sim'
                ? 'bg-background text-primary shadow-md border-2 border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
            disabled={isLocked || isSearching}
          >
            <div className="flex items-center justify-center gap-2">
              <CardSim className={`h-5 w-5 ${activeMethod === 'sim' ? 'text-primary' : ''}`} />
              <span>{t.customerSearch.simTab}</span>
              {hasSimNumber && (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
            </div>
            {activeMethod === 'sim' && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="space-y-6">
        {activeMethod === 'idcard' ? (
          /* Section Carte d'Identité */
          <div className="space-y-6">
            {/* Champs de formulaire */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type de carte */}
              <div className="space-y-2">
                <Label
                  htmlFor="id_card_type_id"
                  className="text-sm font-semibold text-foreground flex items-center gap-2"
                >
                  <CreditCard className="h-4 w-4 text-primary" />
                  {t.customerSearch.fields.idCardTypeRequired}
                </Label>
                <div className="relative">
                  <input type="hidden" name="id_card_type_id" value={searchQuery.id_card_type_id || ''} />
                  <EnhancedSelect
                    value={searchQuery.id_card_type_id}
                    onValueChange={onIdCardTypeChange}
                    placeholder={t.customerSearch.fields.selectType}
                    disabled={isLocked || isSearching}
                    required={true}
                    aria-label={t.customerSearch.fields.idCardTypeRequired}
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

              {/* Numéro de carte */}
              <div className="space-y-2">
                <Label 
                  htmlFor="id_card_number" 
                  className="text-sm font-semibold text-foreground flex items-center gap-2"
                >
                  <CreditCard className="h-4 w-4 text-primary" />
                  {t.customerSearch.fields.idCardNumberRequired}
                </Label>
                <div className="relative">
                  <Input 
                    id="id_card_number"
                    name="id_card_number"
                    disabled={isLocked || isSearching}
                    className={`h-12 border-2 transition-all duration-300 focus:ring-2 focus:ring-primary/20 rounded-lg ${
                      validationError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-input focus:border-primary'
                    }`}
                    placeholder={t.customerSearch.fields.idCardNumberPlaceholder}
                    value={searchQuery.id_card_number}
                    onChange={(e) => onIdCardNumberChange(e.target.value)}
                    required={true}
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
                    <p className="text-sm">{t.customerSearch.validFormat}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          /* Section Numéro SIM */
          <div className="space-y-6">
            {/* Champ SIM Number */}
            <div className="space-y-2">
              <Label 
                htmlFor="sim_number" 
                className="text-sm font-semibold text-foreground flex items-center gap-2"
              >
                <CardSim className="h-4 w-4 text-primary" />
                {t.customerSearch.fields.simNumber}
              </Label>
              <div className="relative">
                <Input 
                  id="sim_number"
                  name="sim_number"
                  disabled={isLocked || isSearching}
                  className={`h-12 pl-12 border-2 transition-all duration-300 focus:ring-2 focus:ring-primary/20 rounded-lg ${
                    simNumberValidationError 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-input focus:border-primary'
                  } ${isSearching ? 'opacity-60 cursor-wait' : ''}`}
                  placeholder={t.customerSearch.fields.simNumberPlaceholder}
                  value={searchQuery.sim_number || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Seulement les chiffres
                    onSimNumberChange(value);
                  }}
                  maxLength={9}
                />
                <CardSim className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground pointer-events-none" />
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
                  <p className="text-sm">{t.customerSearch.validFormat}</p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Bouton de recherche */}
      <div className="flex flex-col gap-3 pt-6 border-t border-border">
        {!canSearch && (
          <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
            <Info className="h-4 w-4 shrink-0" />
            <span>{t.customerSearch.errors.atLeastOneField}</span>
          </div>
        )}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={hasErrors || !canSearch || isSearching}
            className="group relative w-full sm:w-auto px-8 h-12 text-base font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #5FC8E9 0%, #3BA5C7 50%, #2A8FB8 100%)',
            }}
          >
            <div className="relative z-10 flex items-center justify-center gap-2 text-white">
              {isSearching ? (
                <>
                  <div className="relative w-5 h-5">
                    <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-spin" />
                    <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin" style={{ animationDuration: '0.6s' }} />
                  </div>
                  <span>{t.customerSearch.searching}</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>{t.customerSearch.searchButton}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </Button>
        </div>
      </div>
    </Form>
  );
}

