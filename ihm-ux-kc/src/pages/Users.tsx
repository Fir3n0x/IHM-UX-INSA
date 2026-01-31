import React from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const Users: React.FC = () => {
    const { userId, removeUser, changeUserRole } = useAuth();
    const { t } = useTranslation();
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    return (
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">{t('users.textTitle')}</h2>
            
            {/* Version Desktop */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-white dark:bg-zinc-800">
                            <th className="text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-900 border px-4 py-2">{t('users.tabId')}</th>
                            <th className="text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-900 border px-4 py-2">{t('users.tabName')}</th>
                            <th className="text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-900 border px-4 py-2">{t('users.tabRight')}</th>
                            <th className="text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-900 border px-4 py-2">{t('users.tabActions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: any) => (
                            <tr key={user.id} className="text-center">
                                <td className="text-zinc-900 dark:text-zinc-100 border px-4 py-2">{user.id}</td>
                                <td className="text-zinc-900 dark:text-zinc-100 border px-4 py-2">{user.username}</td>
                                <td className="text-zinc-900 dark:text-zinc-100 border px-4 py-2">{user.role === "admin" ? t('users.admin') : t('users.user')}</td>
                                <td className="text-zinc-900 dark:text-zinc-100 border px-4 py-2 text-center align-middle">
                                    {user.id !== userId ? (
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() =>
                                                    changeUserRole(user.id, user.role === "admin" ? "user" : "admin")
                                                }
                                                className="bg-blue-600 dark:bg-blue-500 text-white px-3 py-1
                                                rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                                            >
                                                {t('users.switchRightButton')}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const confirm = window.confirm(t('users.confirmationMessage') + " " + user.username);
                                                    if (confirm) removeUser(user.id);
                                                }}
                                                className="bg-red-600 dark:bg-red-500 text-white px-3 py-1
                                                rounded-lg hover:bg-red-700 dark:hover:bg-red-600"
                                            >
                                                {t('users.deleteAccount')}
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="opacity-0">–</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Version Mobile */}
            <div className="md:hidden space-y-4">
                {users.map((user: any) => (
                    <div 
                        key={user.id} 
                        className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700"
                    >
                        {/* Header de la carte */}
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                    {user.username}
                                </h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    ID: {user.id}
                                </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                user.role === "admin" 
                                    ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300" 
                                    : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                            }`}>
                                {user.role === "admin" ? t('users.admin') : t('users.user')}
                            </span>
                        </div>

                        {/* Actions */}
                        {user.id !== userId && (
                            <div className="flex flex-col gap-2 mt-3">
                                <button
                                    onClick={() =>
                                        changeUserRole(user.id, user.role === "admin" ? "user" : "admin")
                                    }
                                    className="w-full bg-blue-600 dark:bg-blue-500 text-white px-4 py-2
                                     rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                                >
                                    {t('users.switchRightButton')}
                                </button>
                                <button
                                    onClick={() => {
                                        const confirm = window.confirm(t('users.confirmationMessage') + " " + user.username);
                                        if (confirm) removeUser(user.id);
                                    }}
                                    className="w-full bg-red-600 dark:bg-red-500 text-white px-4 py-2
                                     rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
                                >
                                    {t('users.deleteAccount')}
                                </button>
                            </div>
                        )}

                        {/* Indicateur si c'est l'utilisateur actuel */}
                        {user.id === userId && (
                            <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center italic">
                                    {t('users.currentUser', 'C\'est toi')}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Message si aucun utilisateur */}
            {users.length === 0 && (
                <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                    {t('users.noUsers', 'Aucun utilisateur trouvé')}
                </div>
            )}
        </div>
    );
};

export default Users;