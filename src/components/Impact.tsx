import React from 'react';
import { TreePine, Droplets, Wind, Users, Award, Heart } from 'lucide-react';

const Impact = () => {
  const stats = [
    {
      icon: TreePine,
      value: '12,847',
      label: 'Trees Planted',
      description: 'Native species across Kathmandu Valley'
    },
    {
      icon: Droplets,
      value: '2.8M',
      label: 'Liters Water Saved',
      description: 'Annual water conservation through trees'
    },
    {
      icon: Wind,
      value: '156 tons',
      label: 'CO₂ Absorbed',
      description: 'Carbon dioxide removed from atmosphere'
    },
    {
      icon: Users,
      value: '8,492',
      label: 'Active Donors',
      description: 'Community members supporting the cause'
    }
  ];

  return (
    <section id="impact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-green-600">Impact</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Together, we're creating measurable change in Kathmandu's environment. Here's the difference your donations are making.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="h-10 w-10 text-green-600" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-gray-800 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Award className="h-8 w-8 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-900">Environmental Benefits</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-semibold text-gray-800">Air Quality Improvement</div>
                  <div className="text-gray-600 text-sm">Each tree filters 22kg of air pollutants annually</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-semibold text-gray-800">Temperature Regulation</div>
                  <div className="text-gray-600 text-sm">Trees can reduce local temperature by up to 5°C</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-semibold text-gray-800">Biodiversity Support</div>
                  <div className="text-gray-600 text-sm">Creating habitats for native wildlife species</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-semibold text-gray-800">Soil Conservation</div>
                  <div className="text-gray-600 text-sm">Preventing erosion and improving soil quality</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
            <div className="text-center">
              <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Mission</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Every tree planted is a step towards a cleaner, greener Kathmandu. Your contribution, no matter the size, makes a lasting impact on our environment and future generations.
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Start Planting Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;