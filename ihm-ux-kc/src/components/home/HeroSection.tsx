import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaWalking } from 'react-icons/fa';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Image de fond pour la section Hero
  const backgroundImage = '/src/assets/banner.jpg';

  return (
    <div className="relative w-full h-[400px] lg:h-[500px] overflow-hidden">
      
      {/* Image de fond */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[0.6px] scale-105"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Overlay pour améliorer la lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/45 to-black/55 dark:from-black/50 dark:via-black/55 dark:to-black/65"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-6 text-center transform -translate-y-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6 animate-fade-in leading-tight">
          {t('home.welcomeTitle')}
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 mb-6 max-w-md md:max-w-2xl px-2">
          {t('home.welcomeDescription')}
        </p>

        {/* Statistiques */}
        <div className="flex gap-4 md:gap-6 mb-6 md:mb-8 flex-wrap justify-center">
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-white">500+</div>
            <div className="text-xs sm:text-sm text-white/80">{t('home.stats.equipments')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-white">20+</div>
            <div className="text-xs sm:text-sm text-white/80">{t('home.stats.activities')}</div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/map')}
          className="bg-blue-600/80 text-white px-8 lg:px-12 py-4
          rounded-full text-xl lg:text-2xl font-semibold shadow-2xl flex items-center justify-center gap-3
          transition-all duration-300 hover:scale-104 hover:bg-blue-700/90 group"
        >
          <FaWalking className="text-lg sm:text-xl md:text-2xl group-hover:animate-bounce" />
          <span className="whitespace-nowrap">{t('home.bannerButton')}</span>
        </button>
      </div>

      {/* Vague de transition */}
      <div className="absolute bottom-0 left-0 w-full -mb-1">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path 
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            className="fill-white dark:fill-zinc-900"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;