import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EquipmentList from "../components/map/EquipmentList";
import MapView from "../components/map/MapView";
import { useFilteredData } from "../hooks/useFilteredData";
import { useGeolocation } from "../hooks/useGeolocation";

const DEFAULT_POSITION: [number, number] = [48.11479451985564, -1.6809896988788995];

interface MapPageProps {
  geoData: any;
  isLoading: boolean;
  error: string | null;
}

const MapPage: React.FC<MapPageProps> = ({ geoData, isLoading, error }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedIdFromUrl = params.get("id");
  const navigate = useNavigate();

  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectionKey, setSelectionKey] = useState<number>(0);

  const { t } = useTranslation();
  const { position: userPosition } = useGeolocation();

  // Obtenir position depuis Home page
  useEffect(() => {
    if (geoData && selectedIdFromUrl) {
      const match = geoData.features.find(
        (f: any) => f.properties.objectid == selectedIdFromUrl
      );
      if (match) {
        setSelectedFeature(match);

        let lat: number, lng: number;
        if (match.geometry.type === "Point") {
            [lng, lat] = match.geometry.coordinates;
        } else if (match.geometry.type === "MultiPoint") {
            [lng, lat] = match.geometry.coordinates[0];
        } else {
            console.warn("Type de géométrie non pris en charge:", match.geometry.type);
            return;
        }
        setSelectedPosition([lat, lng]);
        navigate('/map', { replace: true });
      }
    }
  }, [geoData, selectedIdFromUrl, navigate]);

  const filteredGeoData = useFilteredData(
    geoData,
    selectedSports,
    selectedAccessibility,
    showFavorites
  );

  // État de chargement
  if (isLoading) {
    return (
      <div className="flex w-full h-screen p-6 gap-6 bg-white dark:bg-zinc-900 
                      items-center justify-center">
        <p className="text-xl text-zinc-900 dark:text-zinc-100">
          {t('map.loadingData')}
        </p>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="flex w-full h-screen p-6 gap-6 bg-white dark:bg-zinc-900 
                      items-center justify-center">
        <p className="text-xl text-red-600 dark:text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-64px)] p-2 lg:p-4
    gap-4 bg-white dark:bg-zinc-900">
      {/* Liste des équipements */}
      <EquipmentList
        geoData={filteredGeoData}
        userPosition={userPosition}
        onSelect={(pos, feature) => {
          setSelectedPosition(pos)
          setSelectedFeature(feature);
          setSelectionKey(prevKey => prevKey + 1);
        }}
        selectedSports={selectedSports}
        setSelectedSports={setSelectedSports}
        selectedAccessibility={selectedAccessibility}
        setSelectedAccessibility={setSelectedAccessibility}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
      />

      {/* Carte */}
      <MapView
        geoData={filteredGeoData}
        userPosition={userPosition}
        selectedPosition={selectedPosition}
        selectedFeature={selectedFeature}
        selectionKey={selectionKey}
        defaultPosition={DEFAULT_POSITION}
      />
    </div>
  );
};

export default MapPage;
