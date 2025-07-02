"use client"
import React, { useEffect, useState } from 'react'
import './page.css'
import Navbar from '../components/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import blogImage from '../../../public/Assets/blog_hero.png'
import Footer from '../components/footer'
import blog1 from '../../../public/Assets/carbon-guide.jpg'


const Blog = () => {
  const [posts, setPosts] = useState([])
  const [media, setMedia] = useState([]);


  const fetchMedia = async () => {
    const url = `http://localhost:1337/api/upload/files`;
    const res = await fetch(url, { cache: 'no-store' });
    const mediaData = await res.json();
    setMedia(mediaData);
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await fetch("http://localhost:1337/api/blogs?populate=*")
  //     const response = await data.json()
  //     setPosts(response.data)
  //   }
  //   fetchData()
  //   fetchMedia()
  // }, [])


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar />
      <div className="hero_section_blog">
        <div style={{ width: '20%', height: 'fit-content', marginBlock: 'auto' }}>
          <h1 className='text-6xl font-bold text-color-#065F24'>Carblex <br /> Blog</h1>
          <p style={{ color: 'black' }}>Your Hub for Carbon Markets, Climate Tech, and Green Innovation</p>
        </div>
        <Image src={blogImage} alt='Hero Image' width={400} height={400} />
      </div>

      <h1 className='text-3xl text-green-800 font-lighter text-color-#065F24' style={{ width: '80%', marginInline: 'auto', marginBlock: '2rem' }}>Recent Articles</h1>

      <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ width: '80%', marginInline: 'auto' }}>
        {/* <div>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link href={`/blog/${post.category.slug}/${post.slug}`} key={post.id}>
                <div className="max-w-xs mx-auto bg-transparent" >

                  <div className=" relative w-full h-64 rounded-t-lg">
                    <Image 
                        key={post.id} 
                        src={`http://localhost:1337${post['displayImage'][0]['url']}`} 
                        alt={post.author.name} 
                        fill
                        className="w-64 h-auto"
                    />
                  </div>

                  <div className="mt-4 px-2">
                    <h2 className="text-lg font-semibold text-gray-900 leading-tight">
                      {post.title} <br />
                      Credits: <span className="font-normal text-gray-700">{post.description}</span>
                    </h2>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center col-span-full text-gray-500">Loading...</div>
          )}
        </div> */}

        <Link href={`/blog/carbon-credits-complete-guide`} key={1}>
          <div className="max-w-xs mx-auto bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">

            {/* Image Section */}
            <div className="relative w-full h-64">
              <Image
                key={1}
                src={blog1}
                alt="Prem Kumar"
                fill
                className="object-cover"
              />
            </div>

            {/* Content Section */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Carbon Credits
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                A Complete Guide to the Role, Value, and Market Impact of Carbon Credits.
              </p>
            </div>
          </div>
        </Link>


      </article>
      <div style={{ marginTop: '5rem' }}>
        <Footer />

      </div>
    </div>
  )
}

export default Blog
