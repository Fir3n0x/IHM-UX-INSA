import { useTranslation } from 'react-i18next';
import React from 'react';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 px-8 py-12">
      <h2 className="text-zinc-900 dark:text-zinc-100 text-3xl lg:text-5xl text-center
      font-extrabold mb-12">{t('about.aboutMainTitle')}</h2>

      {/* Bloc de contenu */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-800 shadow-md rounded-xl p-10
       text-zinc-900 dark:text-zinc-100 text-justify leading-relaxed space-y-6">
        <p>
          <span className="font-semibold text-lg">{t('about.aboutTitle')}</span><br />
            {t('about.aboutDescription')}
        </p>

        <p>
          <span className="font-semibold text-lg">{t('about.objectiveTitle')}</span><br />
            {t('about.objectiveDescription')}
        </p>

        <p>
          <span className="font-semibold text-lg">{t('about.typeTitle')}</span><br />
            {t('about.typeDescription')}
        </p>

        <p>
          <span className="font-semibold text-lg">{t('about.valueTitle')}</span><br />
            {t('about.valueDescription')}
        </p>

        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-700">
          <p className="text-center text-zinc-600 dark:text-zinc-400 italic">
            {t('about.footerMessageBegin')} <span className="font-medium">Corentin Mahieu</span> & <span className="font-medium">Kelian Ninet</span><br />
              ({t('about.footerMessageEnd')})
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;