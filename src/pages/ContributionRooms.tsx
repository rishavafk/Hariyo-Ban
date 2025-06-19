import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { TreePine, Users, Target, Calendar, Heart, MapPin, Clock, CheckCircle, Plus, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContributionRoom {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  target_trees: number;
  tree_species: string;
  site_id: string;
  status: 'active' | 'completed' | 'cancelled';
  deadline: string;
  image_url: string | null;
  created_at: string;
  planting_sites: {
    name: string;
    address: string;
  };
  profiles: {
    full_name: string;
  };
  _count: {
    room_contributions: number;
  };
}

interface RoomContribution {
  id: string;
  amount: number;
  message: string;
  is_anonymous: boolean;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

interface CreateRoomData {
  title: string;
  description: string;
  goal_amount: number;
  target_trees: number;
  tree_species: string;
  site_id: string;
  deadline: string;
}

const ContributionRooms = () => {
  const [rooms, setRooms] = useState<ContributionRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ContributionRoom | null>(null);
  const [contributions, setContributions] = useState<RoomContribution[]>([]);
  const [contributionAmount, setContributionAmount] = useState(10);
  const [contributionMessage, setContributionMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contributing, setContributing] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [sites, setSites] = useState<any[]>([]);
  const [createRoomData, setCreateRoomData] = useState<CreateRoomData>({
    title: '',
    description: '',
    goal_amount: 1000,
    target_trees: 5,
    tree_species: 'Mixed Native Species',
    site_id: '',
    deadline: ''
  });

  const { user } = useAuth();

  useEffect(() => {
    fetchRooms();
    fetchSites();
    
    // Set up real-time subscription for rooms
    const roomsSubscription = supabase
      .channel('rooms_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contribution_rooms' }, () => {
        fetchRooms();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_contributions' }, () => {
        fetchRooms();
        if (selectedRoom) {
          fetchRoomContributions(selectedRoom.id);
        }
      })
      .subscribe();

    return () => {
      roomsSubscription.unsubscribe();
    };
  }, [selectedRoom]);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('contribution_rooms')
        .select(`
          *,
          planting_sites(name, address),
          profiles(full_name)
        `)
        .in('status', ['active', 'completed'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get contribution counts for each room
      const roomsWithCounts = await Promise.all(
        (data || []).map(async (room) => {
          const { count } = await supabase
            .from('room_contributions')
            .select('*', { count: 'exact', head: true })
            .eq('room_id', room.id)
            .eq('payment_status', 'completed');

          return {
            ...room,
            _count: { room_contributions: count || 0 }
          };
        })
      );

      setRooms(roomsWithCounts);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSites = async () => {
    try {
      const { data, error } = await supabase
        .from('planting_sites')
        .select('*')
        .in('status', ['active', 'planning'])
        .order('name');

      if (error) throw error;
      setSites(data || []);
      if (data && data.length > 0) {
        setCreateRoomData(prev => ({ ...prev, site_id: data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };

  const fetchRoomContributions = async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('room_contributions')
        .select(`
          *,
          profiles(full_name)
        `)
        .eq('room_id', roomId)
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContributions(data || []);
    } catch (error) {
      console.error('Error fetching contributions:', error);
    }
  };

  const handleRoomSelect = (room: ContributionRoom) => {
    setSelectedRoom(room);
    fetchRoomContributions(room.id);
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('contribution_rooms')
        .insert([
          {
            ...createRoomData,
            created_by: user.id,
            deadline: new Date(createRoomData.deadline).toISOString(),
          }
        ]);

      if (error) throw error;

      setShowCreateRoom(false);
      setCreateRoomData({
        title: '',
        description: '',
        goal_amount: 1000,
        target_trees: 5,
        tree_species: 'Mixed Native Species',
        site_id: sites[0]?.id || '',
        deadline: ''
      });
      fetchRooms();
    } catch (error: any) {
      console.error('Error creating room:', error);
      alert('Failed to create room: ' + error.message);
    }
  };

  const handleContribute = async () => {
    if (!user || !selectedRoom) return;

    setContributing(true);
    try {
      // Create contribution record
      const { data: contribution, error: contributionError } = await supabase
        .from('room_contributions')
        .insert([
          {
            room_id: selectedRoom.id,
            user_id: user.id,
            amount: contributionAmount,
            message: contributionMessage || null,
            is_anonymous: isAnonymous,
            payment_status: 'pending',
          },
        ])
        .select()
        .single();

      if (contributionError) throw contributionError;

      // eSewa integration parameters
      const esewaParams = {
        amt: contributionAmount,
        pdc: 0,
        psc: 0,
        txAmt: 0,
        tAmt: contributionAmount,
        pid: contribution.id,
        scd: 'EPAYTEST', // Use your eSewa merchant code
        su: `${window.location.origin}/payment/success?type=room`,
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

    } catch (error: any) {
      console.error('Error contributing:', error);
      alert('Failed to process contribution: ' + error.message);
    } finally {
      setContributing(false);
    }
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getRemainingDays = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <TreePine className="h-12 w-12 animate-pulse text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading contribution rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Users className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contribution <span className="text-green-600">Rooms</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join community-driven tree planting initiatives! Contribute as little as NPR 10 and help reach collective goals together.
          </p>
        </div>

        {/* Create Room Button */}
        {user && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowCreateRoom(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Room</span>
            </button>
          </div>
        )}

        {/* Live Update Indicator */}
        <div className="flex justify-center mb-8">
          <div className="bg-green-50 border border-green-200 rounded-full px-4 py-2 flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 text-sm font-medium">Live Updates</span>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {rooms.map((room) => {
            const progress = getProgressPercentage(room.current_amount, room.goal_amount);
            const remainingDays = getRemainingDays(room.deadline);
            const isCompleted = room.status === 'completed';

            return (
              <div
                key={room.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer ${
                  isCompleted ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => handleRoomSelect(room)}
              >
                {/* Room Image */}
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative">
                  {room.image_url ? (
                    <img src={room.image_url} alt={room.title} className="w-full h-full object-cover" />
                  ) : (
                    <TreePine className="h-16 w-16 text-green-600" />
                  )}
                  {isCompleted && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-sm font-semibold text-green-700">
                      {room._count.room_contributions} contributors
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{room.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>

                  {/* Location */}
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{room.planting_sites.name}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-700">Progress</span>
                      <span className="text-green-600 font-bold">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>NPR {room.current_amount.toLocaleString()}</span>
                      <span>NPR {room.goal_amount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{room.target_trees}</div>
                      <div className="text-xs text-gray-600">Trees Goal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">{remainingDays}</div>
                      <div className="text-xs text-gray-600">Days Left</div>
                    </div>
                  </div>

                  {/* Tree Species */}
                  <div className="bg-green-50 rounded-lg p-3 mb-4">
                    <div className="text-sm font-semibold text-green-800">{room.tree_species}</div>
                    <div className="text-xs text-green-600">Tree Species</div>
                  </div>

                  {/* Action Button */}
                  <button
                    className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                      isCompleted
                        ? 'bg-green-100 text-green-800 cursor-default'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                    disabled={isCompleted}
                  >
                    {isCompleted ? 'Goal Achieved!' : 'Join Room'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Room Modal */}
        {showCreateRoom && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-2xl font-bold text-gray-900">Create New Room</h3>
                <button
                  onClick={() => setShowCreateRoom(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateRoom} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Room Title</label>
                  <input
                    type="text"
                    required
                    value={createRoomData.title}
                    onChange={(e) => setCreateRoomData({...createRoomData, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Enter room title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    value={createRoomData.description}
                    onChange={(e) => setCreateRoomData({...createRoomData, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                    rows={3}
                    placeholder="Describe your room's purpose"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Goal Amount (NPR)</label>
                    <input
                      type="number"
                      required
                      min="100"
                      value={createRoomData.goal_amount}
                      onChange={(e) => setCreateRoomData({...createRoomData, goal_amount: Number(e.target.value)})}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Target Trees</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={createRoomData.target_trees}
                      onChange={(e) => setCreateRoomData({...createRoomData, target_trees: Number(e.target.value)})}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tree Species</label>
                  <input
                    type="text"
                    required
                    value={createRoomData.tree_species}
                    onChange={(e) => setCreateRoomData({...createRoomData, tree_species: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="e.g., Mixed Native Species"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Planting Site</label>
                  <select
                    required
                    value={createRoomData.site_id}
                    onChange={(e) => setCreateRoomData({...createRoomData, site_id: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    {sites.map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Deadline</label>
                  <input
                    type="datetime-local"
                    required
                    value={createRoomData.deadline}
                    onChange={(e) => setCreateRoomData({...createRoomData, deadline: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-colors"
                >
                  Create Room
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Room Details Modal */}
        {selectedRoom && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-2xl font-bold text-gray-900">{selectedRoom.title}</h3>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Room Details */}
                <div>
                  <p className="text-gray-600 leading-relaxed mb-4">{selectedRoom.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-700">NPR {selectedRoom.goal_amount.toLocaleString()}</div>
                      <div className="text-sm text-green-600">Goal Amount</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-700">{selectedRoom.target_trees}</div>
                      <div className="text-sm text-green-600">Trees to Plant</div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-700">Current Progress</span>
                      <span className="text-green-600 font-bold">
                        {getProgressPercentage(selectedRoom.current_amount, selectedRoom.goal_amount).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage(selectedRoom.current_amount, selectedRoom.goal_amount)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>NPR {selectedRoom.current_amount.toLocaleString()} raised</span>
                      <span>NPR {(selectedRoom.goal_amount - selectedRoom.current_amount).toLocaleString()} remaining</span>
                    </div>
                  </div>
                </div>

                {/* Contribution Form */}
                {user && selectedRoom.status === 'active' && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Make a Contribution</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Amount (Minimum NPR 10)
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="number"
                            min="10"
                            value={contributionAmount}
                            onChange={(e) => setContributionAmount(Number(e.target.value))}
                            className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                          />
                          <div className="flex space-x-2">
                            {[10, 50, 100, 500].map(amount => (
                              <button
                                key={amount}
                                onClick={() => setContributionAmount(amount)}
                                className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                              >
                                {amount}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Message (Optional)
                        </label>
                        <textarea
                          value={contributionMessage}
                          onChange={(e) => setContributionMessage(e.target.value)}
                          placeholder="Leave an encouraging message..."
                          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="anonymous"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-600"
                        />
                        <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                          Contribute anonymously
                        </label>
                      </div>

                      <button
                        onClick={handleContribute}
                        disabled={contributing || contributionAmount < 10}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center space-x-2"
                      >
                        <CreditCard className="h-5 w-5" />
                        <span>{contributing ? 'Processing...' : `Pay NPR ${contributionAmount} via eSewa`}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Recent Contributions */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Recent Contributions</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {contributions.length > 0 ? (
                      contributions.map((contribution) => (
                        <div key={contribution.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {contribution.is_anonymous ? 'Anonymous' : contribution.profiles.full_name}
                            </div>
                            {contribution.message && (
                              <div className="text-sm text-gray-600 italic">"{contribution.message}"</div>
                            )}
                            <div className="text-xs text-gray-500">
                              {new Date(contribution.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            NPR {contribution.amount}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No contributions yet. Be the first to contribute!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {!user && (
          <div className="text-center bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
            <Users className="h-16 w-16 mx-auto mb-4 text-green-200" />
            <h3 className="text-2xl font-bold mb-4">Join the Community!</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Sign up to participate in contribution rooms and help plant trees across Nepal with as little as NPR 10.
            </p>
            <Link
              to="/register"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-full font-bold transition-colors"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionRooms;