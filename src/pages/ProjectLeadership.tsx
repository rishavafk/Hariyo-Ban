import React from 'react';
import { Users, Heart, TreePine, Linkedin, Twitter, Mail, Award, Target, Globe } from 'lucide-react';

const ProjectLeadership = () => {
  const leaders = [
    {
      name: 'Sanjay Dudhaniya',
      role: 'Project Head & Concept Lead',
      bio: 'Visionary leader driving environmental initiatives through Rotary Club of Kasthamandap. Passionate about sustainable development and community engagement in Nepal.',
      image: null,
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'sanjay@greennepal.org'
      },
      achievements: [
        'Led 20+ environmental campaigns',
        'Initiated Green Nepal project',
        'Community development advocate',
        'Rotary Club environmental chair'
      ]
    },
    {
      name: 'Rishav Shah',
      role: 'Technical Head',
      bio: 'Technology expert implementing innovative solutions for environmental tracking and community engagement. Bridging technology and environmental conservation for maximum impact.',
      image: null,
      achievements: [
        'Full-stack development expertise',
        'Environmental tech innovation',
        'Real-time tracking systems',
        'Community platform architect'
      ],
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'rishav@greennepal.org'
      }
    }
  ];

  const rotaryValues = [
    {
      icon: Globe,
      title: 'Service Above Self',
      description: 'Following Rotary\'s motto in environmental stewardship for Nepal'
    },
    {
      icon: Users,
      title: 'Community Partnership',
      description: 'Bringing together local communities for lasting environmental change'
    },
    {
      icon: Target,
      title: 'Sustainable Impact',
      description: 'Creating measurable environmental improvements across Nepal'
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Users className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Project <span className="text-green-600">Leadership</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet the dedicated team behind Green Nepal initiative, working through the Rotary Club of Kasthamandap to create lasting environmental impact across Nepal.
          </p>
        </div>

        {/* Rotary Club Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-2xl font-bold">RC</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-6">Rotary Club of Kasthamandap</h2>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
            Green Nepal is proudly powered by the Rotary Club of Kasthamandap, bringing together our commitment to 
            environmental stewardship with Rotary's global mission of service above self. Together, we're 
            creating a sustainable future for Nepal through community-driven reforestation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rotaryValues.map((value, index) => (
              <div key={index} className="text-center">
                <value.icon className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                <p className="text-blue-100 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Project Leaders */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
          {leaders.map((leader, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Image Placeholder */}
              <div className="h-80 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative overflow-hidden">
                {leader.image ? (
                  <img 
                    src={leader.image} 
                    alt={leader.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-32 h-32 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl font-bold text-white">
                        {leader.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <p className="text-green-700 font-semibold">Photo Coming Soon</p>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-sm font-semibold text-green-700">Project Leader</span>
                </div>
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{leader.name}</h3>
                  <p className="text-green-600 font-semibold text-lg mb-4">{leader.role}</p>
                  <p className="text-gray-600 leading-relaxed">{leader.bio}</p>
                </div>

                {/* Achievements */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Award className="h-5 w-5 text-green-600 mr-2" />
                    Key Achievements
                  </h4>
                  <div className="space-y-2">
                    {leader.achievements.map((achievement, idx) => (
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
                      href={leader.social.linkedin}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a 
                      href={leader.social.twitter}
                      className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                    <a 
                      href={`mailto:${leader.social.email}`}
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
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-12 text-white text-center">
          <Heart className="h-16 w-16 mx-auto mb-6 text-green-200" />
          <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
          <p className="text-xl text-green-100 max-w-4xl mx-auto leading-relaxed mb-8">
            "We believe that every tree planted today is an investment in Nepal's future. Our mission is to mobilize communities, 
            leverage technology, and create lasting environmental impact across Nepal through the power of collective action and Rotary's service above self."
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105">
              Join Our Mission
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-full font-bold transition-all duration-300">
              Contact Leadership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectLeadership;