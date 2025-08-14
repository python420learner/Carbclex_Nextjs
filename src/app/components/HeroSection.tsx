import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, ArrowRight, Globe, TrendingUp, Shield, Users, Leaf, Menu } from 'lucide-react';
import Link from 'next/link';
import Navbar from './Navbar';

interface HeroSectionProps {
  offsetCounter: number;
  onAboutClick?: () => void;
  onCalculatorClick?: () => void;
  onBlogClick?: () => void;
  onSignInClick?: () => void;
}

export default function HeroSection({ offsetCounter, onAboutClick, onCalculatorClick, onBlogClick, onSignInClick }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 overflow-hidden">
      {/* Navigation Header */}
      {/* <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Leaf className="w-8 h-8 text-green-600" />
          <span className="text-2xl font-bold text-gray-900">CarbClex</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => window.location.reload()}
            className="text-green-600 font-semibold hover:text-green-700 transition-colors"
          >
            Home
          </button>
          <Link href="/about"><button 
            className="text-gray-700 hover:text-green-600 transition-colors"
          >
            About
          </button></Link>
          <button 
            onClick={onCalculatorClick}
            className="text-gray-700 hover:text-green-600 transition-colors"
          >
            Carbon Calculator
          </button>
          <button 
            onClick={() => document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-gray-700 hover:text-green-600 transition-colors"
          >
            Marketplace
          </button>
          <button 
            onClick={onBlogClick}
            className="text-gray-700 hover:text-green-600 transition-colors"
          >
            Blog
          </button>
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700"
            onClick={onSignInClick}
          >
            Sign In
          </Button>
        </div>
        
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </nav> */}
      <div className='nav_bar'>

        <Navbar activePage="marketplace"/>
      </div>
      <div className="py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-8">
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">Verified Global Carbon Marketplace</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Fight Climate Change
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              One Credit at a Time
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Connect with verified carbon offset projects worldwide. Every purchase creates 
            measurable environmental impact and supports sustainable development.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-green-600 transition-colors" />
              <Input
                type="text"
                placeholder="Search by project type, location, or impact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-6 text-lg bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
              />
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all group"
              onClick={() => document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Projects
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link href="/calculator"><Button 
              variant="outline" 
              size="lg"
              className="border-2 border-gray-300 text-gray-700 hover:bg-white hover:border-green-500 hover:text-green-700 px-8 py-4 rounded-xl bg-white/60 backdrop-blur-sm shadow-lg transition-all"
            >
              Calculate My Impact
            </Button></Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Real-time Counter */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{offsetCounter.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">Tons CO₂ Offset</p>
                <p className="text-xs text-green-600 mt-1">Updated live</p>
              </div>
            </div>

            {/* Projects Count */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">150+</p>
                <p className="text-sm text-gray-600 mt-1">Global Projects</p>
                <p className="text-xs text-blue-600 mt-1">Across 50+ countries</p>
              </div>
            </div>

            {/* Verification */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-gray-600 mt-1">Verified Impact</p>
                <p className="text-xs text-purple-600 mt-1">Third-party certified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full p-1">
          <div className="w-1 h-3 bg-gray-400 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
      </div>
    </section>
  );
}