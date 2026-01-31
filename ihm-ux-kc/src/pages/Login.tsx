import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(username, password);
        if (success) {
        navigate("/profile");
        } else {
        setError(t('login.errorLogin'));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-zinc-800 p-8 rounded shadow-md w-full max-w-sm"
        >
            <h2 className="text-zinc-900 dark:text-zinc-100 text-4xl text-center font-extrabold mb-12">{t('login.loginTitle')}</h2>

            {error && <p className="text-red-600 dark:text-red-500 text-sm mb-4 text-center">{error}</p>}

            <div className="mb-4">
            <label 
                htmlFor="login-username" 
                className="block mb-1 font-medium text-zinc-900 dark:text-zinc-100">{t('login.userTitle')}
            </label>
            <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-zinc-600 dark:text-zinc-200 border-zinc-300 dark:border-zinc-400 px-3 py-2 border rounded-lg"
                required
            />
            </div>

            <div className="mb-6">
            <label 
                htmlFor="login-password" 
                className="block mb-1 font-medium text-zinc-900 dark:text-zinc-100">{t('login.passwordTitle')}
            </label>
            <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-zinc-600 dark:text-zinc-200 border-zinc-300 dark:border-zinc-400 px-3 py-2 border rounded-lg"
                required
            />
            </div>

            <button
                type="submit"
                className="flex justify-center bg-blue-600 dark:bg-blue-500 text-white
                 w-full px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
            {t('login.loginButton')}
            </button>
            
            <button
                type="button"
                onClick={() => navigate("/register")}
                className="mt-4 text-blue-600 dark:text-blue-500 hover:underline text-sm text-center w-full"
            >
            {t('login.createAccount')}
            </button>
        </form>
        </div>
    );
};

export default LoginPage;