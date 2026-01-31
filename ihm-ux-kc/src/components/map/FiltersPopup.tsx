import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { IoClose } from 'react-icons/io5';

interface FiltersPopupProps {
    onClose: () => void;
    selectedSports: string[];
    setSelectedSports: React.Dispatch<React.SetStateAction<string[]>>;
    selectedAccessibility: string[];
    setSelectedAccessibility: React.Dispatch<React.SetStateAction<string[]>>;
}

const FiltersPopup: React.FC<FiltersPopupProps> = ({ 
    onClose,
    selectedSports,
    setSelectedSports,
    selectedAccessibility,
    setSelectedAccessibility
}) => {
    const allSports = [
        "Football",
        "Tennis",
        "Basketball",
        "Fitness",
        "Tennis de table",
        "Street Workout",
        "Parcours de santé",
        "Rugby",
        "Pétanque",
        "Glisse urbaine",
        "Handball",
        "Volley-ball",
        "Babyfoot",
        "Course à pied",
        "Cyclisme",
        "Échecs",
        "Espace de rafraîchissement",
        "Hockey sur gazon",
        "Molky",
        "Slackline",
        "Bicross",
        "Baseball"
    ];

    const accessibilityOptions = ["Ouvert actuellement", "24h/24", "Accès libre"];
    const [showAllSports, setShowAllSports] = useState(false);
    const { t } = useTranslation();
    const visibleSports = showAllSports ? allSports : allSports.slice(0, 8);

    // Référence pour le conteneur de la modale
    const modalRef = useRef<HTMLDivElement>(null);
    // Référence pour le bouton "Fermer"
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Fonction pour gérer la sélection d’un filtre (multi-sélection)
    const toggleSelection = (label: string, type: "sport" | "access") => {
        if (type === "sport") {
        setSelectedSports((prev) =>
            prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
        );
        } else {
        setSelectedAccessibility((prev) =>
            prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
        );
        }
    };

    // Réinitialiser tous les filtres
    const resetFilters = () => {
        setSelectedSports([]);
        setSelectedAccessibility([]);
    };

    // Gestion de la fermeture avec la touche Échap
    useEffect(() => {
      closeButtonRef.current?.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
          return;
        }
      
        if (event.key === 'Tab') {
          if (!modalRef.current) return;

          // Trouver tous les éléments focusables dans la modale
          const focusableElements = Array.from(
              modalRef.current.querySelectorAll(
                  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
              )
          ) as HTMLElement[];

          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey) {
              // Shift + Tab
              if (document.activeElement === firstElement) {
                  lastElement.focus();
                  event.preventDefault();
              }
          } else {
              // Tab
              if (document.activeElement === lastElement) {
                  firstElement.focus();
                  event.preventDefault();
              }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [onClose]);

    return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9990]"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white dark:bg-zinc-900 p-4 rounded-xl w-[640px] shadow-md relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Bouton fermer */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-2 right-2 text-zinc-900 dark:text-zinc-100
           hover:text-red-600 dark:hover:text-red-500"
          aria-label={t('filtersPopup.close')}
          title={t('filtersPopup.close')}
        >
          <IoClose size={24} />
        </button>

        <h3 className="text-lg text-center text-zinc-900 dark:text-zinc-100 font-semibold mb-2">{t('filtersPopup.title')}</h3>
        <hr className="my-2 border-t border-zinc-300 dark:border-zinc-400" />

        {/* Section équipements sportifs */}
        <h2 className="text-md text-zinc-900 dark:text-zinc-100 font-semibold mb-2">{t('filtersPopup.sportFilter')}</h2>
            <div className="flex flex-wrap gap-2 mb-2">
            {visibleSports.map((label) => (
              <button
              key={label}
              onClick={() => toggleSelection(label, "sport")}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  selectedSports.includes(label)
                  ? "bg-blue-300 text-white dark:bg-blue-400"
                  : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
              >
              {label}
              </button>
            ))}

            {/* Bouton pour afficher plus ou moins de sports */}
            <button
                onClick={() => setShowAllSports(!showAllSports)}
                className="px-3 py-1 text-sm text-blue-600 dark:text-blue-500 rounded-lg hover:underline"
            >
            {showAllSports ? t('filtersPopup.lessFilter') : t('filtersPopup.moreFilter')}
          </button>
        </div>

        <hr className="my-2 border-t border-zinc-300 dark:border-zinc-400" />
        <h2 className="text-md text-zinc-900 dark:text-zinc-100 font-semibold mb-2">{t('filtersPopup.accessTitle')}</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {accessibilityOptions.map((label) => (
            <button
              key={label}
              onClick={() => toggleSelection(label, "access")}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedAccessibility.includes(label)
                  ? "bg-blue-300 text-white dark:bg-blue-400"
                  : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Boutons d’action */}
        <div className="flex justify-between">
          <button
            onClick={resetFilters}
            className="px-3 py-2 bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100
               rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-all duration-200"
          >
            {t('filtersPopup.resetButton')}
          </button>
          <button
            onClick={() => {
              console.log("Filtres appliqués :", {
                sports: selectedSports,
                accessibilité: selectedAccessibility,
              });
              onClose();
            }}
            className="px-3 py-2 bg-blue-600 dark:bg-blue-500 text-white 
            rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200"
          >
            {t('filtersPopup.apply')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersPopup;
