import React, { useState, createContext, useContext, ReactNode } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "i18next";
import type { TFunction } from "i18next";

interface LanguageProviderProps {
  children: ReactNode;
}

interface LanguageContextProps {
  language: string;
  theme: string;
  changeLanguage: (newLanguage: string) => void;
  t: TFunction<string>;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language);
  const [theme, setTheme] = useState(getTheme(language));

  function getTheme(lang: string): string {
    return lang === "en" ? "light" : "dark";
  }

  const changeLanguage = (newLanguage: string) => {
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
    setTheme(getTheme(newLanguage));
  };

  const { t } = useTranslation("global");

  const contextValue: LanguageContextProps = {
    language,
    theme,
    changeLanguage,
    t,
  };

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageContext.Provider value={contextValue}>
        {children}
      </LanguageContext.Provider>
    </I18nextProvider>
  );
};

const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export { LanguageProvider, useLanguage };
