import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, useMap, GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import userIconUrl from "../../assets/user_position.png";
import iconUrl from "../../assets/default_marker.png";

// Modification de l'icône par défaut de Leaflet
const defaultIcon = L.icon({ 
    iconUrl, 
    iconSize: [28, 28], 
    iconAnchor: [14, 28],
    popupAnchor: [0.5, -18]
});
L.Marker.prototype.options.icon = defaultIcon;

// Icône personnalisée pour la position utilisateur
const userIcon = L.icon({ 
    iconUrl: userIconUrl, 
    iconSize: [30, 30], 
    iconAnchor: [15, 30],
    popupAnchor: [0.5, -22]
});

// Composant pour centrer la carte
const FlyToPosition = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 17);
  }, [map, position]);
  return null;
};

interface Props {
  geoData: any;
  userPosition: [number, number] | null;
  selectedPosition: [number, number] | null;
  selectedFeature: any;
  selectionKey: number;
  defaultPosition?: [number, number];
}

const MapView: React.FC<Props> = ({ geoData, userPosition, selectedPosition, selectedFeature, selectionKey, defaultPosition }) => { 
  // Référence GeoJSON pour manipulation future
  const geoJsonRef = useRef<L.GeoJSON<any>>(null);
  const { t } = useTranslation();

  // Mettre à jour les markers quand geoData change
  useEffect(() => {
    if (!geoJsonRef.current) return;
    
    // Vider la carte (pour appliquer les filtres)
    geoJsonRef.current.clearLayers();
    
    // Ajouter les nouvelles données (les données filtrées)
    if (geoData) {
      geoJsonRef.current.addData(geoData);
    }
  }, [geoData]);

  // Gérer l'ouverture de la popup
  useEffect(() => {
    if (!geoJsonRef.current || !selectedFeature) return;
    
    // Délai pour s'assurer que les layers sont créés
    setTimeout(() => {
      if (!geoJsonRef.current) return;
      
      geoJsonRef.current.eachLayer((layer: any) => {
        const feature = layer.feature;
        if (feature?.properties?.objectid == selectedFeature.properties.objectid) {
          layer.openPopup();
        }
      });
    }, 100);
  }, [selectedFeature, selectionKey]);

  return (
    <div className="w-full lg:w-2/3 h-1/2 lg:h-full rounded-xl overflow-hidden shadow-md z-49">
      <MapContainer
        center={defaultPosition}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Si une position est sélectionnée, on zoome dessus */}
        {selectedPosition && <FlyToPosition position={selectedPosition} />}

        {/* Si pas de sélection et si on a la position USER, on zoome dessus */}
        {!selectedPosition && userPosition && <FlyToPosition position={userPosition} />}
        
        {/* Marqueur pour la position utilisateur */}
        {userPosition && (
          <Marker
            position={userPosition}
            icon={userIcon}
            alt={t('mapview.selfPosition')}
          >
            <Popup>{t('mapview.selfPosition')}</Popup>
          </Marker>
        )}

        {/* Affichage des équipements depuis le GeoJSON */}
        {geoData && (
          <GeoJSON
            ref={geoJsonRef}
            data={geoData}
            onEachFeature={(feature, layer) => {
              if (feature.properties) {
                const {
                    nom_eqt,
                    equip_type, 
                    pratiques, 
                    crit_acces, 
                    horaires, 
                    description 
                } = feature.properties;

                const popupContent = `
                    <div>
                        <h3 style="font-size: 1.1em; font-weight: 600; margin:0 0 8px 0;">
                          ${nom_eqt || t('mapview.unknownName')}
                        </h3>
                        <p style="margin: 4px 0;">
                          <strong>${t('favorites.typeLabel')}</strong> ${equip_type || "N/A"}
                        </p>
                        <p style="margin: 4px 0;">
                          <strong>${t('favorites.practiceLabel')}</strong> ${pratiques || "N/A"}
                        </p>
                        <p style="margin: 4px 0;">
                          <strong>${t('favorites.accessLabel')}</strong> ${crit_acces || "N/A"}
                        </p>
                        <p style="margin: 4px 0;">
                          <strong>${t('favorites.timeLabel')}</strong> ${horaires || "N/A"}
                        </p>
                        <p style="margin: 4px 0;">
                          <strong>${t('favorites.descriptionLabel')}</strong> ${description || ""}
                        </p>
                    </div>
                `;
                layer.bindPopup(popupContent);
              }
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
