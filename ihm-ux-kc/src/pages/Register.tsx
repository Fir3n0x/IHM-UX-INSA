import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError(t('register.errorPasswordCheck'));
      setSuccess("");
      return;
    }

    if (password.length < 4) {
      setError(t('register.errorPasswordCharacter'));
      setSuccess("");
      return;
    }

    const created = register(username, password);
    if (created) {
      setSuccess(t('register.successCreateAccount'));
      setError("");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setError(t('register.errorUsername'));
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-zinc-900 dark:text-zinc-100 text-4xl text-center font-extrabold mb-12">{t('register.registerTitle')}</h2>

        {error && <p className="text-red-600 dark:text-red-500 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-600 dark:text-green-500 text-sm mb-4 text-center">{success}</p>}

        <div className="mb-4">
          <label
            htmlFor="register-username"
            className="block mb-1 font-medium text-zinc-900 dark:text-zinc-100">{t('register.userTitle')}
          </label>
          <input
            id="register-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-zinc-600 dark:text-zinc-200
             border-zinc-300 dark:border-zinc-400"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="register-password"
            className="block mb-1 font-medium text-zinc-900 dark:text-zinc-100">{t('register.passwordTitle')}
          </label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-zinc-600 dark:text-zinc-200
             border-zinc-300 dark:border-zinc-400"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="register-confirm-password"
            className="block mb-1 font-medium text-zinc-900 dark:text-zinc-100">{t('register.confirmPasswordTitle')}
          </label>
          <input
            id="register-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-zinc-600 dark:text-zinc-200
             border-zinc-300 dark:border-zinc-400"
            required
          />
        </div>
        
        <button
          type="submit"
          className="flex justify-center bg-blue-600 text-white w-full px-6 py-2 rounded-lg
           hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
        >
        {t('register.registerButton')}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
