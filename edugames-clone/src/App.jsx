import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Hero from './components/Hero';
import Subjects from './components/Subjects';
import GameTypes from './components/GameTypes';
import Features from './components/Features';
import OnlineSection from './components/OnlineSection';
import Teachers from './components/Teachers';
import HowItWorks from './components/HowItWorks';
import Metrics from './components/Metrics';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import Cta from './components/Cta';
import Footer from './components/Footer';
import MathSetupModal from './components/MathSetupModal';
import MathGameScreen from './components/MathGameScreen';
import OnlineGameScreen from './components/OnlineGameScreen';
import MemoryGameScreen from './components/MemoryGameScreen';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState('landing'); // 'landing', 'game', 'online', 'memory'
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [gameSettings, setGameSettings] = useState(null);
  const [gameType, setGameType] = useState(null); // 'math' or 'english'

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleOpenSetup = (type) => {
    setGameType(type);
    setIsSetupOpen(true);
  };

  const handleStartGame = (settings) => {
    setGameSettings({ ...settings, gameType });
    setIsSetupOpen(false);
    setView('game');
  };

  return (
    <div className="app-wrapper">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onSelectOnline={() => { setView('online'); closeSidebar(); }} 
        onSelectMemory={() => { setView('memory'); closeSidebar(); }} 
      />
      
      {isSidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1050,
          }}
        />
      )}

      <div className={`main-content ${view === 'landing' ? 'no-topbar' : ''}`}>
        <Topbar 
          onMenuClick={toggleSidebar} 
          title={
            view === 'online' ? "Online o'ynash" : 
            view === 'memory' ? "Xotira o'yini" : 
            view === 'game' ? "Arqon tortish" : 
            "Bosh sahifa"
          } 
        />
        <main className="container">
          {view === 'landing' ? (
            <div className="landing">
              <Hero />
              <Subjects 
                onSelectMath={() => handleOpenSetup('math')} 
                onSelectEnglish={() => handleOpenSetup('english')} 
                onSelectRussian={() => handleOpenSetup('russian')} 
                onSelectOnaTili={() => handleOpenSetup('mother')} 
                onSelectBiology={() => handleOpenSetup('biology')} 
                onSelectChemistry={() => handleOpenSetup('chemistry')} 
                onSelectPhysics={() => handleOpenSetup('physics')} 
                onSelectHistory={() => handleOpenSetup('history')} 
                onSelectGeography={() => handleOpenSetup('geography')} 
                onSelectInformatics={() => handleOpenSetup('informatics')} 
                onSelectLiterature={() => handleOpenSetup('literature')} 
                onSelectTurkish={() => handleOpenSetup('turkish')} 
              />
              <GameTypes 
                onSelectArqon={() => handleOpenSetup('math')} 
                onSelectOnline={() => setView('online')} 
                onSelectMemory={() => setView('memory')} 
              />
              <Features />
              <OnlineSection onSelectOnline={() => setView('online')} />
              <Teachers />
              <HowItWorks />
              <Metrics />
              <Testimonials />
              <Faq />
              <Cta />
              <Footer 
                onSelectOnline={() => setView('online')} 
                onSelectMemory={() => setView('memory')} 
              />
            </div>
          ) : view === 'online' ? (
            <OnlineGameScreen 
              onQuit={() => setView('landing')} 
            />
          ) : view === 'memory' ? (
            <MemoryGameScreen 
              onQuit={() => setView('landing')} 
            />
          ) : (
            <MathGameScreen 
              settings={gameSettings} 
              onQuit={() => setView('landing')} 
            />
          )}
        </main>
      </div>

      {isSetupOpen && (
        <MathSetupModal 
          onClose={() => setIsSetupOpen(false)} 
          onStartGame={handleStartGame} 
          gameType={gameType}
        />
      )}
    </div>
  );
}

export default App;
