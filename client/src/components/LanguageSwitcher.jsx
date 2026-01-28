import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ display: 'flex', gap: '5px', marginLeft: '15px' }}>
      <button 
        onClick={() => changeLanguage('vi')}
        style={{
            padding: '5px 10px',
            cursor: 'pointer',
            fontWeight: i18n.language === 'vi' ? 'bold' : 'normal',
            backgroundColor: i18n.language === 'vi' ? '#2e7d32' : '#eee',
            color: i18n.language === 'vi' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '4px'
        }}
      >
        VN
      </button>
      <button 
        onClick={() => changeLanguage('en')}
        style={{
            padding: '5px 10px',
            cursor: 'pointer',
            fontWeight: i18n.language === 'en' ? 'bold' : 'normal',
            backgroundColor: i18n.language === 'en' ? '#2e7d32' : '#eee',
            color: i18n.language === 'en' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '4px'
        }}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;