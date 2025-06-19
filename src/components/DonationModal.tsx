import React, { useState, useEffect } from 'react';
import { X, Heart, CreditCard, TreePine, AlertCircle, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface PlantingSite {
  id: string;
  name: string;
  description: string;
  target_trees: number;
  planted_trees: number;
  status: string;
}

interface TreeSpecies {
  name: string;
  price: number;
  description: string;
  benefits: string[];
}

const DonationModal = ({ tree, isOpen, onClose }: { tree: TreeSpecies | null, isOpen: boolean, onClose: () => void }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSite, setSelectedSite] = useState<string>('');
  const [sites, setSites] = useState<PlantingSite[]>([]);
  const [donationMessage, setDonationMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchPlantingSites();
    }
  }, [isOpen]);

  const fetchPlantingSites = async () => {
    try {
      const { data, error } = await supabase
        .from('planting_sites')
        .select('*')
        .in('status', ['active', 'planning'])
        .order('name');

      if (error) throw error;
      setSites(data || []);
      if (data && data.length > 0) {
        setSelectedSite(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching sites:', err);
    }
  };

  if (!isOpen || !tree) return null;

  const total = tree.price * quantity;

  const handleESewaPayment = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/donate' } } });
      return;
    }

    if (!selectedSite) {
      setError('Please select a planting site');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create donation record
      const { data: donation, error: donationError } = await supabase
        .from('donations')
        .insert([
          {
            user_id: user.id,
            site_id: selectedSite,
            amount: total,
            trees_count: quantity,
            tree_species: tree.name,
            payment_method: 'esewa',
            payment_status: 'pending',
            donation_message: donationMessage || null,
            is_anonymous: isAnonymous,
          },
        ])
        .select()
        .single();

      if (donationError) throw donationError;

      // eSewa integration parameters
      const esewaParams = {
        amt: total,
        pdc: 0,
        psc: 0,
        txAmt: 0,
        tAmt: total,
        pid: donation.id,
        scd: 'EPAYTEST', // Use your eSewa merchant code
        su: `${window.location.origin}/payment/success`,
        fu: `${window.location.origin}/payment/failure`,
      };

      // Create eSewa form and submit
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://uat.esewa.com.np/epay/main'; // Use production URL for live

      Object.entries(esewaParams).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value.toString();
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      onClose();
      
    } catch (err: any) {
      setError(err.message || 'Failed to process donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-2xl font-bold text-gray-900">Plant {tree.name}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!user && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
              <span className="text-yellow-700 text-sm">You need to sign in to make a donation</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <div className="text-center">
            <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-xl mb-4 flex items-center justify-center">
              <TreePine className="h-24 w-24 text-green-600" />
            </div>
            <p className="text-gray-600">{tree.description}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Trees
              </label>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center font-bold transition-colors"
                >
                  -
                </button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {user && sites.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Planting Site
                </label>
                <select
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                >
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name} ({site.planted_trees}/{site.target_trees} trees)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {user && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Donation Message (Optional)
                </label>
                <textarea
                  value={donationMessage}
                  onChange={(e) => setDonationMessage(e.target.value)}
                  placeholder="Leave a message with your donation..."
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  rows={3}
                />
              </div>
            )}

            {user && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-600"
                />
                <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                  Make this donation anonymous
                </label>
              </div>
            )}

            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-green-600">NPR {total}</span>
              </div>
            </div>

            <button 
              onClick={handleESewaPayment}
              disabled={loading || !user}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              {loading ? (
                <TreePine className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  <span>{user ? `Pay NPR ${total} via eSewa` : 'Sign In to Donate'}</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Your donation will help plant {quantity} {tree.name} tree{quantity > 1 ? 's' : ''} in Nepal. 
              {user && " You'll receive updates on your tree's growth and location."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;