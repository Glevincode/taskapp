import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ja' | 'tl';

// LanguageContext.tsx
const translations = {
  en: {
    addTask: 'Add Task',
    taskDate: 'Task Date',
    selectDate: 'Select Date',
    taskTime: 'Task Time',
    selectTime: 'Select Time',
    categories: 'Categories',
    chooseCategory: 'Choose a Category',
    description: 'Description',
    writeTask: 'Write Task...',
    create: 'Create',
      settings: 'Settings',
    changeLanguage: ' Language',
    logout: 'Log Out',
    // ...other keys
  },
  ja: {
    addTask: 'タスクを追加',
    taskDate: 'タスクの日付',
    selectDate: '日付を選択',
    taskTime: 'タスクの時間',
    selectTime: '時間を選択',
    categories: 'カテゴリー',
    chooseCategory: 'カテゴリーを選択',
    description: '説明',
    writeTask: 'タスクを入力...',
    create: '作成',
     settings: '設定',
    changeLanguage: '言語を変更',
    logout: 'ログアウト',
    // ...other keys
  },
  tl: {
    addTask: 'Magdagdag ng Gawain',
    taskDate: 'Petsa ng Gawain',
    selectDate: 'Pumili ng Petsa',
    taskTime: 'Oras ng Gawain',
    selectTime: 'Pumili ng Oras',
    categories: 'Mga Kategorya',
    chooseCategory: 'Pumili ng Kategorya',
    description: 'Deskripsyon',
    writeTask: 'Isulat ang Gawain...',
    create: 'Gumawa',
     settings: 'Mga Setting',
    changeLanguage: 'Palitan ang Wika',
    logout: 'Mag-logout',
    // ...other keys
  },
};
const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
}>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => translations.en[key],
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const t = (key: keyof typeof translations['en']) => translations[language][key] || key;
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);