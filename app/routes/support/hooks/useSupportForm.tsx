import { useState, useEffect } from "react";
import { useSubmit, useActionData, useNavigation } from "react-router";
import type { SupportPriority } from "~/lib/services/support.service";

export interface SupportFormData {
  full_name: string;
  email: string;
  subject: string;
  message: string;
  priority: SupportPriority;
}

const INITIAL_FORM_DATA: SupportFormData = {
  full_name: "",
  email: "",
  subject: "",
  message: "",
  priority: "normal",
};

export function useSupportForm() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<{ success: boolean; error?: string; ticket?: any; message?: string }>();
  
  const [formData, setFormData] = useState<SupportFormData>(INITIAL_FORM_DATA);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [attachment, setAttachment] = useState<File | null>(null);

  // Utiliser navigation.state pour déterminer si on est en train de soumettre
  const isSubmitting = navigation.state === "submitting";

  // Gérer la réponse de l'action
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        setIsSubmitted(true);
        setError(undefined);
      } else {
        setError(actionData.error || "Erreur lors de l'envoi du formulaire");
        setIsSubmitted(false);
      }
    }
  }, [actionData]);

  // Réinitialiser le formulaire après succès
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setFormData(INITIAL_FORM_DATA);
        setFocusedField(null);
        setIsSubmitted(false);
        setAttachment(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(undefined);
  };

  const handlePriorityChange = (priority: SupportPriority) => {
    setFormData((prev) => ({ ...prev, priority }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.subject || !formData.message) {
      setError("Tous les champs sont requis");
      return;
    }

    setError(undefined);

    // Créer FormData pour supporter les fichiers en format multipart/form-data
    // Exactement comme dans customer/identify
    const formDataToSend = new FormData();
    formDataToSend.append('full_name', formData.full_name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('subject', formData.subject);
    formDataToSend.append('message', formData.message);
    formDataToSend.append('priority', formData.priority);

    // Ajouter le fichier d'attachement (une seule image)
    if (attachment) {
      formDataToSend.append('attachment', attachment, attachment.name);
      console.log('[Support Form] Adding attachment:', {
        name: attachment.name,
        type: attachment.type,
        size: attachment.size,
      });
    }

    // Vérifier que FormData contient bien le fichier
    console.log('[Support Form] FormData entries:', Array.from(formDataToSend.entries()).map(([key, value]) => ({
      key,
      isFile: value instanceof File,
      type: value instanceof File ? value.type : typeof value,
      size: value instanceof File ? value.size : undefined,
    })));

    // Utiliser useSubmit de React Router exactement comme dans customer/identify
    // useSubmit gère automatiquement FormData en multipart/form-data
    submit(formDataToSend, {
      method: 'post',
      encType: 'multipart/form-data',
    });
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setFocusedField(null);
    setIsSubmitted(false);
    setError(undefined);
    setAttachment(null);
  };

  return {
    formData,
    setFormData,
    focusedField,
    setFocusedField,
    isSubmitting,
    isSubmitted,
    error,
    attachment,
    setAttachment,
    handleChange,
    handlePriorityChange,
    handleSubmit,
    resetForm,
  };
}

