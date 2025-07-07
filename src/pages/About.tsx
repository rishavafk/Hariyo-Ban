import React from 'react';
import {
  Users,
  Heart,
  TreePine,
  Target,
  Award,
  Globe,
  Shield,
  Handshake,
  Building2,
  CheckCircle
} from 'lucide-react';

const About = () => {
  const rotaryValues = [
    {
      icon: Handshake,
      title: 'Service Above Self',
      description: 'Our commitment to serving communities and protecting the environment for future generations.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: "Part of Rotary International's worldwide network of environmental conservation initiatives."
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Complete accountability in how donations are used and environmental impact is measured.'
    },
    {
      icon: Building2,
      title: 'Community Partnership',
      description: 'Working with local communities, government, and organizations for sustainable change.'
    }
  ];

  const achievements = [
    { icon: TreePine, value: '12,847+', label: 'Trees Planted', color: 'text-green-600' },
    { icon: Users, value: '8,492+', label: 'Community Members', color: 'text-green-600' },
    { icon: Globe, value: '15+', label: 'Districts Covered', color: 'text-green-600' },
    { icon: Award, value: '156 tons', label: 'CO₂ Absorbed', color: 'text-green-600' }
  ];

  const programs = [
    {
      title: 'Community Tree Planting',
      description: 'Organizing local communities to plant native trees in degraded areas.',
      impact: '75% of our total plantings'
    },
    {
      title: 'School Environmental Education',
      description: 'Teaching students about environmental conservation and tree care.',
      impact: '50+ schools reached'
    },
    {
      title: 'Corporate Partnerships',
      description: 'Collaborating with businesses for large-scale reforestation projects.',
      impact: '25+ corporate partners'
    },
    {
      title: 'Research & Monitoring',
      description: 'Scientific monitoring of tree survival rates and environmental impact.',
      impact: '95% tree survival rate'
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <TreePine className="h-16 w-16 text-green-600" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">RC</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-green-600">Rotary Roots</span>
          </h1>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 max-w-4xl mx-auto mb-8">
            <p className="text-xl text-green-800 font-semibold mb-2">A Rotary Club of Kasthamandap Initiative</p>
            <p className="text-green-700 leading-relaxed">
              Rotary Roots is proudly powered by the Rotary Club of Kasthamandap, bringing together our commitment to 
              environmental stewardship with Rotary's global mission of service above self. Together, we're 
              creating a sustainable future for Nepal through community-driven reforestation.
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-12 text-white text-center mb-16">
          <Target className="h-16 w-16 mx-auto mb-6 text-green-200" />
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-green-100 max-w-4xl mx-auto leading-relaxed mb-8">
            "To restore Nepal's forest cover through technology-enabled community participation, creating lasting environmental 
            impact while building awareness about climate change and biodiversity conservation, guided by Rotary's principles 
            of service and fellowship."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-200 mb-2">50,000</div>
              <div className="text-green-100">Trees Goal 2025</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-200 mb-2">75+</div>
              <div className="text-green-100">Districts Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-200 mb-2">100%</div>
              <div className="text-green-100">Transparency</div>
            </div>
          </div>
        </div>

        {/* Rotary Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-green-600">Rotary Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Guided by Rotary International's principles of service, fellowship, and integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {rotaryValues.map((value, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-green-50 to-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                  <value.icon className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {achievements.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Programs */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-green-600">Programs</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive environmental initiatives designed for maximum community impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{program.title}</h3>
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{program.description}</p>
                <div className="bg-green-50 rounded-lg p-3">
                  <span className="text-green-800 font-semibold text-sm">Impact: {program.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-12 text-white text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-600 text-2xl font-bold">RC</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-6">Rotary Club of Kasthamandap Partnership</h2>
          <p className="text-xl text-green-100 max-w-4xl mx-auto leading-relaxed mb-8">
            As a proud initiative of the Rotary Club of Kasthamandap, Rotary Roots leverages Rotary's century-long commitment 
            to community service and environmental stewardship. Our partnership ensures transparency, accountability, 
            and sustainable impact in every tree planted.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Learn About Rotary
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300">
              Join Our Mission
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <Heart className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Our Environmental Mission</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Every tree planted is a step towards a greener Nepal. Join the Rotary Club of Kasthamandap's environmental 
            initiative and make a lasting impact on our country's future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Planting Trees
            </button>
            <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
