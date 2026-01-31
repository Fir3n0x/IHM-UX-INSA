import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

interface FavoritesProps {
    geoData: any;
}

const Favorites: React.FC<FavoritesProps> = ({ geoData }) => {
    const { t } = useTranslation();
    const { favorites } = useAuth();

    const favoriteFeatures = useMemo(() => {
        if (!geoData || !geoData.features) return [];
        return geoData.features.filter((feature: any) =>
            favorites.includes(feature.properties.objectid.toString())
        );
    }, [geoData, favorites]);

    return (
        <div className="text-zinc-900 dark:text-zinc-100">
            <h2 className="text-2xl font-bold mb-4">{t('favorites.titleFav')}</h2>
            {favoriteFeatures.length === 0 ? (
                <p>{t('favorites.noFavoriteFound')}</p>
            ) : (
                <div className="max-h-[500px] overflow-y-auto pr-2">
                    <ul className="space-y-4">
                        {favoriteFeatures.map((feature: any) => (
                            <li key={feature.properties.objectid} className="border p-4 rounded shadow">
                                <h3 className="text-lg font-semibold">{feature.properties.nom_eqt || "Nom inconnu"}</h3>
                                <p><strong>{t('favorites.typeLabel')}</strong> {feature.properties.equip_type || "Non spécifié"}</p>
                                <p><strong>{t('favorites.practiceLabel')}</strong> {feature.properties.pratiques || "Non spécifiée"}</p>
                                <p><strong>{t('favorites.accessLabel')}</strong> {feature.properties.crit_acces || "Non spécifiée"}</p>
                                <p><strong>{t('favorites.timeLabel')}</strong> {feature.properties.horaires || "Non spécifiée"}</p>
                                <p><strong>{t('favorites.descriptionLabel')}</strong> {feature.properties.description || "Non spécifiée"}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Favorites;