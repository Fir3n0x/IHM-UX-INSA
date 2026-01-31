import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaMapMarkedAlt, FaRunning, FaHeart } from 'react-icons/fa';

const HowItWorks: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: <FaSearch />,
      title: t('howItWorks.step1.title', 'Recherche'),
      description: t('howItWorks.step1.desc', 'Trouve un équipement sportif près de chez toi')
    },
    {
      icon: <FaMapMarkedAlt />,
      title: t('howItWorks.step2.title', 'Localise'),
      description: t('howItWorks.step2.desc', 'Visualise sa position sur la carte')
    },
    {
      icon: <FaRunning />,
      title: t('howItWorks.step3.title', 'Pratique'),
      description: t('howItWorks.step3.desc', 'Profite gratuitement de ton activité')
    },
    {
      icon: <FaHeart />,
      title: t('howItWorks.step4.title', 'Sauvegarde'),
      description: t('howItWorks.step4.desc', 'Ajoute tes équipements favoris')
    }
  ];

  return (
    <div className="bg-zinc-50 dark:bg-zinc-800 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-center text-zinc-900 dark:text-zinc-100 mb-12">
          {t('howItWorks.title', 'Comment ça marche ?')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full 
              bg-emerald-500 text-white text-3xl mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                {step.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;