import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Settings: React.FC = () => {
    const { logout } = useAuth();
    const { t } = useTranslation();
    return (
        <div className="text-zinc-900 dark:text-zinc-100">
            <button
                onClick={logout}
                className="mt-4 bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded-lg
                 hover:bg-red-700 dark:hover:bg-red-600 transition"
            >
                {t('settings.logoutButton')}
            </button>
        </div>
    );
};

export default Settings;
