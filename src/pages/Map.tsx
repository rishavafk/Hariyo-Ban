import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { TreePine, MapPin, Info, Users, Calendar, Leaf } from 'lucide-react';
import { useRealTimeStats } from '../hooks/useRealTimeStats';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = () => {
  const [selectedSite, setSelectedSite] = useState(null);
  const { stats } = useRealTimeStats();

  // Nepal coordinates (centered on Kathmandu)
  const nepalCenter = [27.7172, 85.3240];

  const plantingSites = [
    {
      id: 1,
      name: 'Shivapuri National Park',
      coordinates: [27.8167, 85.3833],
      trees: 2847,
      type: 'forest',
      status: 'active',
      lastPlanted: '2024-01-15',
      species: ['Rhododendron', 'Oak', 'Pine'],
      description: 'Primary forest conservation area with diverse native species.'
    },
    {
      id: 2,
      name: 'Pashupatinath Area',
      coordinates: [27.7106, 85.3481],
      trees: 1263,
      type: 'temple',
      status: 'active',
      lastPlanted: '2024-01-12',
      species: ['Sacred Fig', 'Banyan'],
      description: 'Sacred temple grounds with religious significance.'
    },
    {
      id: 3,
      name: 'Swayambhunath Hill',
      coordinates: [27.7149, 85.2906],
      trees: 892,
      type: 'heritage',
      status: 'completed',
      lastPlanted: '2024-01-10',
      species: ['Bodhi Tree', 'Magnolia'],
      description: 'UNESCO World Heritage site restoration project.'
    },
    {
      id: 4,
      name: 'Kirtipur Municipality',
      coordinates: [27.6789, 85.2761],
      trees: 1456,
      type: 'urban',
      status: 'active',
      lastPlanted: '2024-01-14',
      species: ['Neem', 'Gulmohar'],
      description: 'Urban reforestation initiative in historic town.'
    },
    {
      id: 5,
      name: 'Bhaktapur Durbar Square',
      coordinates: [27.6722, 85.4278],
      trees: 634,
      type: 'heritage',
      status: 'planning',
      lastPlanted: '2024-01-08',
      species: ['Traditional varieties'],
      description: 'Heritage site beautification project.'
    },
    {
      id: 6,
      name: 'Tribhuvan University',
      coordinates: [27.6781, 85.3167],
      trees: 1823,
      type: 'education',
      status: 'active',
      lastPlanted: '2024-01-13',
      species: ['Various native species'],
      description: 'Campus greening initiative with student participation.'
    },
    {
      id: 7,
      name: 'Godavari Botanical Garden',
      coordinates: [27.5833, 85.3833],
      trees: 2156,
      type: 'botanical',
      status: 'active',
      lastPlanted: '2024-01-16',
      species: ['Rare native species'],
      description: 'Research and conservation botanical garden.'
    },
    {
      id: 8,
      name: 'Chandragiri Hills',
      coordinates: [27.6167, 85.2167],
      trees: 987,
      type: 'hills',
      status: 'active',
      lastPlanted: '2024-01-11',
      species: ['Mountain species'],
      description: 'Hill station reforestation for tourism development.'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'completed': return '#3B82F6';
      case 'planning': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      forest: '🌲',
      temple: '🏛️',
      heritage: '🏛️',
      urban: '🏙️',
      education: '🎓',
      botanical: '🌺',
      hills: '⛰️'
    };
    return icons[type] || '🌳';
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <MapPin className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Live <span className="text-green-600">Tree Map</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore real-time tree planting locations across Nepal. Watch our reforestation efforts grow in real-time!
          </p>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalTrees.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Trees Planted</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.activeSites}</div>
            <div className="text-sm text-gray-600">Active Planting Sites</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Leaf className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.recentPlantings}</div>
            <div className="text-sm text-gray-600">Trees This Week</div>
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-96 md:h-[600px] relative">
            <MapContainer
              center={nepalCenter}
              zoom={10}
              style={{ height: '100%', width: '100%' }}
              className="rounded-2xl"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {plantingSites.map((site) => (
                <React.Fragment key={site.id}>
                  <Marker
                    position={site.coordinates}
                    eventHandlers={{
                      click: () => setSelectedSite(site)
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-lg">{site.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{site.description}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center">
                            <TreePine className="h-4 w-4 text-green-600 mr-1" />
                            <span>{site.trees} trees planted</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-blue-600 mr-1" />
                            <span>Last planted: {site.lastPlanted}</span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                  
                  <Circle
                    center={site.coordinates}
                    radius={site.trees * 2}
                    pathOptions={{
                      color: getStatusColor(site.status),
                      fillColor: getStatusColor(site.status),
                      fillOpacity: 0.2
                    }}
                  />
                </React.Fragment>
              ))}
            </MapContainer>
          </div>

          {/* Legend */}
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Map Legend
                </h3>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>Active Sites</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span>Completed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span>Planning</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="font-semibold">Live Updates:</span> Map refreshes automatically
              </div>
            </div>
          </div>
        </div>

        {/* Site Details */}
        {selectedSite && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{getTypeIcon(selectedSite.type)}</span>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedSite.name}</h2>
                </div>
                <p className="text-gray-600 mb-4">{selectedSite.description}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold text-white`} 
                   style={{ backgroundColor: getStatusColor(selectedSite.status) }}>
                {selectedSite.status.charAt(0).toUpperCase() + selectedSite.status.slice(1)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-xl p-4">
                <TreePine className="h-8 w-8 text-green-600 mb-2" />
                <div className="text-2xl font-bold text-green-700">{selectedSite.trees}</div>
                <div className="text-sm text-green-600">Trees Planted</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                <div className="text-lg font-bold text-blue-700">{selectedSite.lastPlanted}</div>
                <div className="text-sm text-blue-600">Last Planting</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <Leaf className="h-8 w-8 text-purple-600 mb-2" />
                <div className="text-lg font-bold text-purple-700">{selectedSite.species.length} Species</div>
                <div className="text-sm text-purple-600">Tree Varieties</div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-2">Tree Species:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSite.species.map((species, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {species}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;