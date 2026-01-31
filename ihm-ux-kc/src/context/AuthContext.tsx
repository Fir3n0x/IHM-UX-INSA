import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
    id: string;
    username: string;
    password: string;
    role: string; // "user" ou "admin"
    favorites: string[];
};

type AuthContextType = {
    isAuthenticated: boolean;
    username: string | null;
    userId: string | null;
    role: "user" | "admin";
    favorites: string[];
    login: (username: string, password: string) => boolean;
    logout: () => void;
    register: (username: string, password: string) => boolean;
    updateUsername: (newUsername: string) => void;
    updatePassword: (newPassword: string) => void;
    deleteUser: () => void;
    changeUserRole: (id: string, newRole: "user" | "admin") => void;
    removeUser: (id: string) => void;
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [role, setRole] = useState<"user" | "admin">("user");
    const generateId = () => Date.now().toString();
    const [favorites, setFavorites] = useState<string[]>([]);

    // Fonction utilitaire pour récupérer les utilisateurs
    const getUsersFromStorage = (): User[] => {
        return JSON.parse(localStorage.getItem("users") || "[]") as User[];
    };

    // Fonction utilitaire pour sauvegarder les utilisateurs
    const saveUsersToStorage = (users: User[]) => {
        localStorage.setItem("users", JSON.stringify(users));
    };

    // Charger les utilisateurs depuis le localStorage du navigateur
    useEffect(() => {
        const storedUsers = localStorage.getItem("users");
        if (!storedUsers) {
            // Initialiser avec des utilisateurs factices si aucun utilisateur n'est stocké
            const initialUsers = [
                { id:"124885", username: "alice", password: "1234", role: "user", favorites: [] },
                { id:"785470820", username: "bob", password: "abcd", role: "user", favorites: [] },
                { id:"67890", username: "admin", password: "pass", role: "admin", favorites: [] },
            ];
            saveUsersToStorage(initialUsers);
        }

        const storedAuth = localStorage.getItem("isAuthenticated");
        const storedUsername = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");
        const storedUserId = localStorage.getItem("userId");

        if (storedAuth === "true" && storedUsername) {
            setIsAuthenticated(true);
            setUsername(storedUsername);
            if (storedRole === "admin" || storedRole === "user") {
                setRole(storedRole);
            }
            if (storedUserId) {
                setUserId(storedUserId);
            }
            // Charger les favoris de l'utilisateur
            const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
            const currentUser = allUsers.find((u: User) => u.id === storedUserId);
            setFavorites(currentUser?.favorites || []);
        }
    }, []);

    // Persistance de l'état d'authentification avec localStorage
    useEffect(() => {
        localStorage.setItem("isAuthenticated", isAuthenticated.toString());
        if (username) {
            localStorage.setItem("username", username);
            localStorage.setItem("role", role);
            localStorage.setItem("userId", userId || "");
            localStorage.setItem("favorites", JSON.stringify(favorites));
        } else {
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");
            localStorage.removeItem("favorites")
        }
    }, [isAuthenticated, username, role]);

    // Mettre à jour les favoris dans le localStorage lorsque la liste des favoris change
    useEffect(() => {
        if (!userId) return;
        const currentUsers = getUsersFromStorage();
        const updatedUsers = currentUsers.map(u =>
            u.id === userId ? { ...u, favorites } : u
        );
        saveUsersToStorage(updatedUsers);
    }, [favorites, userId]);

    // Fonctions d'authentification
    const login = (username: string, password: string) => {
        const storedUsers = getUsersFromStorage();
        const user = storedUsers.find(
            (u) => u.username === username && u.password === password
        );
        if (user) {
            setIsAuthenticated(true);
            setUsername(user.username);
            setRole(user.role as "user" | "admin");
            setUserId(user.id);
            setFavorites(user.favorites);
            localStorage.setItem("userId", user.id);
            localStorage.setItem("role", user.role);
            localStorage.setItem("favorites", JSON.stringify(user.favorites));
            return true;
        }
        return false;
    };

    // Déconnexion
    const logout = () => {
        setIsAuthenticated(false);
        setUsername(null);
        setUserId(null);
        setRole("user");
        setFavorites([]);

        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("favorites");
    };

    // Mise à jour du nom d'utilisateur
    const updateUsername = (newName: string) => {
        const users = getUsersFromStorage();
        const updatedUsers = users.map((u: User) =>
            u.id === userId ? { ...u, username: newName } : u
        );
        saveUsersToStorage(updatedUsers);
        setUsername(newName);
        localStorage.setItem("username", newName);
    };

    // Mise à jour du mot de passe
    const updatePassword = (newPassword: string) => {
        const users = getUsersFromStorage();
        const updatedUsers = users.map((u: User) =>
            u.id === userId ? { ...u, password: newPassword } : u
        );
        saveUsersToStorage(updatedUsers);
    };

    // Fonction d'inscription
    const register = (username: string, password: string) => {
        const currentUsers = getUsersFromStorage();
        const exists = currentUsers.some((u: User) => u.username === username);
        if (exists) return false;

        const newUser: User = {
            id: generateId(),
            username,
            password,
            role: "user",
            favorites: []
        }

        const newUsers = [...currentUsers, newUser];
        saveUsersToStorage(newUsers);
        return true;
    };

    // Suppression du compte utilisateur
    const deleteUser = () => {
        const users = getUsersFromStorage();
        const updatedUsers = users.filter((u: User) => u.id !== userId);
        saveUsersToStorage(updatedUsers);
        logout(); // déconnecte l'utilisateur
    };

    // Changement du rôle d'un utilisateur (admin uniquement)
    const changeUserRole = (id: string, newRole: "user" | "admin") => {
        const currentUsers = JSON.parse(localStorage.getItem("users") || "[]") as User[];
        const updatedUsers = currentUsers.map((u) =>
            u.id === id ? { ...u, role: newRole } : u
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));
    };

    // Supprimer un utilisateur (admin uniquement)
    const removeUser = (id: string) => {
        const currentUsers = JSON.parse(localStorage.getItem("users") || "[]") as User[];
        const updatedUsers = currentUsers.filter((u) => u.id !== id);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
    };

    // Ajouter en favoris
    const toggleFavorite = (id: string) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    // Check si un équipement est déjà en favoris
    const isFavorite = (id: string) => favorites.includes(id);

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated,
            username,
            userId,
            role,
            favorites,
            login,
            logout,
            register,
            updateUsername,
            updatePassword,
            deleteUser,
            changeUserRole,
            removeUser,
            toggleFavorite,
            isFavorite,
            }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};