import React from 'react';
import { 
  Routes, 
  Route, 
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Outlet
} from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';



import { ContentPage } from './pages/Content';

import { Activities } from './pages/Activities';
import { Resources } from './pages/Resources';
import { Admin } from './pages/Admin';
import { UploadContent } from './pages/UploadContent';

// Layout component that includes Header and Footer
const Layout = () => {
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
};

// Configuração do router com as flags de futuro
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/content" element={<ContentPage />} />
      <Route path="/activities" element={<Activities />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/upload" element={<UploadContent />} />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;