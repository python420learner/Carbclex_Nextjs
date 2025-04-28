"use client"
import React, { useEffect, useState } from 'react'
import './page.css'
import Navbar from '../components/Navbar'
import Image from 'next/image'
import blogImage from '../../../public/Assets/blog_hero.png'

const Blog = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch("http://localhost:1337/api/articles?populate=*")
      const response = await data.json()
      setPosts(response.data)
    }
    fetchData()
  }, [])

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

      <h1 className='text-3xl text-green-800 font-lighter text-color-#065F24' style={{width:'80%',marginInline:'auto',marginBlock:'2rem'}}>Recent Articles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ width: '80%', marginInline: 'auto' }}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div className="max-w-xs mx-auto bg-transparent" key={post.id}>
          {/* Image */}
          <div className="bg-green-800 w-full h-64 rounded-t-lg"></div>

          {/* Text */}
          <div className="mt-4 px-2">
            <h2 className="text-lg font-semibold text-gray-900 leading-tight">
              {post.title} <br />
              Credits: <span className="font-normal text-gray-700">{post.description}</span>
            </h2>
          </div>
        </div>
          ))
        ) : (
          <div className="text-center col-span-full text-gray-500">Loading...</div>
        )}

        
      </div>
    </div>
  )
}

export default Blog
