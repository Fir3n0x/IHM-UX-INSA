import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from "react-router-dom";
import logo_light from "../assets/logo_light.png";
import logo_dark from "../assets/logo_dark.png";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaUser, FaCog, FaSignOutAlt, FaHeart, FaBars, FaTimes } from "react-icons/fa";
import frFlag from "../assets/frFlag.png";
import enFlag from "../assets/enFlag.png";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { isAuthenticated, username, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Gestion thème clair/sombre
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => {
    localStorage.setItem('theme', prev ? 'light' : 'dark');
    return !prev;
  });

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    // Fermer le menu mobile si on clique en dehors
    useEffect(() => {
      const handleClickOutsideMobile = (event: MouseEvent) => {
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
          // Vérifier aussi que ce n'est pas le bouton burger qui est cliqué
          const target = event.target as HTMLElement;
          if (!target.closest('[aria-label*="Menu"]')) {
            setIsMobileMenuOpen(false);
          }
        }
      };

      if (isMobileMenuOpen) {
        document.addEventListener("mousedown", handleClickOutsideMobile);
      }
      
      return () => document.removeEventListener("mousedown", handleClickOutsideMobile);
    }, [isMobileMenuOpen]);

  const toggleLanguage = () => i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');

  const getNavButtonClass = ({ isActive }: { isActive: boolean }) => {
      const baseClasses = "w-full lg:w-[110px] text-center transition-colors duration-200 rounded-lg py-2";
      if (isActive) {
        return `${baseClasses} bg-zinc-700 text-white dark:bg-zinc-300 dark:text-zinc-900 font-semibold`;
      } else {
        return `${baseClasses} text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-800`;
      }
  };

  return (
    <header className="sticky top-0 z-50 h-16 bg-zinc-200/80 dark:bg-black/80 backdrop-blur-sm 
    border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between 
    shadow-lg transition-all duration-300">
      <div className="flex items-center gap-6">
        <img
          onClick={() => navigate('/')}
          src={isDark ? logo_dark : logo_light}
          alt="Logo Rennes Loisirs"
          className="h-12 w-auto transition-transform duration-300 hover:scale-110 hover:cursor-pointer"
        />
        <nav className="hidden lg:flex gap-6">
          <NavLink to="/" className={getNavButtonClass}>{t('header.home')}</NavLink>
          <NavLink to="/map" className={getNavButtonClass}>{t('header.map')}</NavLink>
          <NavLink to="/contact" className={getNavButtonClass}>{t('header.contact')}</NavLink>
          <NavLink to="/about" className={getNavButtonClass}>{t('header.about')}</NavLink>
        </nav>
      </div>

      <div className="hidden lg:flex items-center gap-4">
        {/* Toggle Langue */}
        <div className="flex items-center">
          <label
            title={t('header.toggleLanguage')}
            className="relative inline-flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              checked={i18n.language === "en"}
              onChange={toggleLanguage}
              className="sr-only peer"
              aria-label={t('header.toggleLanguage')}
            />
            <div className="w-14 h-8 bg-zinc-300 dark:bg-zinc-700 rounded-full 
            peer-focus:ring-2 peer-focus:ring-blue-500 transition-colors duration-300"></div>
            <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-all 
            duration-300 peer-checked:translate-x-6 flex items-center justify-center">
              <img
                src={i18n.language === "fr" ? frFlag : enFlag}
                alt={i18n.language === "fr" ? "Français" : "English"}
                className="h-4 w-4"
              />
            </div>
          </label>
        </div>

        {/* Toggle Dark/Light */}
        <div className="flex items-center ml-4">
          <label
            title={t('header.toggleTheme')}
            className="relative inline-flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              checked={isDark}
              onChange={toggleTheme}
              className="sr-only peer"
              aria-label={t('header.toggleTheme')}
            />
            <div className="w-14 h-8 bg-zinc-300 dark:bg-zinc-700 rounded-full 
            peer-focus:ring-2 peer-focus:ring-blue-500 transition-colors duration-300"></div>
            <div className="absolute left-1 top-1 w-6 h-6 bg-yellow-100 dark:bg-zinc-100 rounded-full 
            transition-all duration-300 peer-checked:translate-x-6 flex items-center justify-center">
              {isDark ? '🌙' : '☀️'}
            </div>
          </label>
        </div>

        {/* Profil + menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => {
              if (!isAuthenticated) navigate('/login');
              else setMenuOpen(!menuOpen);
            }}
            className="flex items-center justify-center w-[163px] gap-2 transition"
          >
            <FaUserCircle className="text-3xl" />
            <span className="text-sm">{isAuthenticated ? username : t('header.login')}</span>
          </button>
          {menuOpen && isAuthenticated && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 text-zinc-900
            dark:text-zinc-100 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 z-[9999]">
              <button
                className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-zinc-200
                dark:hover:bg-zinc-700 transition"
                onClick={() => navigate('/profile')}
              >
                <FaUser className="text-zinc-900 dark:text-zinc-100" /> {t('header.profile')}
              </button>
              <button
                className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                onClick={() => navigate('/favorites')}
              >
                <FaHeart className="text-zinc-900 dark:text-zinc-100" /> {t('header.favorites')}
              </button>
              <button
                className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                onClick={() => navigate('/settings')}
              >
                <FaCog className="text-zinc-900 dark:text-zinc-100" /> {t('header.settings')}
              </button>
              <button
                className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                onClick={() => { logout(); navigate('/logout'); }}
              >
                <FaSignOutAlt className="text-zinc-900 dark:text-zinc-100" /> {t('header.logout')}
              </button>
            </div>
          )}
        </div>
      </div>

        {/* Bouton burger mobile */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
            className="text-zinc-900 dark:text-zinc-100 p-2"
          >
            {isMobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute top-16 left-0 w-full bg-zinc-100 dark:bg-black shadow-lg z-50 p-4 lg:hidden"
        >
          <nav className="flex flex-col gap-4 mb-4">
            <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={getNavButtonClass}>{t('header.home')}</NavLink>
            <NavLink to="/map" onClick={() => setIsMobileMenuOpen(false)} className={getNavButtonClass}>{t('header.map')}</NavLink>
            <NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={getNavButtonClass}>{t('header.contact')}</NavLink>
            <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)} className={getNavButtonClass}>{t('header.about')}</NavLink>
          </nav>
          
          <hr className="border-zinc-300 dark:border-zinc-700 my-4" />

          {/* Boutons d'action (Profil/Login) */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => {
                if (!isAuthenticated) navigate('/login');
                else navigate('/profile');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center w-full gap-2 transition text-zinc-900 dark:text-zinc-100"
            >
              <FaUserCircle className="text-3xl" />
              <span className="text-sm">{isAuthenticated ? username : t('header.login')}</span>
            </button>
          </div>

          {/* Toggles dans le menu mobile */}
          <div className="flex items-center justify-around">
            <div className="flex items-center">
              <label
                title={t('header.toggleLanguage')}
                className="relative inline-flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={i18n.language === "en"}
                  onChange={toggleLanguage}
                  className="sr-only peer"
                  aria-label={t('header.toggleLanguage')}
                />
                <div className="w-14 h-8 bg-zinc-300 dark:bg-zinc-700 rounded-full 
                peer-focus:ring-2 peer-focus:ring-blue-500 transition-colors duration-300"></div>
                <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-all 
                duration-300 peer-checked:translate-x-6 flex items-center justify-center">
                  <img
                    src={i18n.language === "fr" ? frFlag : enFlag}
                    alt={i18n.language === "fr" ? "Français" : "English"}
                    className="h-4 w-4"
                  />
                </div>
              </label>
            </div>

            <div className="flex items-center">
              <label
                title={t('header.toggleTheme')}
                className="relative inline-flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isDark}
                  onChange={toggleTheme}
                  className="sr-only peer"
                  aria-label={t('header.toggleTheme')}
                />
                <div className="w-14 h-8 bg-zinc-300 dark:bg-zinc-700 rounded-full 
                peer-focus:ring-2 peer-focus:ring-blue-500 transition-colors duration-300"></div>
                <div className="absolute left-1 top-1 w-6 h-6 bg-yellow-100 dark:bg-zinc-100 rounded-full 
                transition-all duration-300 peer-checked:translate-x-6 flex items-center justify-center">
                  {isDark ? '🌙' : '☀️'}
                </div>
              </label>
            </div>
          </div>
        </div>
        )}
    </header>
  );
};

export default Header;
