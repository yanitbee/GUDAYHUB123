import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    console.log(`Attempting to change language to ${lng}`);
    i18n.changeLanguage(lng)
      .then(() => {
        console.log(`Language changed to ${lng}`);
        localStorage.setItem('i18nextLng', lng);
      })
      .catch((error) => {
        console.error('Failed to change language', error);
      });
  };

  return (
    <div className="lng">
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('am')}>Amharic</button>
    </div>
  );
};

export default LanguageSwitcher;
