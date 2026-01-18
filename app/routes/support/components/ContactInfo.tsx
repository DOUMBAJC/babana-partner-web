import { Card, CardContent, CardHeader, CardTitle } from "~/components";
import { useTranslation } from "~/hooks";
import { Mail, Phone, Clock, Headphones } from "lucide-react";

export function ContactInfo() {
  const { t } = useTranslation();

  return (
    <Card className="border-2 border-babana-cyan/20 dark:border-babana-cyan/10 shadow-xl backdrop-blur-sm bg-card/80 dark:bg-card/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Headphones className="w-5 h-5 text-babana-cyan" />
          {t.pages.support.contact.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <a
          href={`mailto:${t.pages.support.contact.email}`}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
        >
          <div className="p-2 rounded-lg bg-babana-cyan/10 dark:bg-babana-cyan/20 group-hover:bg-babana-cyan/20 dark:group-hover:bg-babana-cyan/30 transition-colors">
            <Mail className="w-5 h-5 text-babana-cyan" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{t.pages.support.contact.emailLabel}</p>
            <p className="font-medium group-hover:text-babana-cyan transition-colors">
              {t.pages.support.contact.email}
            </p>
          </div>
        </a>

        <a
          href={`tel:${t.pages.support.contact.phone}`}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
        >
          <div className="p-2 rounded-lg bg-babana-blue/10 dark:bg-babana-blue/20 group-hover:bg-babana-blue/20 dark:group-hover:bg-babana-blue/30 transition-colors">
            <Phone className="w-5 h-5 text-babana-blue" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{t.pages.support.contact.phoneLabel}</p>
            <p className="font-medium group-hover:text-babana-blue transition-colors">
              {t.pages.support.contact.phone}
            </p>
          </div>
        </a>

        <div className="flex items-center gap-3 p-3 rounded-lg">
          <div className="p-2 rounded-lg bg-green-500/10 dark:bg-green-500/20">
            <Clock className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{t.pages.support.contact.hoursLabel}</p>
            <p className="font-medium">{t.pages.support.contact.hours}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

