import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { LuSlidersHorizontal } from "react-icons/lu";
import FiltersPopup from "./FiltersPopup";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { getSortedFeatures } from "../../utils/distance";

interface Props {
  geoData: any;
  userPosition: [number, number] | null;
  onSelect: (position: [number, number], feature: any) => void;
  selectedSports: string[];
  setSelectedSports: React.Dispatch<React.SetStateAction<string[]>>;
  selectedAccessibility: string[];
  setSelectedAccessibility: React.Dispatch<React.SetStateAction<string[]>>;
  showFavorites: boolean;
  setShowFavorites: React.Dispatch<React.SetStateAction<boolean>>;
}

const EquipmentList: React.FC<Props> = ({ geoData, userPosition, onSelect, 
  selectedSports, setSelectedSports, selectedAccessibility, setSelectedAccessibility,
  showFavorites, setShowFavorites }) => {

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toggleFavorite, isFavorite, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const sortedFeatures = getSortedFeatures(geoData, userPosition);

  // Filtrage par recherche textuelle
  const searchedFeatures = sortedFeatures.filter((feature: any) =>
      feature.properties.nom_eqt
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  return (
    <div className="w-full lg:w-1/3 h-1/2 lg:h-full bg-white dark:bg-zinc-800 shadow-md p-4 flex flex-col rounded-xl">
      {/* En-tête et boutons d'actions fixes */}
      <div className="sticky top-0 bg-white dark:bg-zinc-800 z-10 pb-2">
        {/* Titre */}
        <h2 className="text-zinc-900 dark:text-zinc-100 text-xl font-bold mb-2 flex justify-between items-center">
          <span>{t('equip-list.titleTabs')}</span>
          <span className="inline text-xs font-medium px-2 py-0.5 rounded-md">
            {searchedFeatures.length} {t('equip-list.equipmentsDisplayed')}
          </span>
        </h2>

        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700"></div>
        {/* Barre d'actions */}
        <div className="flex justify-start items-center gap-4">
          {/* Bouton filtres */}
          <button 
            className="min-w-32 flex text-sm items-center justify-center gap-1 px-3 py-1 bg-zinc-200/60 text-zinc-900 dark:bg-zinc-700/60
            dark:text-zinc-100 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-all duration-200"
            onClick={() => setShowFilters(true)}
          >
            <LuSlidersHorizontal />
            <span>{t('equip-list.filtersText')}</span>
          </button>
          {/* Bouton favoris */}
          <button 
            className={`min-w-32 flex text-sm items-center justify-center gap-1 px-3 py-1 rounded-lg transition-all duration-200
                bg-zinc-200/60 dark:bg-zinc-700/60 hover:bg-zinc-300 dark:hover:bg-zinc-600 
                ${showFavorites ? "text-red-600 dark:text-red-500" : "text-zinc-900 dark:text-zinc-100"}`}
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <FaHeart />
            <span>{t('equip-list.favoritesText')}</span>
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="mt-2">
          <input
            type="search"
            placeholder={t('equip-list.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1.5 border rounded-lg bg-white dark:bg-zinc-700
            border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100
            focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Liste filtrée */}
      <ul className="space-y-2 mt-2 overflow-y-scroll flex-1">
        {searchedFeatures.length > 0 ? (
          searchedFeatures.map((feature: any, idx: number) => {
            const {
              nom_eqt,
              equip_type,
              pratiques,
              horaires
            } = feature.properties;

            return (
              <li
                key={idx}
                className="relative rounded-xl border border-zinc-300 dark:border-zinc-400
                 hover:bg-zinc-100 hover:dark:bg-zinc-700"
              >
                <button
                  type="button"
                  className="w-full text-left p-3"
                  onClick={() => {
                    let lat: number, lng: number;
                    if (feature.geometry.type === "Point") {
                        [lng, lat] = feature.geometry.coordinates;
                    } else if (feature.geometry.type === "MultiPoint") {
                        // On prend le premier point du multipoint
                        [lng, lat] = feature.geometry.coordinates[0];
                    } else {
                        console.warn("Type de géométrie non pris en charge:", feature.geometry.type);
                        return;
                    }
                    onSelect([lat, lng], feature);
                  }}
                >
                  <p className="text-zinc-900 dark:text-zinc-100 font-semibold pr-8">{nom_eqt || t('equip-list.unknownEqt')}</p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-200 italic">{equip_type || t('equip-list.unknownType')}</p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-200">
                    <strong>{t('equip-list.practiceLabel')}</strong> {pratiques || "N/A"}
                  </p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-200">
                    <strong>{t('equip-list.timeLabel')}</strong> {horaires || "N/A"}
                  </p>
                </button>

                {/* Bouton pour ajouter aux favoris */}
                <button
                  className="absolute top-2 right-0 text-xl"
                  onClick={() => {
                    if (!isAuthenticated) {
                      alert("Veuillez vous connecter pour gérer vos favoris.");
                      return;
                    }
                    toggleFavorite(feature.properties.objectid.toString());
                  }}
                  aria-label={
                    isFavorite(feature.properties.objectid.toString())
                    ? t('equip-list.removeFavorite')
                    : t('equip-list.addFavorite')
                  }
                  title={
                    isFavorite(feature.properties.objectid.toString())
                    ? t('equip-list.removeFavorite')
                    : t('equip-list.addFavorite')
                  }
                >
                  {isFavorite(feature.properties.objectid.toString()) ? (
                    <FaHeart className="text-red-600 dark:text-red-500
                     hover:scale-110 transition-transform" />
                  ) : (
                    <FaRegHeart className="text-zinc-400 dark:text-zinc-300
                     hover:text-red-600 hover:dark:text-red-500 hover:scale-110 transition-transform" />
                  )}
                </button>
              </li>
            );
          })
        ) : (
          <p className="text-sm text-zinc-700 dark:text-zinc-200">
            {t('equip-list.equipNotFound')}
          </p>
        )}
      </ul>

      {/* Pop-up filtres */}
      {showFilters && (
      <FiltersPopup
        selectedSports={selectedSports}
        setSelectedSports={setSelectedSports}
        selectedAccessibility={selectedAccessibility}
        setSelectedAccessibility={setSelectedAccessibility}
        onClose={() => setShowFilters(false)}
      />
      )}
    </div>
  );
};

export default EquipmentList;
