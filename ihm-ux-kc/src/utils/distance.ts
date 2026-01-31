// Fonction pour calculer distance entre deux points (Haversine)
export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

  // On filtre pour garder uniquement les features valides (Point/MultiPoint avec coordonnées)
export const getSortedFeatures = (geoData: any, userPosition: [number, number] | null) => {
    const validFeatures = geoData?.features?.filter(
        (f: any) =>
            f.geometry &&
            (f.geometry.type === "Point" || f.geometry.type === "MultiPoint") &&
            Array.isArray(f.geometry.coordinates) &&
            f.geometry.coordinates.length > 0
    ) || [];

    // Tri des équipements si on connaît la position utilisateur
    const sortedFeatures = userPosition
        ? [...validFeatures].sort((a, b) => {
            // Fonction pour obtenir la distance minimale d’un feature (Point ou MultiPoint)
            const getMinDistance = (feature: any) => {
                const coords = feature.geometry.coordinates;

                // Si c’est un Point : [[lon, lat]]
                if (feature.geometry.type === "Point") {
                    const [lon, lat] = coords;
                    return getDistance(userPosition[0], userPosition[1], lat, lon);
                }

                // Si c’est un MultiPoint : [[lon1, lat1], [lon2, lat2], ...]
                if (feature.geometry.type === "MultiPoint") {
                    let minDist = Infinity;
                    for (const [lon, lat] of coords) {
                        const d = getDistance(userPosition[0], userPosition[1], lat, lon);
                        if (d < minDist) minDist = d;
                    }
                    return minDist;
                }
                // Autres types → on ignore
                return Infinity;
            };
            return getMinDistance(a) - getMinDistance(b);
        })
    : validFeatures;
return sortedFeatures;
};
