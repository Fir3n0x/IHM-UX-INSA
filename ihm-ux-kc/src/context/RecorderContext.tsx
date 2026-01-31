import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export interface ClickPoint {
  x: number;
  y: number;
  path: string;
  timestamp: number;
}

interface RecorderContextType {
  isRecording: boolean;
  clicks: ClickPoint[];
  scenarioName: string;
  setScenarioName: (name: string) => void;
  startTime: number | null;
  endTime: number | null;
  startRecording: () => void;
  stopRecording: () => void;
  resetClicks: () => void;
  setImportedClicks: (clicks: ClickPoint[]) => void;
}

const RecorderContext = createContext<RecorderContextType | undefined>(undefined);

export const RecorderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [clicks, setClicks] = useState<ClickPoint[]>([]);
  const [scenarioName, setScenarioName] = useState("");

  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const location = useLocation();
  const locationRef = useRef(location.pathname);

  // Mettre à jour la ref quand la route change
  useEffect(() => {
    locationRef.current = location.pathname;
  }, [location]);

  // Logique d'enregistrement (déplacée du hook vers ici)
  useEffect(() => {
    if (!isRecording) return;

    const handleClick = (e: MouseEvent) => {
      // Ignorer les clics sur le widget
      if ((e.target as HTMLElement).closest('[data-ignore-clicks="true"]')) {
        return;
      }

      setClicks((prev) => [
        ...prev,
        {
          x: e.pageX,
          y: e.pageY,
          path: locationRef.current,
          timestamp: Date.now(),
        },
      ]);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isRecording]);

  const startRecording = () => { 
    setIsRecording(true);
    setStartTime(Date.now());
    setEndTime(null);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setEndTime(Date.now());
  };

  const resetClicks = () => {
    setClicks([]);
    setScenarioName("");
    setStartTime(null);
    setEndTime(null);
  };

  const setImportedClicks = (newClicks: ClickPoint[]) => setClicks(newClicks);

  return (
    <RecorderContext.Provider value={{ 
        isRecording, 
        clicks, 
        scenarioName,
        setScenarioName,
        startTime,
        endTime,
        startRecording, 
        stopRecording, 
        resetClicks,
        setImportedClicks
    }}>
      {children}
    </RecorderContext.Provider>
  );
};

export const useRecorder = () => {
  const context = useContext(RecorderContext);
  if (!context) throw new Error("useRecorder must be used within RecorderProvider");
  return context;
};