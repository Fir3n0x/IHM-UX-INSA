import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getActivityIcon, getActivityColor } from '../../constants/activities';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Props {
  equipments: any[];
}

const EquipmentCarousel: React.FC<Props> = ({ equipments }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleClick = (place: any) => {
    const objectId = place.properties.objectid;
    if (objectId) {
      navigate(`/map?id=${objectId}`);
    }
  };

  // Vérifier la position du scroll
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Écouter le scroll et vérifier au chargement
  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      container?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [equipments]);

  // Fonction pour scroller à gauche
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -350,
        behavior: 'smooth'
      });
    }
  };

  // Fonction pour scroller à droite
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 350,
        behavior: 'smooth'
      });
    }
  };
      
  return (
    <div className="bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 text-center">
          {t('home.nearbyEquipments')}
        </h2>
        
        {/* Container avec flèches */}
        <div className="relative">
          {/* Flèche gauche - disparaît si on ne peut pas scroller à gauche */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              aria-label={t('carousel.scrollLeft', 'Défiler vers la gauche')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 
              bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white
              rounded-full p-3 shadow-lg hover:bg-zinc-100 dark:hover:bg-zinc-600
              transition-all duration-300 hover:scale-108 opacity-99"
            >
              <FaChevronLeft className="text-xl" />
            </button>
          )}

          {/* Flèche droite - disparaît si on ne peut pas scroller à droite */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              aria-label={t('carousel.scrollRight', 'Défiler vers la droite')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10
              bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white
              rounded-full p-3 shadow-lg hover:bg-zinc-100 dark:hover:bg-zinc-600
              transition-all duration-300 hover:scale-108 opacity-99"
            >
              <FaChevronRight className="text-xl" />
            </button>
          )}

          {/* Liste scrollable sans scrollbar visible */}
          <div role="group" aria-label={t('home.carouselLabel')} className="w-full">
            <ul 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto px-2 py-4 items-stretch
              scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {equipments.map((place, index) => {
                const iconColorClass = getActivityColor(place.properties.pratiques || '');

                return (
                  <li key={index} className="min-w-[310px]">
                    <button
                      type="button"
                      onClick={() => handleClick(place)}
                      className="w-full h-full bg-zinc-50 dark:bg-zinc-800 rounded-xl shadow-md
                       p-6 text-left hover:scale-105 hover:shadow-xl transition-all duration-300"
                    >
                      <div className={`text-3xl mb-2 ${iconColorClass} h-10 flex items-center`}>
                        {getActivityIcon(place.properties.pratiques || '')}
                      </div>

                      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 min-h-[3.5rem]">
                        {place.properties.nom_eqt}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-300 min-h-[2.5rem]">
                        {place.properties.pratiques
                          ? place.properties.pratiques
                              .split('/') 
                              .map((p: string) => t(`home.activities.${p.trim()}`)) 
                              .join(' / ') 
                          : t('home.unknownType', 'Type inconnu')}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCarousel;