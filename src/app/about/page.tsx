"use client"
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
// import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Leaf, 
  Shield, 
  Lightbulb, 
  Users, 
  Target, 
  CheckCircle, 
  Eye,
  Globe,
  ArrowLeft,
  ArrowRight,
  Star,
  Award,
  Zap,
  Heart,
  TrendingUp,
  TreePine,
  Building,
  Handshake,
  Rocket,
  MapPin,
  Calendar,
  PieChart
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

// interface AboutUsProps {
//   onBack: () => void;
// }

const values = [
  {
    icon: Eye,
    title: "Transparency",
    description: "We believe transparency builds trust. Our platform provides detailed insights into every project, ensuring that your contribution genuinely makes a difference.",
    color: "bg-blue-500"
  },
  {
    icon: Shield,
    title: "Integrity", 
    description: "Every project listed is rigorously vetted and verified. We uphold the highest standards of accountability to guarantee the authenticity of our carbon credits.",
    color: "bg-green-500"
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Combining technology with sustainability, we continuously enhance our platform, ensuring seamless transactions and reliable tracking for maximum impact.",
    color: "bg-purple-500"
  },
  {
    icon: Users,
    title: "Community",
    description: "Our strength lies in collaboration. We nurture relationships between project owners, businesses, and individuals to create a unified front against climate change.",
    color: "bg-orange-500"
  }
];

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-Founder",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face",
    description: "Environmental scientist with 15+ years in climate policy and sustainable technology.",
    expertise: ["Climate Policy", "Environmental Science", "Strategic Leadership"]
  },
  {
    name: "Michael Rodriguez",
    role: "CTO & Co-Founder", 
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    description: "Tech innovator specialized in blockchain, AI, and sustainable finance platforms.",
    expertise: ["Blockchain Technology", "AI Development", "Fintech"]
  },
  {
    name: "Dr. Amara Okafor",
    role: "Head of Verification",
    image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=face", 
    description: "Carbon market expert with PhD in Environmental Engineering and 12 years at major verification bodies.",
    expertise: ["Carbon Verification", "Environmental Engineering", "Quality Assurance"]
  },
  {
    name: "James Kim",
    role: "Head of Partnerships",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    description: "Business development leader connecting global projects with sustainable investment opportunities.",
    expertise: ["Business Development", "Global Partnerships", "Impact Investment"]
  }
];

const achievements = [
  { number: "2.5M+", label: "Tons CO₂ Offset", icon: Leaf, color: "text-green-600" },
  { number: "150+", label: "Verified Projects", icon: CheckCircle, color: "text-blue-600" },
  { number: "50+", label: "Countries", icon: Globe, color: "text-purple-600" },
  { number: "1000+", label: "Trusted Partners", icon: Users, color: "text-orange-600" }
];

const storyTimeline = [
  {
    year: "2020",
    title: "The Vision",
    description: "Our founders identified the need for transparency and integrity in the carbon credit market.",
    icon: Lightbulb,
    color: "bg-yellow-500",
    image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=600&h=400&fit=crop"
  },
  {
    year: "2021",
    title: "First Platform",
    description: "Launched our initial marketplace with 25 verified projects across 10 countries.",
    icon: Rocket,
    color: "bg-blue-500",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
  },
  {
    year: "2022",
    title: "Global Expansion",
    description: "Expanded to 50+ countries and partnered with major verification bodies.",
    icon: Globe,
    color: "bg-green-500",
    image: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=600&h=400&fit=crop"
  },
  {
    year: "2023",
    title: "Community Growth",
    description: "Reached 1000+ trusted partners and facilitated 2M+ tons of CO₂ offset.",
    icon: Users,
    color: "bg-purple-500",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&fit=crop"
  },
  {
    year: "2024",
    title: "Innovation Leadership",
    description: "Introduced AI-powered verification and blockchain-based tracking systems.",
    icon: Zap,
    color: "bg-orange-500",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop"
  }
];

const whyChooseUs = [
  {
    icon: Award,
    title: "Verified Impact",
    description: "Every project is meticulously evaluated for real environmental benefit"
  },
  {
    icon: Eye,
    title: "Transparency at Every Step", 
    description: "Track your contributions clearly and confidently"
  },
  {
    icon: Users,
    title: "Global Community",
    description: "Be part of an engaged community actively transforming sustainability into reality"
  }
];

// Interactive Story Timeline Component
function InteractiveStoryTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div ref={timelineRef} className="relative py-20">
      {/* Progress Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200">
        <motion.div 
          className="h-full w-full bg-gradient-to-b from-green-500 to-blue-500 origin-top"
          style={{ scaleY: scrollYProgress }}
        />
      </div>

      <div className="space-y-20">
        {storyTimeline.map((item, index) => {
          const isLeft = index % 2 === 0;
          const ItemIcon = item.icon;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'} gap-8`}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {/* Content */}
              <div className={`flex-1 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
                >
                  <Badge className={`${item.color} text-white mb-4`}>
                    {item.year}
                  </Badge>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{item.description}</p>
                  
                  {/* Interactive Image */}
                  <div className="relative overflow-hidden rounded-xl">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      /> */}
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              </div>

              {/* Center Icon */}
              <motion.div
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`relative z-10 w-16 h-16 ${item.color} rounded-full flex items-center justify-center shadow-lg border-4 border-white`}
              >
                <ItemIcon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Spacer for other side */}
              <div className="flex-1" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Floating Elements Component
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-4 h-4 rounded-full ${
            i % 3 === 0 ? 'bg-green-400' : i % 3 === 1 ? 'bg-blue-400' : 'bg-purple-400'
          } opacity-20`}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 100 - 50, 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            delay: i * 2,
          }}
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
        />
      ))}
    </div>
  );
}

export default function AboutUs() {
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const nextTeamMember = () => {
    setCurrentTeamIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevTeamMember = () => {
    setCurrentTeamIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4fff6] to-white">
      {/* Navigation Header */}
      {/* <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href='/marketplace'><Button variant="ghost" onClick={onBack} className="flex items-center gap-2 hover:bg-green-50">
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Button></Link>
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-600" />
            <span className="font-semibold text-lg">CarbClex</span>
          </div>
        </div>
      </div> */}
      <div className='nav_bar'>
        <Navbar activePage="about"/>
      </div>

      {/* Dynamic Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50" />
          <FloatingElements />
          
          {/* Dynamic Globe */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-green-400/20 to-blue-400/20 blur-3xl"
          />
          
          {/* Pulsing Circles */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-green-300/30 to-transparent"
          />
        </div>

        <motion.div 
          style={{ y, opacity }}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 text-lg">
              <Globe className="w-5 h-5 mr-2" />
              Leading Carbon Marketplace
            </Badge>
          </motion.div>

          {/* Main Headline with Typing Effect */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="block text-gray-900">We Are</span>
              <span className="block bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                CarbClex
              </span>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="block text-2xl md:text-3xl lg:text-4xl font-normal text-gray-600 mt-4"
              >
                Your Gateway to Real Climate Action
              </motion.span>
            </h1>
          </motion.div>

          {/* Animated Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            More than a marketplace—we are a movement dedicated to a sustainable future, 
            connecting individuals, businesses, and communities to trusted carbon offsetting projects worldwide.
          </motion.p>

          {/* Interactive Achievement Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          >
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <motion.div
                  key={achievement.label}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                  >
                    <IconComponent className={`w-10 h-10 ${achievement.color} mx-auto mb-4`} />
                  </motion.div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
                    className="text-3xl font-bold text-gray-900"
                  >
                    {achievement.number}
                  </motion.div>
                  <div className="text-sm text-gray-600 mt-2">{achievement.label}</div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/marketplace"><Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-lg"
              >
                Explore Our Marketplace
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button></Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:bg-white hover:border-green-500 hover:text-green-700 px-8 py-4 rounded-xl bg-white/60 backdrop-blur-sm shadow-lg"
              >
                Learn Our Story
                <Heart className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full p-1">
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-gray-400 rounded-full mx-auto"
            />
          </div>
        </motion.div>
      </section>

      {/* Interactive Our Story */}
      <section id="story" className="relative py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-blue-100 text-blue-700 mb-4" variant="secondary">
              Our Journey
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A journey of innovation, transparency, and unwavering commitment to climate action
            </p>
          </motion.div>

          <InteractiveStoryTimeline />

          {/* Story Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="max-w-3xl mx-auto"
              >
                <Target className="w-16 h-16 text-green-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Today and Beyond</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Today, CarbClex stands as a beacon of authenticity in the carbon market, 
                  rooted firmly in trust and transparency, championing verified environmental impact. 
                  Our journey continues as we innovate and expand, bringing climate action to every corner of the globe.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.8 }}
            >
              <Target className="w-16 h-16 text-green-600 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              To simplify and democratize carbon offsetting by providing a transparent, reliable 
              marketplace that facilitates meaningful climate action for individuals, businesses, 
              and project owners worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at CarbClex
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="h-full p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="p-0">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`w-12 h-12 ${value.color} rounded-lg flex items-center justify-center mb-4`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              CarbClex is powered by a dynamic team of environmentalists, technology experts, 
              and business strategists, each driven by the shared purpose of achieving genuine environmental impact.
            </p>
          </motion.div>

          {/* Team Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <motion.div
              key={currentTeamIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white border-0 shadow-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-64 md:h-auto">
                      {/* <ImageWithFallback
                        src={teamMembers[currentTeamIndex].image}
                        alt={teamMembers[currentTeamIndex].name}
                        className="w-full h-full object-cover"
                      /> */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {teamMembers[currentTeamIndex].name}
                      </h3>
                      <p className="text-green-600 font-semibold mb-4">
                        {teamMembers[currentTeamIndex].role}
                      </p>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {teamMembers[currentTeamIndex].description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {teamMembers[currentTeamIndex].expertise.map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-green-100 text-green-700">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-center items-center mt-8 gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevTeamMember}
                className="w-10 h-10 rounded-full p-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex gap-2">
                {teamMembers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTeamIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTeamIndex ? 'bg-green-600 w-6' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextTeamMember}
                className="w-10 h-10 rounded-full p-0"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose CarbClex */}
      <section id="why-choose" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Why Choose CarbClex?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              When you partner with CarbClex, you choose more than just carbon credits; you invest in:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {whyChooseUs.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200"
                  >
                    <IconComponent className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-2xl font-semibold text-gray-900 mb-8">
              Together, we can redefine sustainability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section id="join" className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=1600&h=900&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-16 h-16 mx-auto mb-6 opacity-90" />
            </motion.div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Join Us</h2>
            <p className="text-xl mb-8 leading-relaxed opacity-90">
              Your journey toward sustainability starts here. Whether you're a business aiming for net-zero, 
              a project owner driving impactful change, or an individual passionate about climate action—CarbClex 
              is your trusted partner.
            </p>
            <p className="text-lg mb-10 opacity-90">
              Join us in crafting a sustainable legacy for future generations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/marketplace"><Button 
                  size="lg" 
                  className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-3"
                >
                  Get Started Now
                </Button></Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-black hover:bg-white/10 px-8 py-3"
                >
                  Learn More
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}