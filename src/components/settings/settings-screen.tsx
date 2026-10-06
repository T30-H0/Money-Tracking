"use client";

import { Languages, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useLanguage } from "@/context/language-context";
import { isSupportedLocale, LANGUAGE_OPTIONS } from "@/i18n/config";

interface SettingsScreenProps {
  name?: string;
  email?: string;
  avatarUrl?: string;
}

export function SettingsScreen({ name, email, avatarUrl }: SettingsScreenProps) {
  const { locale, setLocale, isChangingLocale, t } = useLanguage();
  const displayName = name || t("settings.noName");
  const displayEmail = email || t("settings.noEmail");
  const initials = (name || email || "?")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t("settings.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("settings.description")}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <UserRound className="size-5" />
              </span>
              <div>
                <CardTitle>{t("settings.profileTitle")}</CardTitle>
                <CardDescription>{t("settings.profileDescription")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
              <Avatar className="size-14">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt={t("settings.avatar")} /> : null}
                <AvatarFallback className="text-base">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-semibold">{displayName}</p>
                <p className="truncate text-sm text-muted-foreground">{displayEmail}</p>
              </div>
            </div>
            <InfoRow label={t("settings.name")} value={displayName} />
            <InfoRow label={t("settings.email")} value={displayEmail} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Languages className="size-5" />
              </span>
              <div>
                <CardTitle>{t("settings.languageTitle")}</CardTitle>
                <CardDescription>{t("settings.languageDescription")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="app-language">{t("settings.languageLabel")}</Label>
              <Select
                value={locale}
                disabled={isChangingLocale}
                onValueChange={(value) => isSupportedLocale(value) && setLocale(value)}
              >
                <SelectTrigger id="app-language" className="w-full" aria-label={t("settings.languageLabel")}>
                  <span>{LANGUAGE_OPTIONS.find((option) => option.value === locale)?.label}</span>
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {isChangingLocale ? t("settings.languageSaving") : t("settings.languageHelp")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 border-t pt-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="break-words text-sm font-medium">{value}</p>
    </div>
  );
}
