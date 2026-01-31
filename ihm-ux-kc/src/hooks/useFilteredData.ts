import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const matchesFilters = (
    feature: any,
    selectedSports: string[],
    selectedAccessibility: string[],
    showFavorites: boolean,
    isFavorite: (id: string) => boolean
) => {
    const pratiques = (feature.properties.pratiques || "").toLowerCase();
    const acces = (feature.properties.crit_acces || "").toLowerCase();
    const horaires = (feature.properties.horaires || "").toLowerCase();

    const matchesSport =
      selectedSports.length === 0 ||
      selectedSports.some((s) => pratiques.includes(s.toLowerCase()));

    const matchesAccess =
      selectedAccessibility.length === 0 ||
      selectedAccessibility.some((a) => {
        const value = a.toLowerCase();
        if (value === "24h/24") return horaires.includes("24h/24");
        if (value === "accès libre") return acces.includes("libre");
        if (value === "ouvert actuellement") {
          const regexHasDigit = /\d/;
          if (!regexHasDigit.test(horaires)) return false;

            const now = new Date();
            const currentHour = now.getHours();
            const currentDay = now.getDay();

            // Cas spécial : 24h/24
            if (/24\s*h\s*\/\s*24/.test(horaires)) {
              return true;
            }

            const joursMap: Record<string, number> = {
              'lundi': 1,
              'mardi': 2,
              'mercredi': 3,
              'jeudi': 4,
              'vendredi': 5,
              'samedi': 6,
              'dimanche': 0,
            };

            // Fonction utilitaire : vérifie si le jour courant correspond à la plage mentionnée
            const isCurrentDayIncluded = (texte: string): boolean => {
              texte = texte.toLowerCase();

              // Exemple : "lundi au samedi"
              const rangeMatch = texte.match(/(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s*au\s*(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)/);
              if (rangeMatch) {
                const start = joursMap[rangeMatch[1]];
                const end = joursMap[rangeMatch[2]];
                if (start <= end) {
                  return currentDay >= start && currentDay <= end;
                } else {
                  return currentDay >= start || currentDay <= end;
                }
              }

              // Exemple : "dimanche"
              const singleMatch = texte.match(/(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)/);
              if (singleMatch) {
                return currentDay === joursMap[singleMatch[1]];
              }

              // Pas de jour mentionné --> on considère que c’est tous les jours
              return true;
            };

            // Si le texte des horaires contient un jour et qu’on n’est pas dedans --> fermé
            if (!isCurrentDayIncluded(horaires)) {
              return false;
            }

            // Exemples : "8h-22h", "10:00 - 19:30", "14h à 18h"
            const regexHours = /(\d{1,2})[:h]?(\d{0,2})?\s*[-à]\s*(\d{1,2})[:h]?(\d{0,2})?/gi;
            const matches = [...horaires.matchAll(regexHours)];

            if (matches.length === 0) return false;

            for (const match of matches) {
              const openHour = parseInt(match[1], 10);
              const closeHour = parseInt(match[3], 10);

              if (currentHour >= openHour && currentHour < closeHour) {
                return true;
              }
            }
            return false;
        }
        return false;
      });

    const matchesFavorite =
      !showFavorites || (isFavorite(feature.properties.objectid.toString()));

    return matchesSport && matchesAccess && matchesFavorite;
};

export const useFilteredData = (
    geoData: any,
    selectedSports: string[],
    selectedAccessibility: string[],
    showFavorites: boolean
) => {
    const { favorites, isFavorite } = useAuth();
    const filteredGeoData = useMemo(() => {
        if (!geoData) return null;

        const filteredFeatures = geoData.features.filter((feature: any) =>
            matchesFilters(
                feature,
                selectedSports,
                selectedAccessibility,
                showFavorites,
                isFavorite
            )
        );
        return { ...geoData, features: filteredFeatures };
    }, [
        geoData,
        selectedSports,
        selectedAccessibility,
        showFavorites,
        favorites,
        isFavorite
    ]);
    
    return filteredGeoData;
};

        
