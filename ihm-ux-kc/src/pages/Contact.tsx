import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

const Contact: React.FC = () => {
  const { t } = useTranslation();

  // États pour les champs du formulaire
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // État pour le message de succès
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    
    console.log("Formulaire soumis :", { firstName, lastName, email, message });
    
    // Afficher le message de succès
    setIsSent(true);
    
    // Réinitialiser les champs
    setFirstName("");
    setLastName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 px-8 py-12">
      <h2 className="text-zinc-900 dark:text-zinc-100 text-3xl lg:text-5xl text-center
      font-extrabold mb-12">{t('contact.contactTitle')}</h2>

      {/* Formulaire centré */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-800 shadow-md rounded-xl p-10">

        {isSent ? (
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              {t('contact.contactSuccessTitle')}
            </h3>
            <p className="text-zinc-900 dark:text-zinc-100 mb-6">
              {t('contact.contactSuccessDescription')}
            </p>
            <button
              onClick={() => setIsSent(false)} // Permet de soumettre un autre message
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700
               dark:bg-blue-500 dark:hover:bg-blue-600 transition"
            >
              {t('contact.contactSuccessButton')}
            </button>
          </div>
        ) : (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="contact-first-name"
              className="block text-zinc-900 dark:text-zinc-100 font-medium mb-1">{t('contact.contactFirstNameText')}
            </label>
            <input
              id="contact-first-name"
              type="text"
              placeholder={t('contact.contactFirstNameInput')}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full text-zinc-600 dark:text-zinc-200 border border-zinc-300
               dark:border-zinc-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label
              htmlFor="contact-last-name"
              className="block text-zinc-900 dark:text-zinc-100 font-medium mb-1">{t('contact.contactLastNameText')}
            </label>
            <input
              id="contact-last-name"
              type="text"
              placeholder={t('contact.contactLastNameInput')}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full border text-zinc-600 dark:text-zinc-200 border-zinc-300
               dark:border-zinc-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label
              htmlFor="contact-mail"
              className="block text-zinc-900 dark:text-zinc-100 font-medium mb-1">{t('contact.contactMailText')}
            </label>
            <input
              id="contact-mail"
              type="email"
              placeholder={t('contact.contactMailInput')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border text-zinc-600 dark:text-zinc-200 border-zinc-300
               dark:border-zinc-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="block text-zinc-900 dark:text-zinc-100 font-medium mb-1">{t('contact.contactMessageText')}
            </label>
            <textarea
              id="contact-message"
              placeholder={t('contact.contactMessageInput')}
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full border text-zinc-600 dark:text-zinc-200 border-zinc-300
               dark:border-zinc-400 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white w-full px-6 py-2 rounded-lg hover:bg-blue-700
               dark:bg-blue-500 dark:hover:bg-blue-600 transition"
            >
            {t('contact.contactSendButton')}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}

export default Contact;
