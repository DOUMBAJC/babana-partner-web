import { useState, useRef, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Label } from '~/components';

interface ImageUploadProps {
  name: string;
  label: string;
  onChange?: (file: File | null) => void;
  error?: string;
  className?: string;
  helperText?: string;
  required?: boolean;
  defaultImage?: string | null; // URL de l'image existante
  texts?: {
    change: string;
    dragDrop: string;
    fileType: string;
  };
}

export function ImageUpload({
  name,
  label,
  onChange,
  error,
  className,
  helperText,
  required,
  defaultImage,
  texts = {
    change: "Changer l'image",
    dragDrop: "Cliquez ou glissez une image",
    fileType: "JPG, PNG, GIF (max. 3MB)"
  }
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultImage && (preview === null || preview === defaultImage)) {
      setPreview(defaultImage);
    }
  }, [defaultImage]);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange?.(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onChange?.(null);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium flex gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300",
          "h-48 flex flex-col items-center justify-center text-center p-4",
          isDragOver 
            ? "border-primary bg-primary/5 scale-[0.99]" 
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
          error && "border-red-500 bg-red-500/5",
          preview ? "border-solid" : ""
        )}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />

        {preview ? (
          <>
            <img 
              src={preview} 
              alt="Preview" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-background/90 text-foreground px-4 py-2 rounded-full text-sm font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                {texts.change}
              </div>
            </div>
            <button
              onClick={removeImage}
              type="button"
              className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted-foreground transition-colors group-hover:text-primary">
            <div className={cn(
              "p-3 rounded-full bg-muted transition-colors duration-300",
              isDragOver ? "bg-primary/10 text-primary" : "group-hover:bg-primary/10 group-hover:text-primary"
            )}>
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {texts.dragDrop}
              </p>
              <p className="text-xs text-muted-foreground">
                {texts.fileType}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
         <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-in slide-in-from-top-1">
           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           {error}
         </p>
      )}
      
      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
