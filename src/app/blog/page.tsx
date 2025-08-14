"use client"
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
// import { ImageWithFallback } from './figma/ImageWithFallback';/
import { Calendar, MapPin, User, TrendingUp, Globe, Leaf, Clock, ArrowRight, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import blogImage from '../../../public/Assets/blog_hero.png'
import blog1 from '../../../public/Assets/carbon-guide.jpg'
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ArticleReadPage from '../components/ArticleReadPage';

// interface BlogPost {
//   id: string;
//   title: string;
//   excerpt: string;
//   category: string;
//   location: string;
//   publishDate: string;
//   author: string;
//   readTime: string;
//   image: string;
//   featured?: boolean;
//   views: number;
//   link: string
// }

const blogPosts = [
  // Recent Articles
  // {
  //   id: '1',
  //   title: 'Understanding Carbon Credits: A Beginner\'s Guide',
  //   excerpt: 'Learn the fundamentals of carbon credits, how they work, and their role in combating climate change through verified environmental projects.',
  //   category: 'Education',
  //   location: 'Global',
  //   publishDate: '2024-03-15',
  //   author: 'Sarah Chen',
  //   readTime: '8 min read',
  //   image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&h=400&fit=crop',
  //   featured: true,
  //   views: 12450,
  //   link: "stsots"
  // },
  {
    id: '1',
    title: 'Carbon Credits',
    excerpt: 'A Complete Guide to the Role, Value, and Market Impact of Carbon Credits.',
    category: 'Technology',
    location: 'India',
    publishDate: '2024-03-12',
    author: 'Dr. Michael Rodriguez',
    readTime: '6 min read',
    image: "Assets/carbon-guide.jpg",
    views: 8920,
    link:"/blog/carbon-credits-complete-guide"
  },
  // {
  //   id: '3',
  //   title: 'Regenerative Agriculture: Healing Our Soils',
  //   excerpt: 'How regenerative farming practices are transforming agriculture while capturing carbon and restoring ecosystem health.',
  //   category: 'Agriculture',
  //   location: 'Australia',
  //   publishDate: '2024-03-10',
  //   author: 'Emma Thompson',
  //   readTime: '10 min read',
  //   image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
  //   views: 6780,
  //   link: "stsots"
  // },
  // // Recent News
  // {
  //   id: '4',
  //   title: 'Major Corporations Commit to Net-Zero by 2030',
  //   excerpt: 'Fortune 500 companies announce unprecedented climate commitments, driving demand for verified carbon offset projects worldwide.',
  //   category: 'Corporate',
  //   location: 'New York',
  //   publishDate: '2024-03-08',
  //   author: 'James Kim',
  //   readTime: '4 min read',
  //   image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
  //   views: 15670,
  //   link: "stsots"
  // },
  // {
  //   id: '5',
  //   title: 'Breakthrough in Methane Capture Efficiency',
  //   excerpt: 'Scientists achieve 95% methane capture rates using revolutionary catalytic technology, significantly reducing greenhouse gas emissions.',
  //   category: 'Innovation',
  //   location: 'Fort Worth, TX',
  //   publishDate: '2024-03-05',
  //   author: 'Dr. Amara Okafor',
  //   readTime: '7 min read',
  //   image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop',
  //   views: 11200,
  //   link: "stsots"
  // },
  // {
  //   id: '6',
  //   title: 'Indigenous Communities Lead Forest Conservation',
  //   excerpt: 'Traditional ecological knowledge combines with modern technology to protect 50 million hectares of biodiverse forests.',
  //   category: 'Conservation',
  //   location: 'Brazil',
  //   publishDate: '2024-03-03',
  //   author: 'Carlos Mendoza',
  //   readTime: '9 min read',
  //   image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
  //   views: 9340,
  //   link: "stsots"
  // },
  // // Global Market
  // {
  //   id: '7',
  //   title: 'Carbon Credit Prices Surge 40% in Q1 2024',
  //   excerpt: 'Increasing regulatory pressure and corporate commitments drive unprecedented growth in voluntary carbon market pricing.',
  //   category: 'Market Analysis',
  //   location: 'London',
  //   publishDate: '2024-03-01',
  //   author: 'Rachel Foster',
  //   readTime: '5 min read',
  //   image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop',
  //   views: 18920,
  //   link: "stsots"
  // },
  // {
  //   id: '8',
  //   title: 'Asia-Pacific Leads Global Carbon Investment',
  //   excerpt: 'Regional governments and private sector invest $12 billion in carbon offset projects, setting new market standards.',
  //   category: 'Investment',
  //   location: 'Singapore',
  //   publishDate: '2024-02-28',
  //   author: 'Li Wei',
  //   readTime: '6 min read',
  //   image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&h=400&fit=crop',
  //   views: 13480,
  //   link: "stsots"
  // },
  // {
  //   id: '9',
  //   title: 'New Blockchain Platform Enhances Credit Transparency',
  //   excerpt: 'Revolutionary distributed ledger system ensures complete traceability and prevents double-counting in carbon markets.',
  //   category: 'Blockchain',
  //   location: 'Silicon Valley',
  //   publishDate: '2024-02-25',
  //   author: 'Alex Rivera',
  //   readTime: '8 min read',
  //   image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
  //   views: 10750,
  //   link: "stsots"
  // }
];

// Enhanced hero illustration component
function HeroIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Main circular background */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-80 h-80 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center shadow-2xl"
      >
        {/* Earth/Globe in center */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <Globe className="w-16 h-16 text-white" />
        </motion.div>

        {/* Floating CO2 indicators */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-8 -right-6 bg-white rounded-full p-3 shadow-lg border-2 border-green-200"
        >
          <div className="text-green-600 font-semibold text-sm">CO₂</div>
        </motion.div>

        {/* Growth arrow */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute top-6 right-8 bg-green-600 rounded-full p-2 shadow-lg"
        >
          <TrendingUp className="w-6 h-6 text-white" />
        </motion.div>

        {/* Leaves decoration */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-4 -left-6 bg-green-500 rounded-full p-2 shadow-lg"
        >
          <Leaf className="w-6 h-6 text-white" />
        </motion.div>

        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 2 }}
          className="absolute bottom-8 right-12 bg-green-400 rounded-full p-2 shadow-lg"
        >
          <Leaf className="w-4 h-4 text-white" />
        </motion.div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(i) * 10, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            className="absolute w-2 h-2 bg-green-400 rounded-full opacity-50"
            style={{
              top: `${20 + (i % 3) * 20}%`,
              left: `${10 + i * 15}%`,
            }}
          />
        ))}
      </motion.div>

      {/* Background decoration circles */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute w-96 h-96 bg-gradient-to-r from-green-50 to-blue-50 rounded-full -z-10 opacity-50"
      />
    </div>
  );
}

// Blog post card component with click functionality
function BlogCard({ post, index }) {
  const [activePage, setActivePage] = useState('blog');
  const [article, setCurrentArticle] = useState(null);
  const router = useRouter();

  const handleBlogClick = (post)=>{
    setActivePage('blog-detail')
    setCurrentArticle(post)
  }

  const handleNavigateToBlog = ()=>{
    setCurrentArticle(null)
    setActivePage(null)
    router.push('/blog')
  }

  if (activePage === 'blog-detail' && article) {
      // return (
      //   <ArticleReadPage 
      //     article={article}
      //     onBack={handleNavigateToBlog}
      //   />
      // );
    }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <Link href={post.link}><Card
        className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group bg-white cursor-pointer"
        onClick={() => handleBlogClick(post)}
      >
        <div className="relative overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {post.featured && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-green-600 text-white px-2 py-1">
                Featured
              </Badge>
            </div>
          )}
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {post.views.toLocaleString()}
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
              {post.category}
            </Badge>
            <div className="flex items-center text-xs text-gray-500 gap-1">
              <MapPin className="w-3 h-3" />
              {post.location}
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
            {post.title}
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {post.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(post.publishDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </div>
          </div>
        </CardContent>
      </Card>
      </Link>
    </motion.div>
  );
}

// Index page of Blog Section
export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const recentArticles = blogPosts.slice(0, 3);
  const recentNews = blogPosts.slice(3, 6);
  const globalMarket = blogPosts.slice(6, 9);

  // const handleCardClick = (article: BlogPost) => {
  //   if (onArticleClick) {
  //     onArticleClick(article);
  //   }
  // };

  return (
    <div className="min-h-screen bg-white">
      <Navbar activePage='blog' />
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-green-600 leading-tight">
                    CarbClex
                    <span className="block text-gray-900">Blog</span>
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-lg"
                >
                  Your Hub for Carbon Markets, Climate Tech, and Green Innovation
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-4 pt-4"
                >
                  <Badge className="bg-green-100 text-green-800 px-4 py-2 text-base">
                    Latest Research
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-base">
                    Market Insights
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-base">
                    Technology Updates
                  </Badge>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="pt-6"
                >
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl shadow-lg font-semibold"
                    onClick={() => document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Start Reading
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-96 lg:h-[500px]"
            >
              <HeroIllustration />
            </motion.div>
          </div>
        </div>
      </section>
      {/* <Link href={`/blog/carbon-credits-complete-guide`} key={1}>
      </Link> */}

      {/* Recent Articles Section */}
      <section id="articles" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-green-600 mb-4">
              RECENT ARTICLES
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              In-depth analysis and educational content about carbon markets and climate solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent News Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-green-600 mb-4">
              RECENT NEWS
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Latest developments and breaking news from the climate action front
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentNews.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Global Market Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-green-600 mb-4">
              GLOBAL MARKET
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Market trends, pricing analysis, and investment insights in the carbon economy
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {globalMarket.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index}/>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <Footer />
      </motion.div>
      {/* <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Stay Updated with Climate Innovation
            </h2>
            <p className="text-xl text-green-100 leading-relaxed max-w-2xl mx-auto">
              Get the latest insights, market analysis, and breakthrough technologies delivered to your inbox weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-xl border-0 text-gray-900 focus:ring-2 focus:ring-white/50 outline-none"
              />
              <Button className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 rounded-xl font-semibold">
                Subscribe
              </Button>
            </div> *
        </div>
      </section> */}
    </div>
  );
}

// Export the BlogPost interface and blogPosts data for use in other components
// export type { BlogPost };
// export { blogPosts };












// "use client"
// import React, { useEffect, useState } from 'react'
// import './page.css'
// import Navbar from '../components/Navbar'
// import Image from 'next/image'
// import Link from 'next/link'
// import blogImage from '../../../public/Assets/blog_hero.png'
// import blog1 from '../../../public/Assets/carbon-guide.jpg'
// import Footer from '../components/Footer'


// const Blog = () => {
//   const [posts, setPosts] = useState([])
//   const [media, setMedia] = useState([]);


//   const fetchMedia = async () => {
//     const url = `http://localhost:1337/api/upload/files`;
//     const res = await fetch(url, { cache: 'no-store' });
//     const mediaData = await res.json();
//     setMedia(mediaData);
//   };
//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     const data = await fetch("http://localhost:1337/api/blogs?populate=*")
//   //     const response = await data.json()
//   //     setPosts(response.data)
//   //   }
//   //   fetchData()
//   //   fetchMedia()
//   // }, [])


//   return (
//     <div className="min-h-screen bg-gray-100 ">
//       <Navbar activePage="blog"/>
//       <div className="hero_section_blog">
//         <div style={{ width: '20%', height: 'fit-content', marginBlock: 'auto' }}>
//           <h1 className='text-6xl font-bold text-color-#065F24'>Carblex <br /> Blog</h1>
//           <p style={{ color: 'black' }}>Your Hub for Carbon Markets, Climate Tech, and Green Innovation</p>
//         </div>
//         <Image src={blogImage} alt='Hero Image' width={400} height={400} />
//       </div>

//       <h1 className='text-3xl text-green-800 font-lighter text-color-#065F24' style={{ width: '80%', marginInline: 'auto', marginBlock: '2rem' }}>Recent Articles</h1>

//       <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ width: '80%', marginInline: 'auto' }}>
//         {/* <div>
//           {posts.length > 0 ? (
//             posts.map((post) => (
//               <Link href={`/blog/${post.category.slug}/${post.slug}`} key={post.id}>
//                 <div className="max-w-xs mx-auto bg-transparent" >

//                   <div className=" relative w-full h-64 rounded-t-lg">
//                     <Image 
//                         key={post.id} 
//                         src={`http://localhost:1337${post['displayImage'][0]['url']}`} 
//                         alt={post.author.name} 
//                         fill
//                         className="w-64 h-auto"
//                     />
//                   </div>

//                   <div className="mt-4 px-2">
//                     <h2 className="text-lg font-semibold text-gray-900 leading-tight">
//                       {post.title} <br />
//                       Credits: <span className="font-normal text-gray-700">{post.description}</span>
//                     </h2>
//                   </div>
//                 </div>
//               </Link>
//             ))
//           ) : (
//             <div className="text-center col-span-full text-gray-500">Loading...</div>
//           )}
//         </div> */}

//         <Link href={`/blog/carbon-credits-complete-guide`} key={1}>
//           <div className="max-w-xs mx-auto bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">

//             {/* Image Section */}
//             <div className="relative w-full h-64">
//               <Image
//                 key={1}
//                 src={blog1}
//                 alt="Prem Kumar"
//                 fill
//                 className="object-cover"
//               />
//             </div>

//             {/* Content Section */}
//             <div className="p-4">
//               <h2 className="text-lg font-semibold text-gray-900 mb-2">
//                 Carbon Credits
//               </h2>
//               <p className="text-sm text-gray-600 leading-relaxed">
//                 A Complete Guide to the Role, Value, and Market Impact of Carbon Credits.
//               </p>
//             </div>
//           </div>
//         </Link>


//       </article>
//       <div style={{ marginTop: '5rem' }}>
//         <Footer />

//       </div>
//     </div>
//   )
// }

// export default Blog
