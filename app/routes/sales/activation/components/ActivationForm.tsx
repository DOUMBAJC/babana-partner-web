import { Form } from 'react-router';
import { Barcode, Smartphone, CreditCard, FileText, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { Card, Input, Button, Label } from '~/components';
import { useTranslation } from '~/hooks';
import type { CustomerData, ActivationFormData, FormErrors } from '../types';

interface ActivationFormProps {
  customer: CustomerData | null;
  formData: ActivationFormData;
  errors: FormErrors;
  loading: boolean;
  errorMessage: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

function getCustomerName(customer: CustomerData | null): string {
  if (!customer) return "Unknown Customer";
  if (customer.firstName && customer.lastName) return `${customer.firstName} ${customer.lastName}`;
  return customer.full_name || "Unknown Customer";
}

export function ActivationForm({
  customer,
  formData,
  errors,
  loading,
  errorMessage,
  onInputChange,
  onSubmit,
  onBack,
}: ActivationFormProps) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="space-y-2">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 pl-0 text-gray-500 hover:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.simActivation.backToSearch}
        </Button>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              {t.simActivation.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {t.simActivation.subtitle}
            </p>
          </div>
          {/* Show Customer Badge/Info if available */}
          {customer && (
            <div className="flex w-fit gap-2 border border-orange-200 bg-orange-50 px-4 py-2 text-base font-normal text-orange-800 rounded-md dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-900">
              <div className="h-4 w-4 rounded-full bg-orange-500 mt-0.5" />
              <span>{getCustomerName(customer).toUpperCase()}</span>
              <span className="opacity-60">|</span>
              <span className="font-mono">{customer.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Message d'erreur API */}
      {errorMessage && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-red-600 text-sm font-bold">!</span>
            </div>
            <div className="flex-1">
              <p className="text-red-700 dark:text-red-400 font-medium mb-1">{errorMessage}</p>
              {/* Afficher les erreurs de validation supplémentaires s'il y en a */}
              {Object.keys(errors).length > 0 && (
                <ul className="mt-2 space-y-1">
                  {Object.entries(errors).map(([field, error]) => (
                    error && (
                      <li key={field} className="text-sm text-red-600 dark:text-red-400">
                        • {error}
                      </li>
                    )
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Form Section */}
        <div className="md:col-span-2">
          <Card className="border-gray-200/50 bg-white/50 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/50">
            <Form method="post" onSubmit={onSubmit} className="p-6 md:p-8">
              {/* Hidden inputs pour les données du FormData */}
              <input type="hidden" name="customerId" value={customer?.id || ''} />
              <div className="grid gap-6">

                <div className="flex items-center gap-2 border-b border-gray-100 pb-2 dark:border-gray-800">
                  <Smartphone className="h-5 w-5 text-orange-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t.simActivation.simInfo}</h3>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* SIM Number */}
                  <div className="space-y-2">
                    <Label htmlFor="simNumber" className="text-gray-700 dark:text-gray-300">
                      {t.simActivation.fields.simNumber} <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Barcode className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="simNumber"
                        name="sim_number"
                        placeholder={t.simActivation.fields.simNumberPlaceholder}
                        value={formData.simNumber}
                        onChange={onInputChange}
                        className={`pl-9 ${errors.simNumber ? "border-red-500 ring-red-500" : ""}`}
                        required
                      />
                    </div>
                    {errors.simNumber && (
                      <p className="text-xs text-red-500 animate-in slide-in-from-top-1">{errors.simNumber}</p>
                    )}
                  </div>

                  {/* IMEI */}
                  <div className="space-y-2">
                    <Label htmlFor="imei" className="text-gray-700 dark:text-gray-300">
                      {t.simActivation.fields.imei} <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="imei"
                        name="imei"
                        placeholder={t.simActivation.fields.imeiPlaceholder}
                        value={formData.imei}
                        onChange={onInputChange}
                        maxLength={15}
                        className={`pl-9 ${errors.imei ? "border-red-500 ring-red-500" : ""}`}
                        required
                      />
                    </div>
                    {errors.imei && (
                      <p className="text-xs text-red-500 animate-in slide-in-from-top-1">{errors.imei}</p>
                    )}
                  </div>

                  {/* ICCID */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="iccid" className="text-gray-700 dark:text-gray-300">
                      {t.simActivation.fields.iccid} <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="iccid"
                        name="iccid"
                        placeholder={t.simActivation.fields.iccidPlaceholder}
                        value={formData.iccid}
                        onChange={onInputChange}
                        maxLength={20}
                        className={`pl-9 font-mono ${errors.iccid ? "border-red-500 ring-red-500" : ""}`}
                        required
                      />
                    </div>
                    {errors.iccid && (
                      <p className="text-xs text-red-500 animate-in slide-in-from-top-1">{errors.iccid}</p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="ba_notes" className="text-gray-700 dark:text-gray-300">
                    {t.simActivation.fields.notes}
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      id="ba_notes"
                      name="ba_notes"
                      placeholder={t.simActivation.fields.notesPlaceholder}
                      value={formData.ba_notes}
                      onChange={onInputChange}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                >
                  {t.actions.cancel}
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="group relative h-12 rounded-xl px-8 font-semibold overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background: 'linear-gradient(135deg, #F97316 0%, #EC4899 100%)',
                  }}
                >
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                  {/* Contenu */}
                  <div className="relative z-10 flex items-center justify-center text-white">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        {t.common.loading}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        {t.simActivation.activate}
                      </>
                    )}
                  </div>
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
