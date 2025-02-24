import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Sidebar } from './Sidebar';
import { MobileMenu } from './MobileMenu';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Icons.LayoutDashboard },
    { name: 'Books', href: '/books', icon: Icons.BookOpen },
    { name: 'Members', href: '/members', icon: Icons.Users },
    { name: 'Issuances', href: '/issuances', icon: Icons.BookCopy },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="md:hidden bg-white shadow-sm">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-4 text-gray-500 hover:text-gray-900"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden md:block md:w-64 md:fixed md:h-screen bg-white shadow">
          <Sidebar />
        </div>

        {/* Mobile sidebar */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 w-64 bg-white shadow-lg">
            <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 md:ml-64 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}