import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Content } from './pages/Content';
import { Activities } from './pages/Activities';
import { Resources } from './pages/Resources';
import { Admin } from './pages/Admin';
import { UploadContent } from './pages/UploadContent';
import Analytics from './pages/Analytics';
import PersonalizedRecommendations from './components/PersonalizedRecommendations';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/content" element={<Content />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/upload" element={<UploadContent />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/recommendations" element={<PersonalizedRecommendations userId="current" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;