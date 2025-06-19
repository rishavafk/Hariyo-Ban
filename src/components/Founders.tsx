import React from 'react';
import { Users, Heart, TreePine, Linkedin, Twitter, Mail } from 'lucide-react';

const Founders = () => {
  const founders = [
    {
      name: 'Rishav Shah',
      role: 'Co-Founder & CTO',
      bio: 'Environmental advocate in sustainable development. Passionate about reforestation and climate action in Nepal.',
      image: null, // Placeholder for founder image
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'rishav@teamtreesnepal.org'
      },
      achievements: [
        'Led 15+ environmental campaigns',
        'Planted 5,000+ trees personally',
        'Environmental Science Graduate'
      ]
    },
    {
      name: 'Sanjay Dudhaniya',
      role: 'Co-Founder & CTO',
      bio: 'Environmental advocate in sustainable development. Passionate about reforestation and climate action in Nepal.',
      image: null, // Placeholder for founder image
      achievements: [
        'Tech for Good advocate',
      ],
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'sanjay@teamtreesnepal.org'
      }
    }
  ];

  return (
    <section id="founders" className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Users className="h-16 w-16 text-green-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Meet Our <span className="text-green-600">Founders</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The visionaries behind TeamTrees Nepal, dedicated to making Kathmandu Valley greener and more sustainable for future generations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {founders.map((founder, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Image Placeholder */}
              <div className="h-80 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative overflow-hidden">
                {founder.image ? (
                  <img 
                    src={founder.image} 
                    alt={founder.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-32 h-32 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl font-bold text-white">
                        {founder.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <p className="text-green-700 font-semibold">Photo Coming Soon</p>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-sm font-semibold text-green-700">Co-Founder</span>
                </div>
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{founder.name}</h3>
                  <p className="text-green-600 font-semibold text-lg mb-4">{founder.role}</p>
                  <p className="text-gray-600 leading-relaxed">{founder.bio}</p>
                </div>

                {/* Achievements */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <TreePine className="h-5 w-5 text-green-600 mr-2" />
                    Key Achievements
                  </h4>
                  <div className="space-y-2">
                    {founder.achievements.map((achievement, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <a 
                      href={founder.social.linkedin}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a 
                      href={founder.social.twitter}
                      className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                    <a 
                      href={`mailto:${founder.social.email}`}
                      className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                  <button className="text-green-600 hover:text-green-700 font-semibold text-sm transition-colors">
                    Connect →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-12 text-white text-center">
          <Heart className="h-16 w-16 mx-auto mb-6 text-green-200" />
          <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
          <p className="text-xl text-green-100 max-w-4xl mx-auto leading-relaxed mb-8">
            "We believe that every tree planted today is an investment in Nepal's future. Our mission is to mobilize communities, 
            leverage technology, and create lasting environmental impact across Kathmandu Valley and beyond."
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105">
              Join Our Mission
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-full font-bold transition-all duration-300">
              Contact Founders
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founders;