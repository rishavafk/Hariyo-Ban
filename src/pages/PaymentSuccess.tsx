import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, TreePine, MapPin, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [donation, setDonation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      const oid = searchParams.get('oid'); // eSewa order ID
      const amt = searchParams.get('amt'); // Amount
      const refId = searchParams.get('refId'); // eSewa reference ID

      if (oid && amt && refId) {
        try {
          // Update donation status
          const { data, error } = await supabase
            .from('donations')
            .update({
              payment_status: 'completed',
              esewa_transaction_id: oid,
              esewa_ref_id: refId,
              completed_at: new Date().toISOString(),
            })
            .eq('id', oid)
            .select(`
              *,
              planting_sites(name, address),
              profiles(full_name)
            `)
            .single();

          if (error) throw error;

          // Create tree records
          if (data) {
            const treePromises = [];
            for (let i = 0; i < data.trees_count; i++) {
              treePromises.push(
                supabase.from('trees').insert({
                  donation_id: data.id,
                  site_id: data.site_id,
                  species: data.tree_species,
                  status: 'planted',
                  planted_by: data.user_id,
                  planted_date: new Date().toISOString().split('T')[0],
                })
              );
            }
            await Promise.all(treePromises);

            // Update site planted trees count
            await supabase.rpc('increment_planted_trees', {
              site_id: data.site_id,
              count: data.trees_count
            });

            setDonation(data);
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
        }
      }
      setLoading(false);
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <TreePine className="h-12 w-12 animate-pulse text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Payment verification failed</div>
          <Link to="/donate" className="text-green-600 hover:text-green-700">
            Return to Donations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-white text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-green-100">Thank you for contributing to Green Nepal</p>
          </div>

          {/* Donation Details */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                You've planted {donation.trees_count} {donation.tree_species} tree{donation.trees_count > 1 ? 's' : ''}!
              </h2>
              <div className="bg-green-50 rounded-xl p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  NPR {donation.amount}
                </div>
                <div className="text-gray-600">Total Donation Amount</div>
              </div>
            </div>

            {/* Donation Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <MapPin className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="font-semibold text-gray-900">Planting Location</div>
                  <div className="text-gray-600">{donation.planting_sites?.name}</div>
                  <div className="text-sm text-gray-500">{donation.planting_sites?.address}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <TreePine className="h-8 w-8 text-green-600" />
                <div>
                  <div className="font-semibold text-gray-900">Tree Species</div>
                  <div className="text-gray-600">{donation.tree_species}</div>
                  <div className="text-sm text-gray-500">{donation.trees_count} trees planted</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="font-semibold text-gray-900">Donation Date</div>
                  <div className="text-gray-600">
                    {new Date(donation.completed_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-sm text-gray-500">Transaction ID: {donation.esewa_transaction_id}</div>
                </div>
              </div>

              {donation.donation_message && (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="font-semibold text-blue-900 mb-2">Your Message</div>
                  <div className="text-blue-800">{donation.donation_message}</div>
                </div>
              )}
            </div>

            {/* Environmental Impact */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Environmental Impact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(donation.trees_count * 22).toFixed(1)}kg
                  </div>
                  <div className="text-sm text-gray-600">CO₂ Absorbed/Year</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(donation.trees_count * 120).toLocaleString()}L
                  </div>
                  <div className="text-sm text-gray-600">Water Filtered/Year</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/dashboard"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold text-center transition-colors"
              >
                View Dashboard
              </Link>
              <Link
                to="/map"
                className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 px-6 rounded-xl font-semibold text-center transition-colors"
              >
                Track Your Trees
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/donate"
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Plant More Trees →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;