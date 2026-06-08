export const SUPPORTED_LANGUAGES = [
  { code: "ar",      label: "Arabic",     native: "العربية" },
  { code: "de",      label: "German",     native: "Deutsch" },
  { code: "es",      label: "Spanish",    native: "Español" },
  { code: "fr",      label: "French",     native: "Français" },
  { code: "it",      label: "Italian",    native: "Italiano" },
  { code: "ja",      label: "Japanese",   native: "日本語" },
  { code: "ko",      label: "Korean",     native: "한국어" },
  { code: "pl",      label: "Polish",     native: "Polski" },
  { code: "pt",      label: "Portuguese", native: "Português" },
  { code: "ro",      label: "Romanian",   native: "Română" },
  { code: "ru",      label: "Russian",    native: "Русский" },
  { code: "zh-Hans", label: "Chinese",    native: "中文" },
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];
