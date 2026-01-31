import React, { useEffect, useState } from 'react';
import { getSortedFeatures } from '../utils/distance';
import HeroSection from '../components/home/HeroSection';
import EquipmentCarousel from '../components/home/EquipmentCarousel';
import HowItWorks from '../components/home/HowItWorks';

interface Feature {
  selectedColor: any;
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    objectid: string;
    nom_eqt: string;
    equip_type?: string;
    pratiques?: string;
  };
}

interface Props {
  geoData: {
    features: Feature[];
  };
  userPosition: [number, number] | null;
}

const Home: React.FC<Props> = ({ geoData, userPosition }) => {
  const [equipments, setEquipments] = useState<Feature[]>([]);

  useEffect(() => {
    if (geoData?.features?.length) {
      let selected;
      if (userPosition) {
        const sorted = getSortedFeatures(geoData, userPosition);
        selected = sorted.slice(0, 20);
      } else {
        const shuffled = [...geoData.features].sort(() => 0.5 - Math.random());
        selected = shuffled.slice(0, 20);
      }
      setEquipments(selected);
    }
  }, [geoData, userPosition]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 overflow-x-hidden">
      <HeroSection />
      <EquipmentCarousel equipments={equipments} />
      <HowItWorks />
    </div>
  );
};

export default Home;
