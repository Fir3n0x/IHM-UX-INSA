import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGeolocation } from './hooks/useGeolocation';
import { RecorderProvider } from './context/RecorderContext';
import Home from './pages/Home';
import Map from './pages/Map';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Logout from './pages/Logout';
import PrivateRoute from './PrivateRoute';
import Layout from './components/Layout';
import './App.css';

function App() {
  const [geoData, setGeoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const { position: userPosition } = useGeolocation();

  // Charger GeoJSON
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch("../data/equipements_sportifs_proximite_rennes.geojson")
      .then((res) => {
        if (!res.ok) {
          throw new Error(t('map.errorNetwork'));
        }
        return res.json();
      })
      .then((data) => {
        setGeoData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(t('map.errorJson'), err);
        setError(t('map.errorJson'));
        setIsLoading(false);
      });
  }, [t]);

  return (
    <Router>
      <RecorderProvider>
        <div className="w-full bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Layout><Home geoData={geoData} userPosition={userPosition} /></Layout>} />
            <Route path="/map" element={<Layout><Map geoData={geoData} isLoading={isLoading} error={error} /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/profile" element={<PrivateRoute><Layout><Profile geoData={geoData} /></Layout></PrivateRoute>} />
            <Route path="/favorites" element={<PrivateRoute><Layout><Profile defaultTab="favorites" geoData={geoData} /></Layout></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Layout><Profile defaultTab="settings" geoData={geoData} /></Layout></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><Layout><Profile defaultTab="users" geoData={geoData} /></Layout></PrivateRoute>} />
            <Route path="/register" element={<Layout><Register /></Layout>} />
            <Route path="/logout" element={<Layout><Logout /></Layout>} />
            <Route path="*" element={<Layout><div className="text-zinc-900 p-6 dark:text-zinc-100">Page non trouvée</div></Layout>} />
          </Routes>
        </div>
      </RecorderProvider>
    </Router>
  );
}

export default App;
