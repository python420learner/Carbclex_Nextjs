import { Button } from './ui/button';
import { ArrowRight, CheckCircle, Upload, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

export default function DeveloperSection({handleRegisterProject}) {
  const steps = [
    {
      number: '1',
      title: 'Create Account',
      description: 'Register and complete your developer profile with project credentials',
      icon: Upload
    },
    {
      number: '2', 
      title: 'Submit Project',
      description: 'Upload documentation, methodology, and impact projections',
      icon: Upload
    },
    {
      number: '3',
      title: 'Verification',
      description: 'Independent third-party verification and validation process',
      icon: ShieldCheck
    },
    {
      number: '4',
      title: 'Go Live',
      description: 'Launch on marketplace and start selling verified carbon credits',
      icon: Zap
    }
  ];

  const benefits = [
    'Global marketplace reach',
    'Transparent verification process',
    'Competitive commission rates',
    'Marketing and promotion support',
    'Real-time analytics dashboard',
    'Secure payment processing',
    'Ongoing monitoring support',
    'Community of verified developers'
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-green-900 to-blue-900 text-white overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full mb-6">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">For Project Developers</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Are You a
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                  Project Developer?
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 leading-relaxed">
                Join our verified marketplace and turn your environmental projects into 
                a sustainable revenue stream through our streamlined certification process.
              </p>
            </div>

            {/* Process Steps */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Simple 4-Step Process</h3>
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.number} className="flex items-start gap-4 relative">
                    {/* Step Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center font-bold text-lg">
                        {step.number}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold">{step.title}</h4>
                        <IconComponent className="w-5 h-5 text-green-400" />
                      </div>
                      <p className="text-gray-300">{step.description}</p>
                    </div>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-green-500 to-blue-500 opacity-50" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Benefits Grid */}
            <div>
              <h3 className="text-xl font-bold mb-4">Why Choose Our Platform</h3>
              <div className="grid grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - CTA */}
          <div className="space-y-8">
            {/* Main CTA Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-3">
                    Ready to Monetize Your Climate Impact?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Transform your environmental projects into verified carbon credits 
                    and reach a global audience of climate-conscious buyers.
                  </p>
                </div>

                <Button 
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all group"
                  onClick={handleRegisterProject}
                >
                  Register Your Project
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">
                    Join 500+ verified project developers worldwide
                  </p>
                  <div className="flex justify-center items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />
                    ))}
                    <span className="ml-2 text-gray-300 text-sm">4.9/5 developer satisfaction</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">$2.5B+</p>
                <p className="text-gray-400 text-sm">Credits Traded</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">150+</p>
                <p className="text-gray-400 text-sm">Countries</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">50M+</p>
                <p className="text-gray-400 text-sm">Tons Offset</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h4 className="font-semibold mb-3">Need Help Getting Started?</h4>
              <p className="text-gray-300 text-sm mb-4">
                Our developer success team is here to guide you through the process.
              </p>
              <Button variant="outline" className="w-full border-green-400 text-green-400 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all">
                Schedule a Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}