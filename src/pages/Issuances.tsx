import React from 'react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { format } from 'date-fns';
import { IssuanceForm } from '../components/IssuanceForm';
import { issuanceAPI } from '../services/api';

export function Issuances() {
  const [issuances, setIssuances] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedIssuance, setSelectedIssuance] = React.useState(null);

  const fetchIssuances = async () => {
    try {
      setLoading(true);
      const data = await issuanceAPI.getAll();
      setIssuances(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching issuances:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchIssuances();
  }, []);

  const handleReturn = async (id: string) => {
    try {
      await issuanceAPI.update(id, { status: 'returned' });
      fetchIssuances();
    } catch (err) {
      setError(err.message);
      console.error('Error returning book:', err);
    }
  };

  const handleDetails = (issuance) => {
    setSelectedIssuance(issuance);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-gray-600">Loading...</div>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-red-600">Error: {error}</div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Book Issuances</h2>
        <Button onClick={() => setIsModalOpen(true)}>New Issuance</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Book</th>
              <th className="px-4 py-2">Member</th>
              <th className="px-4 py-2">Issue Date</th>
              <th className="px-4 py-2">Return Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {issuances.map((issuance) => (
              <tr key={issuance.id} className="border-b">
                <td className="px-4 py-2">{issuance.book.name}</td>
                <td className="px-4 py-2">{issuance.member.name}</td>
                <td className="px-4 py-2">{format(new Date(issuance.issue_date), 'PP')}</td>
                <td className="px-4 py-2">{format(new Date(issuance.return_date), 'PP')}</td>
                <td className="px-4 py-2">{issuance.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <Button 
                    variant="secondary" 
                    onClick={() => handleDetails(issuance)}
                  >
                    Details
                  </Button>
                  {issuance.status === 'pending' && (
                    <Button 
                      variant="primary"
                      onClick={() => handleReturn(issuance.id)}
                    >
                      Return
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIssuance(null);
        }}
      >
        <IssuanceForm
          issuanceId={selectedIssuance?.id}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedIssuance(null);
            fetchIssuances();
          }}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedIssuance(null);
          }}
        />
      </Modal>
    </div>
  );
}