import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import Favorites from "./Favorites";
import Settings from "./Settings";
import Users from "./Users";

type Props = {
    defaultTab?: "profile" | "favorites" | "settings" | "users";
    geoData: any;
};

const ProfilePage: React.FC<Props> = ({ defaultTab = "profile", geoData }) => {
    const { username, updateUsername, updatePassword, deleteUser, role } = useAuth();
    const [activeTab, setActiveTab] = useState<"profile" | "favorites" | "settings" | "users">(defaultTab);
    const [newUsername, setNewUsername] = useState(username || "");
    const [newPassword, setNewPassword] = useState("");
    const { t } = useTranslation();

    // Mise à jour de l'onglet actif selon l'URL
    useEffect(() => {
        if (location.pathname === "/favorites") {
            setActiveTab("favorites");
        } else if (location.pathname === "/settings") {
            setActiveTab("settings");
        } else {
            setActiveTab("profile");
        }
    }, [location.pathname]);

    // Change username handler
    const handleUsernameChange = () => {
        if (newUsername.trim() && newUsername !== username) {
            updateUsername(newUsername.trim());
            alert("Nom d'utilisateur mis à jour !");
        } else {
            alert("Le nouveau nom doit être différent et non vide.");
        }
    };

    // Change password handler
    const handlePasswordChange = () => {
        if (newPassword.trim().length < 4) {
            alert("Le mot de passe doit contenir au moins 4 caractères.");
            return;
        }
        updatePassword(newPassword.trim());
        alert("Mot de passe mis à jour !");
        setNewPassword("");
    };

    // Delete account handler
    const handleDeleteUser = () => {
        const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ?");
        if (confirmDelete) {
            deleteUser();
            alert("Compte supprimé.");
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-900 px-8 py-12">
        <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-800 rounded-xl shadow-md p-8">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 text-center">{t('profile.title')}</h2>
            <p className="text-center text-zinc-900 dark:text-zinc-100 mb-6">
                {t('profile.welcomeText')}, <strong>{username}</strong> !
            </p>

            {/* Onglets */}
            <div className="flex flex-col sm:flex-row sm:justify-center gap-4 sm:gap-6 mb-6">
            <button
                onClick={() => setActiveTab("profile")}
                className={
                    `px-4 py-2 rounded ${activeTab === "profile"
                        ? "bg-zinc-700 dark:bg-zinc-900 text-white"
                        : "bg-zinc-200 text-zinc-900 dark:bg-zinc-200"}`
                }
            >
            {t('profile.tabProfile')}
            </button>
            <button
                onClick={() => setActiveTab("favorites")}
                className={
                    `px-4 py-2 rounded ${activeTab === "favorites"
                        ? "bg-zinc-700 dark:bg-zinc-900 text-white"
                        : "bg-zinc-200 text-zinc-900 dark:bg-zinc-200"}`
                }
            >
            {t('profile.tabFavorites')}
            </button>
            <button
                onClick={() => setActiveTab("settings")}
                className={
                    `px-4 py-2 rounded ${activeTab === "settings"
                    ? "bg-zinc-700 dark:bg-zinc-900 text-white"
                    : "bg-zinc-200 text-zinc-900 dark:bg-zinc-200"}`
                }
            >
            {t('profile.tabSettings')}
            </button>
            
            {/* Admin page */}
            {role === "admin" && (
                <button
                    onClick={() => setActiveTab("users")}
                    className={
                        `px-4 py-2 rounded ${activeTab === "users"
                        ? "bg-zinc-700 dark:bg-zinc-900 text-white"
                        : "bg-zinc-200 text-zinc-900 dark:bg-zinc-200"}`
                    }
                >
                {t('profile.tabUsers')}
                </button>
            )}
            </div>

            {/* Contenu des onglets */}
            {activeTab === "profile" && (
            <div className="text-zinc-900 dark:text-zinc-100">
                
                {/* Modifier le nom d'utilisateur */}
                <label
                    htmlFor="modify-username"
                    className="block mb-2 font-medium">{t('profile.modifyUsernameText')}
                </label>
                <input
                    id="modify-username"
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-lg rounded mb-4"
                />
                <button
                    onClick={handleUsernameChange}
                    className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded
                     hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                >
                {t('profile.modifyUsernameButton')}
                </button>

                {/* Modifier le mot de passe */}
                <label
                    htmlFor="modify-password"
                    className="block mt-6 mb-2 font-medium">{t('profile.modifyPasswordText')}</label>
                <input
                    id="modify-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded mb-4"
                />
                <button
                    onClick={handlePasswordChange}
                    className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded
                     hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                >
                {t('profile.modifyPasswordButton')}
                </button>

                {/* Supprimer le compte */}
                <div className="flex justify-end mt-8">
                    <button
                        onClick={handleDeleteUser}
                        className="bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded
                         hover:bg-red-700 dark:hover:bg-red-600 transition"
                    >
                    {t('profile.deleteAccount')}
                    </button>
                </div>
            </div>
            )}

            {/* Logique d'affichage des autres onglets */}

            {activeTab === "favorites" && <Favorites geoData={geoData} />}

            {activeTab === "settings" && <Settings />}

            {activeTab === "users" && role === "admin" && <Users />}

        </div>
    </div>
  );
};

export default ProfilePage;