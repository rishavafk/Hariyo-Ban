import React, { useState } from 'react';
import { trees } from '../data/trees';
import TreeCard from '../components/TreeCard';
import DonationModal from '../components/DonationModal';
import { TreePine, Filter, Search } from 'lucide-react';

const Donate = () => {
  const [selectedTree, setSelectedTree] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');

  const handleDonate = (tree) => {
    setSelectedTree(tree);
    setIsModalOpen(true);
  };

  const filteredTrees = trees.filter(tree => {
    const matchesSearch = tree.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tree.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'low' && tree.price <= 200) ||
                        (priceFilter === 'medium' && tree.price > 200 && tree.price <= 350) ||
                        (priceFilter === 'high' && tree.price > 350);
    
    return matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <TreePine className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your <span className="text-green-600">Tree</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Select from our collection of native Nepalese trees, each carefully chosen for its environmental benefits and suitability to Nepal's diverse climate zones.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search trees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="low">Under ₹200</option>
                <option value="medium">₹200 - ₹350</option>
                <option value="high">Above ₹350</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-green-600">{filteredTrees.length}</span> tree{filteredTrees.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Tree Grid */}
        {filteredTrees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrees.map((tree) => (
              <TreeCard 
                key={tree.id} 
                tree={tree} 
                onDonate={() => handleDonate(tree)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <TreePine className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No trees found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Quick Donation Section */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Quick Donation</h3>
          <p className="text-green-100 mb-6">
            Can't decide? Let us choose the best trees for current planting needs!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[500, 1000, 2500, 5000].map(amount => (
              <button
                key={amount}
                className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105"
              >
                Donate ₹{amount}
              </button>
            ))}
          </div>
        </div>
      </div>

      <DonationModal 
        tree={selectedTree}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Donate;