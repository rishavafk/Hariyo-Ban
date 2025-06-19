import React, { useState } from 'react';
import { trees } from '../data/trees';
import TreeCard from './TreeCard';
import DonationModal from './DonationModal';

const TreeCatalog = () => {
  const [selectedTree, setSelectedTree] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDonate = (tree) => {
    setSelectedTree(tree);
    setIsModalOpen(true);
  };

  return (
    <section id="trees" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your <span className="text-green-600">Tree</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Select from our collection of native Nepalese trees, each carefully chosen for its environmental benefits and suitability to Kathmandu's climate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trees.map((tree) => (
            <TreeCard 
              key={tree.id} 
              tree={tree} 
              onDonate={() => handleDonate(tree)} 
            />
          ))}
        </div>
      </div>

      <DonationModal 
        tree={selectedTree}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default TreeCatalog;