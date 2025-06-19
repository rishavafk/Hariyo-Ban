import React, { useState } from 'react';
import { MapPin, TreePine, Info } from 'lucide-react';

const plantingSites = [
  { id: 1, name: 'Shivapuri National Park', x: 45, y: 15, trees: 2847, type: 'forest' },
  { id: 2, name: 'Pashupatinath Area', x: 60, y: 45, trees: 1263, type: 'temple' },
  { id: 3, name: 'Swayambhunath Hill', x: 25, y: 40, trees: 892, type: 'heritage' },
  { id: 4, name: 'Kirtipur Municipality', x: 20, y: 65, trees: 1456, type: 'urban' },
  { id: 5, name: 'Bhaktapur Durbar Square', x: 80, y: 55, trees: 634, type: 'heritage' },
  { id: 6, name: 'Tribhuvan University', x: 35, y: 70, trees: 1823, type: 'education' },
  { id: 7, name: 'Godavari Botanical Garden', x: 70, y: 85, trees: 2156, type: 'botanical' },
  { id: 8, name: 'Chandragiri Hills', x: 15, y: 80, trees: 987, type: 'hills' },
];

const KathmanduMap = () => {
  const [selectedSite, setSelectedSite] = useState(null);

  const getSiteColor = (type) => {
    const colors = {
      forest: 'bg-green-600',
      temple: 'bg-orange-500',
      heritage: 'bg-purple-600',
      urban: 'bg-blue-600',
      education: 'bg-indigo-600',
      botanical: 'bg-emerald-600',
      hills: 'bg-teal-600'
    };
    return colors[type] || 'bg-green-600';
  };

  return (
    <section id="map" className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Planting <span className="text-green-600">Locations</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore the strategic locations across Kathmandu Valley where your donated trees are making a real difference to the environment.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-xl h-96 md:h-[500px] border-4 border-green-200">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-lg"></div>
              
              {/* Planting Sites */}
              {plantingSites.map((site) => (
                <div
                  key={site.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-125 ${
                    selectedSite?.id === site.id ? 'scale-125 z-10' : ''
                  }`}
                  style={{ left: `${site.x}%`, top: `${site.y}%` }}
                  onClick={() => setSelectedSite(selectedSite?.id === site.id ? null : site)}
                >
                  <div className={`w-4 h-4 rounded-full ${getSiteColor(site.type)} animate-pulse shadow-lg`}></div>
                  <div className={`w-8 h-8 rounded-full ${getSiteColor(site.type)} opacity-30 absolute inset-0 -m-2 animate-ping`}></div>
                </div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-800">Planting Sites</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Forest Areas</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Temple Grounds</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span>Heritage Sites</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Urban Areas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Site Information */}
            {selectedSite && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <h3 className="text-xl font-bold text-gray-900">{selectedSite.name}</h3>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <TreePine className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-700">{selectedSite.trees.toLocaleString()}</span>
                        <span>trees planted</span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getSiteColor(selectedSite.type)}`}>
                        {selectedSite.type.charAt(0).toUpperCase() + selectedSite.type.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KathmanduMap;