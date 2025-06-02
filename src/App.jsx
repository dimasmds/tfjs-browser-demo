import { useState } from 'react';
import './App.css';
import DollDetector from './components/DollDetector';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <DollDetector onModelLoaded={() => setIsModelLoaded(true)} />
      </main>
      <Footer isModelLoaded={isModelLoaded} />
    </div>
  );
}

export default App;