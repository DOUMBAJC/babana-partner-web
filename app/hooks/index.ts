export { useTheme, ThemeProvider } from './useTheme';
export { useScrolled } from './useScrolled';
export { useLanguage, LanguageProvider } from './useLanguage';
export { useTranslation } from './useTranslation';
export { useAuth, AuthProvider } from './useAuth';
export { usePermissions } from './usePermissions';

// Customer hooks
export {
  useCustomers,
  useCustomer,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  useIdCardTypes,
} from './useCustomers';

// Activation Request hooks
export {
  useActivationRequests,
  useActivationRequest,
  useCreateActivationRequest,
  useUpdateActivationRequest,
  useCancelActivationRequest,
  useProcessActivationRequest,
  useActivationRequestHistory,
  useActivationRequestStats,
} from './useActivationRequests';

