import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { ContentPage } from '/src/pages/Content.tsx';
import { Activities } from './pages/Activities';
import { Resources } from './pages/Resources';
import { Admin } from './pages/Admin';
import { UploadContent } from './pages/UploadContent';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/content" element={<ContentPage />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/upload" element={<UploadContent />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;