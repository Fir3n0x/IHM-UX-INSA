import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import RecorderWidget from './RecorderWidget';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const showRecorder = true; // Afficher ou non le RecorderWidget
  
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="flex-grow w-full bg-white">{children}</main>
      {location.pathname !== '/map' && <Footer />}
      {showRecorder && <RecorderWidget />}
    </div>
  );
};

export default Layout;
