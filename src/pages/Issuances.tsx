import React from 'react';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { format } from 'date-fns';
import { IssuanceForm } from '../components/IssuanceForm';

export function Issuances() {
  const [issuances, setIssuances] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedIssuance, setSelectedIssuance] = React.useState(null);

  const fetchIssuances = async () => {
    try {
      const { data, error } = await supabase
        .from('issuance')
        .select(`
          *,
          book:book_id(name),
          member:member_id(name, email)
        `)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setIssuances(data || []);
    } catch (error) {
      console.error('Error fetching issuances:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchIssuances();
  }, []);

  const handleReturn = async (id: string) => {
    try {
      const { error } = await supabase
        .from('issuance')
        .update({ status: 'returned' })
        .eq('id', id);

      if (error) throw error;
      fetchIssuances();
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  const handleDetails = (issuance) => {
    setSelectedIssuance(issuance);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-gray-600">Loading...</div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Issuances</h1>
        <Button onClick={() => setIsModalOpen(true)} variant="primary">
          New Issuance
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {issuances.map((issuance) => (
              <tr key={issuance.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {issuance.book?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{issuance.member?.name}</div>
                  <div className="text-sm text-gray-500">{issuance.member?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(issuance.issue_date), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(issuance.return_date), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    issuance.status === 'returned' ? 'bg-green-100 text-green-800'
                    : issuance.status === 'overdue' ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {issuance.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  {issuance.status === 'pending' && (
                    <button
                      onClick={() => handleReturn(issuance.id)}
                      className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md"
                    >
                      Return
                    </button>
                  )}
                  <button
                    onClick={() => handleDetails(issuance)}
                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Issuance"
      >
        <IssuanceForm
          onSuccess={() => {
            setIsModalOpen(false);
            fetchIssuances();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!selectedIssuance}
        onClose={() => setSelectedIssuance(null)}
        title="Issuance Details"
      >
        {selectedIssuance && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Book</label>
              <p className="mt-1 text-sm text-gray-900">{selectedIssuance.book?.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Member</label>
              <p className="mt-1 text-sm text-gray-900">
                {selectedIssuance.member?.name} ({selectedIssuance.member?.email})
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Issue Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {format(new Date(selectedIssuance.issue_date), 'MMM dd, yyyy')}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Return Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {format(new Date(selectedIssuance.return_date), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <p className="mt-1 text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  selectedIssuance.status === 'returned' ? 'bg-green-100 text-green-800'
                  : selectedIssuance.status === 'overdue' ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedIssuance.status}
                </span>
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}