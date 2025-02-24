import { Link } from "react-router-dom";
import * as Icons from "lucide-react";

export function Sidebar() {
  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-indigo-600">BookNest</h1>
        <p className="text-sm text-gray-500">Library Management System</p>
      </div>

      <nav className="space-y-1">
        <Link
          to="/"
          className="flex items-center space-x-3 p-2 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          <Icons.Home className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/books"
          className="flex items-center space-x-3 p-2 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          <Icons.Book className="h-5 w-5" />
          <span>Books</span>
        </Link>

        <Link
          to="/members"
          className="flex items-center space-x-3 p-2 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          <Icons.Users className="h-5 w-5" />
          <span>Members</span>
        </Link>

        <Link
          to="/issuances"
          className="flex items-center space-x-3 p-2 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          <Icons.CalendarCheck className="h-5 w-5" />
          <span>Issuances</span>
        </Link>
      </nav>
    </div>
  );
} 