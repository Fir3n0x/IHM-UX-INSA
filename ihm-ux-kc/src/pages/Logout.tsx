import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 flex flex-col items-center justify-center px-8 py-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">{t('logout.logoutTitle')}</h1>
      <p className="text-zinc-900 dark:text-zinc-100 mb-6">{t('logout.logoutDescription')}</p>
      <button
        onClick={() => navigate('/')}
        className="flex justify-center bg-blue-600 text-white px-6 py-2 rounded-lg
         hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
      >
      {t('logout.logoutButton')}
      </button>
    </div>
  );
};

export default Logout;