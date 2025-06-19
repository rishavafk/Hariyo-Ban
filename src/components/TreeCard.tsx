import React from 'react';
import { Leaf, Heart, TreePine } from 'lucide-react';

const TreeCard = ({ tree, onDonate }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={tree.image} 
          alt={tree.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-green-700">
          ₹{tree.price}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-3">
          <TreePine className="h-5 w-5 text-green-600 mr-2" />
          <h3 className="text-xl font-bold text-gray-900">{tree.name}</h3>
        </div>
        
        <p className="text-gray-600 mb-4 leading-relaxed">{tree.description}</p>
        
        <div className="space-y-2 mb-6">
          {tree.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center text-sm text-gray-700">
              <Leaf className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span className="font-semibold text-green-600">{tree.planted}</span> planted
          </div>
          <button 
            onClick={onDonate}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center"
          >
            <Heart className="h-4 w-4 mr-2" />
            Donate
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreeCard;