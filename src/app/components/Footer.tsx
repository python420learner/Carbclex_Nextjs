import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Globe,
  Shield,
  Award,
  ArrowRight,
  Leaf,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  onAboutClick?: () => void;
}

export default function Footer({ onAboutClick }: FooterProps) {
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('en');
  const [status, setStatus] = useState(null);


  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch(
        `/api/newsletter/subscribe?email=${encodeURIComponent(email)}`,
        {
          method: "POST"
        }
      );

      // ✅ Now backend always returns 200 for already subscribed OR newly subscribed
      const message = await res.text();
      setStatus(message); // Always show backend’s message
      alert(message)
      // setEmail("");       // Optional: clear input

    } catch (err) {
      console.error("Subscription error:", err);
      setStatus("Something went wrong. Please try again.");
    }
  };


  const footerSections = {
    marketplace: {
      title: 'Marketplace',
      links: [
        { label: 'Browse Projects', href: '#projects' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Verification Process', href: '#verification' },
        { label: 'Impact Calculator', href: '#calculator' },
        { label: 'Project Categories', href: '#categories' },
        { label: 'Success Stories', href: '#stories' }
      ]
    },
    developers: {
      title: 'For Developers',
      links: [
        { label: 'Register Project', href: '#register' },
        { label: 'Developer Portal', href: '#portal' },
        { label: 'Verification Guide', href: '#guide' },
        { label: 'Pricing & Fees', href: '#pricing' },
        { label: 'Documentation', href: '#docs' },
        { label: 'Developer Community', href: '#community' }
      ]
    },
    company: {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#about', onClick: onAboutClick },
        { label: 'Our Mission', href: '#mission' },
        { label: 'Leadership Team', href: '#team' },
        { label: 'Careers', href: '#careers' },
        { label: 'Press & Media', href: '#press' },
        { label: 'Investor Relations', href: '#investors' }
      ]
    },
    support: {
      title: 'Support & Resources',
      links: [
        { label: 'Help Center', href: '#help' },
        { label: 'Contact Support', href: '#contact' },
        { label: 'API Documentation', href: '#api' },
        { label: 'System Status', href: '#status' },
        { label: 'Community Forum', href: '#forum' },
        { label: 'Knowledge Base', href: '#knowledge' }
      ]
    }
  };

  const socialLinks = [
    { icon: Facebook, href: '#facebook', label: 'Facebook' },
    { icon: Twitter, href: '#twitter', label: 'Twitter' },
    { icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
    { icon: Instagram, href: '#instagram', label: 'Instagram' }
  ];

  const trustBadges = [
    { icon: Shield, label: 'SOC 2 Certified', color: 'text-green-500' },
    { icon: Award, label: 'Gold Standard', color: 'text-yellow-500' },
    { icon: Leaf, label: 'Verra Verified', color: 'text-blue-500' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Company Info & Newsletter */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">CarbClex</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The world's leading platform for verified carbon offset projects.
                Connecting climate action with real environmental impact since 2020.
              </p>
            </div>

            {/* Newsletter */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-400" />
                Stay Climate Informed
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                Get weekly insights on climate projects, impact stories, and sustainability news.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-green-400" />
                <span>support@carbclex.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-green-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-green-400" />
                <span>San Francisco, CA 94105, USA</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-8 grid md:grid-cols-4 gap-8">
            {Object.entries(footerSections).map(([key, section]) => (
              <div key={key}>
                <h4 className="font-bold mb-4 text-white">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      {link.onClick ? (
                        <button
                          onClick={link.onClick}
                          className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                        >
                          {link.label}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ) : (
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                        >
                          {link.label}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Trust Badges & Certifications */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Trust Badges */}
          <div className="flex items-center gap-8">
            {trustBadges.map((badge, index) => {
              const IconComponent = badge.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <IconComponent className={`w-6 h-6 ${badge.color}`} />
                  <span className="text-gray-400 text-sm">{badge.label}</span>
                </div>
              );
            })}
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div className="text-gray-400 text-sm">
            © 2025 Carbon Marketplace Inc. All rights reserved.
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }, index) => (
              <a
                key={index}
                href={href}
                aria-label={label}
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors group"
              >
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="#privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#cookies" className="text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}