import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router"; // react-router v7
import { useTranslation, usePageTitle } from '~/hooks'; 
import {
  Card,
  Input,
  Button,
  Label,
  Layout,
  Badge
} from '~/components';
import { Loader2, ArrowLeft, CheckCircle, Smartphone, CreditCard, Barcode, FileText, User } from "lucide-react";

interface CustomerData {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string; // Search result might just have 'name'
  phone: string;
  idCard: string;
}

interface ActivationFormData {
  simNumber: string;
  iccid: string;
  imei: string;
  notes: string;
}

interface FormErrors {
  simNumber?: string;
  iccid?: string;
  imei?: string;
}

export default function SimActivationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  usePageTitle(t.pages.sales.activation.title);

  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [formData, setFormData] = useState<ActivationFormData>({
    simNumber: "",
    iccid: "62405010000",
    imei: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load custoner data from location state
  useEffect(() => {
    if (location.state && location.state.customer) {
      setCustomer(location.state.customer);
    } else {
      // If no custoner data, redirect back to search
      // navigate("/customers/search"); // Commented out for dev/testing ease, but strictly should be enabled
    }
  }, [location.state, navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // SIM Number: 9 digits starting with 62
    if (!/^62\d{7}$/.test(formData.simNumber)) {
      newErrors.simNumber = t.simActivation.errors.simNumber;
      isValid = false;
    }

    // ICCID: 19 digits starting with 6240501000
    if (!/^6240501000\d{9}$/.test(formData.iccid)) {
      newErrors.iccid = t.simActivation.errors.iccid;
      isValid = false;
    }

    // IMEI: Exactly 15 digits
    if (!/^\d{15}$/.test(formData.imei)) {
      newErrors.imei = t.simActivation.errors.imei;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Allow only numbers for specific fields
    if (['simNumber', 'iccid', 'imei'].includes(name)) {
        if (value && !/^\d+$/.test(value)) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Mock Backend API Call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Auto redirect after success? Or let user choose?
      // For now, let's keep them on success state
    }, 1500);
  };

  const handleBack = () => {
    navigate("/customers/search");
  };

  const getCustomerName = () => {
    if (!customer) return "Unknown Customer";
    if (customer.firstName && customer.lastName) return `${customer.firstName} ${customer.lastName}`;
    return customer.name || "Unknown Customer";
  };

  if (showSuccess) {
    return (
      <Layout>
        <div className="flex min-h-[80vh] items-center justify-center p-4">
          <Card className="w-full max-w-md border-green-200 bg-green-50/50 p-8 text-center backdrop-blur-xl dark:border-green-900/50 dark:bg-green-900/10">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t.common.success}
            </h2>
            <p className="mb-8 text-gray-600 dark:text-gray-300">
              {t.simActivation.success}
            </p>
            <Button
              onClick={handleBack}
              className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {t.simActivation.backToSearch}
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-8">
        {/* Header */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={handleBack}
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
               <Badge variant="outline" className="flex w-fit gap-2 border-orange-200 bg-orange-50 px-4 py-2 text-base font-normal text-orange-800 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-200">
                  <User className="h-4 w-4" />
                  <span>{getCustomerName()}</span>
                  <span className="opacity-60">|</span>
                  <span className="font-mono">{customer.phone}</span>
               </Badge>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
           {/* Form Section */}
          <div className="md:col-span-2">
            <Card className="border-gray-200/50 bg-white/50 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/50">
              <form onSubmit={handleSubmit} className="p-6 md:p-8">
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
                          name="simNumber"
                          placeholder={t.simActivation.fields.simNumberPlaceholder}
                          value={formData.simNumber}
                          onChange={handleInputChange}
                          className={`pl-9 ${errors.simNumber ? "border-red-500 ring-red-500" : ""}`}
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
                          onChange={handleInputChange}
                          maxLength={15}
                          className={`pl-9 ${errors.imei ? "border-red-500 ring-red-500" : ""}`}
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
                          onChange={handleInputChange}
                          maxLength={19}
                          className={`pl-9 font-mono ${errors.iccid ? "border-red-500 ring-red-500" : ""}`}
                        />
                      </div>
                      {errors.iccid && (
                        <p className="text-xs text-red-500 animate-in slide-in-from-top-1">{errors.iccid}</p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300">
                      {t.simActivation.fields.notes}
                    </Label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                         <textarea
                            id="notes"
                            name="notes"
                            placeholder={t.simActivation.fields.notesPlaceholder}
                            value={formData.notes}
                            onChange={handleInputChange}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9 resize-none"
                         />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  >
                    {t.actions.cancel}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-linear-to-r from-orange-500 to-pink-600 px-8 text-white hover:from-orange-600 hover:to-pink-700 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.common.loading}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {t.simActivation.activate}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
