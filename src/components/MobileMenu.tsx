import React from 'react';
import { Link } from 'react-router-dom';

export function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="px-2 pt-2 pb-3 space-y-1">
      <Link
        to="/"
        onClick={onNavigate}
        className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md"
      >
        Dashboard
      </Link>
      <Link
        to="/books"
        onClick={onNavigate}
        className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md"
      >
        Books
      </Link>
      <Link
        to="/members"
        onClick={onNavigate}
        className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md"
      >
        Members
      </Link>
      <Link
        to="/issuances"
        onClick={onNavigate}
        className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md"
      >
        Issuances
      </Link>
    </div>
  );
} 