import type { JSX } from 'react';

// Icônes pour le carrousel
import {
  FaFootballBall,
  FaBasketballBall,
  FaRunning,
  FaBiking,
  FaTableTennis,
  FaVolleyballBall,
  FaChess,
  FaHockeyPuck,
  FaSlackHash,
  FaWalking,
  FaDumbbell,
} from 'react-icons/fa';
import {
  IoIosFootball,
} from 'react-icons/io';
import {
  IoFitness,
} from 'react-icons/io5';
import {
  GiTennisRacket,
  GiBabyfootPlayers,
  GiBowlingPin,
} from 'react-icons/gi';
import {
  PiBoules,
} from 'react-icons/pi';
import {
  MdOutlineSkateboarding,
  MdLocalDrink,
} from 'react-icons/md';
import {
  TbPlayHandball,
} from 'react-icons/tb';
import {
  FaBaseballBatBall,
} from 'react-icons/fa6'

// Hashmap qui associe les types d'équipements aux icônes correspondantes
const activityIcons: Record<string, JSX.Element> = {
  'Football': <IoIosFootball />,
  'Tennis': <GiTennisRacket />,
  'Basketball': <FaBasketballBall />,
  'Fitness': <IoFitness />,
  'Tennis de table': <FaTableTennis />,
  'Street Workout': <FaDumbbell />,
  'Parcours de santé': <FaWalking />,
  'Rugby': <FaFootballBall />,
  'Pétanque': <PiBoules />,
  'Glisse urbaine': <MdOutlineSkateboarding  />,
  'Handball': <TbPlayHandball />,
  'Volley-ball': <FaVolleyballBall />,
  'Babyfoot': <GiBabyfootPlayers />,
  'Course à pied': <FaRunning />,
  'Cyclisme': <FaBiking />,
  'Échecs': <FaChess />,
  'Espace de rafraîchissement': <MdLocalDrink />,
  'Hockey sur gazon': <FaHockeyPuck />,
  'Molky': <GiBowlingPin />,
  'Slackline': <FaSlackHash />,
  'Bicross': <FaBiking />,
  'Baseball': <FaBaseballBatBall />,
};

const sportColors: Record<string, string> = {
  'Football': 'text-green-600 dark:text-green-400',
  'Tennis': 'text-lime-500 dark:text-lime-400',
  'Basketball': 'text-orange-600 dark:text-orange-400',
  'Fitness': 'text-blue-500 dark:text-blue-400',
  'Tennis de table': 'text-cyan-600 dark:text-cyan-400',
  'Street Workout': 'text-gray-700 dark:text-gray-400',
  'Parcours de santé': 'text-emerald-500 dark:text-emerald-400',
  'Rugby': 'text-amber-800 dark:text-amber-500',
  'Pétanque': 'text-yellow-600 dark:text-yellow-400',
  'Glisse urbaine': 'text-indigo-500 dark:text-indigo-400',
  'Handball': 'text-blue-700 dark:text-blue-500',
  'Volley-ball': 'text-teal-500 dark:text-teal-400',
  'Babyfoot': 'text-red-600 dark:text-red-400',
  'Course à pied': 'text-blue-600 dark:text-blue-400',
  'Cyclisme': 'text-yellow-500 dark:text-yellow-400',
  'Échecs': 'text-gray-800 dark:text-gray-300',
  'Espace de rafraîchissement': 'text-blue-400 dark:text-blue-300',
  'Hockey sur gazon': 'text-green-700 dark:text-green-500',
  'Molky': 'text-amber-700 dark:text-amber-500',
  'Slackline': 'text-purple-500 dark:text-purple-400',
  'Bicross': 'text-orange-500 dark:text-orange-400',
  'Baseball': 'text-red-700 dark:text-red-500',
};

// Helper function pour récupérer l'icône avec fallback
export const getActivityIcon = (activity: string): JSX.Element => {
  return activityIcons[activity] || <IoIosFootball />;
};

// Helper function pour récupérer la couleur avec fallback
export const getActivityColor = (activity: string): string => {
  return sportColors[activity] || 'text-gray-500 dark:text-gray-400';
};