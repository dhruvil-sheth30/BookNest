import React from 'react';
import { format } from 'date-fns';
import { queryAPI } from '../services/api';
import { FiBook, FiUsers, FiBookOpen, FiAlertCircle, FiClock } from 'react-icons/fi';

export function Dashboard() {
  const [stats, setStats] = React.useState({
    totalBooks: 0,
    totalMembers: 0,
    activeIssuances: 0,
    outstandingBooks: [],
    pendingReturns: []
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const fetchDashboardData = async () => {
    try {
      const statsData = await queryAPI.getStats();
      setStats(statsData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string, returnDate: string) => {
    if (status === 'returned') return 'bg-green-100 text-green-800';
    if (status === 'pending') {
      const isOverdue = new Date(returnDate) < new Date();
      return isOverdue ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg shadow">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<FiBook className="w-6 h-6" />} 
          title="Total Books" 
          value={stats.totalBooks}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard 
          icon={<FiUsers className="w-6 h-6" />} 
          title="Total Members" 
          value={stats.totalMembers}
          color="bg-green-50 text-green-600"
        />
        <StatCard 
          icon={<FiBookOpen className="w-6 h-6" />} 
          title="Active Issuances" 
          value={stats.activeIssuances}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard 
          icon={<FiAlertCircle className="w-6 h-6" />} 
          title="Outstanding Books" 
          value={stats.outstandingBooks.length}
          color="bg-red-50 text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outstanding Books Panel */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 bg-red-50 border-b border-red-100">
            <div className="flex items-center">
              <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <h2 className="text-lg font-semibold text-red-700">Outstanding Books</h2>
            </div>
          </div>
          <div className="p-4">
            {stats.outstandingBooks.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {stats.outstandingBooks.map((book: any, index: number) => (
                  <div key={index} className="py-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{book.book.name}</h3>
                        <p className="text-sm text-gray-500">{book.member.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-red-600 font-medium">
                          Due: {format(new Date(book.return_date), 'PP')}
                        </p>
                        <p className="text-xs text-gray-500">
                          Issued: {format(new Date(book.issue_date), 'PP')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No outstanding books</p>
            )}
          </div>
        </div>

        {/* Pending Returns Panel */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center">
              <FiClock className="w-5 h-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold text-blue-700">Pending Returns</h2>
            </div>
          </div>
          <div className="p-4">
            {stats.pendingReturns.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {stats.pendingReturns.map((issue: any, index: number) => (
                  <div key={index} className="py-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{issue.book.name}</h3>
                        <p className="text-sm text-gray-500">{issue.member.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-blue-600 font-medium">
                          Due: {format(new Date(issue.return_date), 'PP')}
                        </p>
                        <p className="text-xs text-gray-500">
                          Issued: {format(new Date(issue.issue_date), 'PP')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No pending returns</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }: { 
  icon: React.ReactNode; 
  title: string; 
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className={`inline-flex items-center justify-center p-3 rounded-lg ${color}`}>
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-semibold">{value}</h3>
      <p className="text-gray-500">{title}</p>
    </div>
  );
}