import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Menu, X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { NotificationCenter } from './NotificationCenter';
import { signOut } from '../lib/supabase';

export function Header() {
  const { user, profile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Guardians Club</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
            <Link to="/content" className="text-gray-700 hover:text-indigo-600">Content</Link>
            <Link to="/activities" className="text-gray-700 hover:text-indigo-600">Activities</Link>
            <Link to="/resources" className="text-gray-700 hover:text-indigo-600">Resources</Link>
            
            {user ? (
              <>
                <NotificationCenter />
                <div className="relative">
                  <div className="flex items-center space-x-4">
                    <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <User className="h-6 w-6" />
                      )}
                      <span>{profile?.name}</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-gray-700 hover:text-indigo-600"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Sign In
              </button>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/content"
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Content
            </Link>
            <Link
              to="/activities"
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Activities
            </Link>
            <Link
              to="/resources"
              className="block px-3 py-2 text-gray-700 hover:bg-indigo-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-gray-700 hover:bg-indigo-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-indigo-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 bg-indigo-600 text-white"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}