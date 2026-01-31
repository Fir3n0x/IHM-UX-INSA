import React from 'react';
import { FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-zinc-200/80 dark:bg-black/80 text-zinc-900 dark:text-zinc-100 border-t
    border-zinc-200 dark:border-zinc-800 px-6 py-4 flex flex-col lg:flex-row justify-between items-center">
      <p className="text-sm text-center lg:text-left">
        &copy; {t('footer.footTitle')}<br />
        {t('footer.footDescription')}
      </p>
      <div className="flex gap-4 mt-4 lg:mt-0">
        <a 
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('footer.instagramLabel')}
          title={t('footer.instagramLabel')}
        >
          <FaInstagram className="text-4xl text-pink-600 dark:text-pink-500 hover:text-pink-700 dark:hover:text-pink-600 transition" />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('footer.linkedinLabel')}
          title={t('footer.linkedinLabel')}
        >
          <FaLinkedin className="text-4xl text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-600 transition" />
        </a>
        <a
          href="mailto:contact@rennes-loisirs.fr"
          aria-label={t('footer.emailLabel')}
          title={t('footer.emailLabel')}
        >
          <FaEnvelope className="text-4xl text-teal-600 dark:text-teal-500 hover:text-teal-700 dark:hover:text-teal-600 transition" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;