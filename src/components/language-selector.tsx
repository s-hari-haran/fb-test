'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type LanguageSelectorProps = {
    selectedLanguage: string;
    onLanguageChange: (language: string) => void;
};

const languages = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'es-ES', label: 'Español' },
  { value: 'fr-FR', label: 'Français' },
  { value: 'de-DE', label: 'Deutsch' },
  { value: 'it-IT', label: 'Italiano' },
  { value: 'pt-BR', label: 'Português (BR)' },
  { value: 'ja-JP', label: '日本語' },
  { value: 'ko-KR', label: '한국어' },
  { value: 'zh-CN', label: '中文 (简体)' },
];

export default function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <Select value={selectedLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger className="w-[180px] bg-card border-none shadow-sm focus:ring-0">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map(lang => (
            <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
