import { Form } from 'react-router';
import {
  CreditCard,
  AlertCircle,
  CheckCircle,
  Search
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
  onIdCardNumberChange: (value: string) => void;
  onIdCardTypeChange: (value: string) => void;
  isLocked: boolean;
  selectedCardType?: IdCardType;
}

/**
 * Formulaire de recherche de client par carte d'identité
 */
export function SearchForm({
  searchQuery,
  onSearchQueryChange,
  idCardTypes,
  validationError,
  onIdCardNumberChange,
  onIdCardTypeChange,
  isLocked,
  selectedCardType
}: SearchFormProps) {
  const { t } = useTranslation();

  return (
    <Form method="post" className="space-y-6">
      <input type="hidden" name="intent" value="search" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type de carte */}
        <div className="space-y-3 group">
          <Label
            htmlFor="id_card_type_id"
            className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors duration-300"
          >
            {t.customerSearch.fields.idCardTypeRequired}
          </Label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground transition-all duration-300 group-focus-within:text-primary pointer-events-none z-10" />
            <input type="hidden" name="id_card_type_id" value={searchQuery.id_card_type_id} />
            <div className="pl-12">
              <EnhancedSelect
                value={searchQuery.id_card_type_id}
                onValueChange={onIdCardTypeChange}
                placeholder={t.customerSearch.fields.selectType}
                disabled={isLocked}
                required={true}
                className="pl-12"
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
        </div>

        {/* Numéro de carte */}
        <div className="space-y-3 group">
          <Label 
            htmlFor="idCardNumber" 
            className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors duration-300"
          >
            {t.customerSearch.fields.idCardNumberRequired}
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
                required
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

      <div className="flex justify-end pt-6">
        <Button 
          type="submit" 
          disabled={!!validationError || !searchQuery.id_card_type_id || !searchQuery.id_card_number}
          className="group relative w-full sm:w-auto px-10 h-16 text-lg font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: 'linear-gradient(135deg, #5FC8E9 0%, #3BA5C7 100%)',
          }}
        >
          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          
          {/* Overlay au hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Contenu */}
          <div className="relative z-10 flex items-center justify-center text-white">
            <Search className="w-6 h-6 mr-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            <span className="tracking-wide">{t.customerSearch.searchButton}</span>
          </div>
          
          {/* Ombre portée animée */}
          <div className="absolute -inset-1 bg-linear-to-r from-primary/50 to-primary/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </Button>
      </div>
    </Form>
  );
}

