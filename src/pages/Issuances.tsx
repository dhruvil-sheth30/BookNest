import React from 'react';
import { format } from 'date-fns';
import { FiEdit2, FiCheck, FiX, FiPlus } from 'react-icons/fi';
import { issuanceAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { IssuanceForm } from '../components/IssuanceForm';
import { Dialog } from '../components/ui/Dialog';

export function Issuances() {
  const [issuances, setIssuances] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedIssuance, setSelectedIssuance] = React.useState(null);
  const [error, setError] = React.useState('');

  const fetchIssuances = async () => {
    try {
      setLoading(true);
      const data = await issuanceAPI.getAll();
      setIssuances(data);
    } catch (err) {
      setError('Failed to fetch issuances');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchIssuances();
  }, []);

  const handleEdit = (issuance) => {
    setSelectedIssuance(issuance);
    setIsModalOpen(true);
  };

  const handleReturn = async (id) => {
    if (window.confirm('Mark this book as returned?')) {
      try {
        await issuanceAPI.update(id, { status: 'returned' });
        fetchIssuances();
      } catch (err) {
        setError('Failed to update issuance');
        console.error(err);
      }
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedIssuance(null);
    fetchIssuances();
  };

  const getStatusBadge = (status, returnDate) => {
    const isOverdue = new Date(returnDate) < new Date() && status === 'pending';
    if (status === 'returned') {
      return <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">Returned</span>;
    }
    if (isOverdue) {
      return <span className="px-2 py-1 text-sm rounded-full bg-red-100 text-red-800">Overdue</span>;
    }
    return <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">Pending</span>;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Issuances</h1>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center">
          <FiPlus className="mr-2" /> New Issuance
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {issuances.map((issuance) => (
                <tr key={issuance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{issuance.book.name}</div>
                    <div className="text-sm text-gray-500">{issuance.book.publisher}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{issuance.member.name}</div>
                    <div className="text-sm text-gray-500">{issuance.member.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(issuance.issue_date), 'PP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(issuance.return_date), 'PP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(issuance.status, issuance.return_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(issuance)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      {issuance.status === 'pending' && (
                        <button
                          onClick={() => handleReturn(issuance.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FiCheck className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            {selectedIssuance ? 'Edit Issuance' : 'New Issuance'}
          </h2>
          <IssuanceForm
            issuanceId={selectedIssuance?.id}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsModalOpen(false)}
          />
        </div>
      </Dialog>
    </div>
  );
}