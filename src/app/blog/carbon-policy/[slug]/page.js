"use client"
import React, { useState, useEffect } from 'react';
import MarkdownHTML from '../../../components/MarkdownHTML';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/footer';

const Page = ({ params }) => {

  const { slug } = React.use(params);
  const [blog, setBlog] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try{
      const url = `http://localhost:1337/api/blogs?sort[0]=title:asc&filters[slug][$eq]=${slug}&status=published&locale[0]=en&populate=*`;
      const data = await fetch(url, { cache: 'no-store' });
      const blog = await data.json();
      setBlog(blog);

    }catch (err) {
      console.error("Error fetching post:", err);
    } finally {
      setLoading(false)
    // document.title = `${blog.data[0].title} | No Title`;
    };
  }

  useEffect(() => {
    fetchData();
  }, [])

  if(!loading){

    console.log(blog['data'][0]['displayImage'][0]['url'])
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {loading ? (
        <p>Loading Posts.....</p>
      ):(
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4" style={{ marginInline: 'auto' }}>

          {/* Blog Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 text-center cursor-default leading-tight">
            {blog?.data[0]?.title}
          </h1>

          {/* Author and Date */}
          <div className="flex flex-col items-center text-gray-600 mb-8 space-y-1 cursor-default">
            <p className="text-md font-medium">
              Written by {blog?.data[0]?.author?.name}
            </p>
            <p className="text-sm">Published on October 6, 2024</p>
          </div>

          {/* Cover Image */}
          {blog?.data[0]?.displayImage[0]?.url && (
            <div className="flex justify-center mb-10">
               
              <Image
                key={blog.data[0].id}
                src={`http://localhost:1337${blog['data'][0]['displayImage'][0]['url']}`}
                alt={blog.data[0].title || "Cover Image"}
                width={800}
                height={500}
                className="rounded-lg shadow-lg w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="bg-white p-6 md:p-10 rounded-xl shadow-md space-y-6">
            {blog?.data[0]?.blocks.map((item) => {
              switch (item["__component"]) {
                case "shared.rich-text":
                  return (
                    <div key={item.id} className="prose max-w-none">
                      <MarkdownHTML markdown={item.body} />
                    </div>
                  );

                case "shared.quote":
                  return (
                    <blockquote
                      key={item.id}
                      className="border-l-4 border-blue-500 pl-4 italic text-gray-700"
                    >
                      <p>“{item.body}”</p>
                      <footer className="text-right mt-2 text-sm font-semibold">
                        — {item.title}
                      </footer>
                    </blockquote>
                  );

                case "shared.slider":
                  return (
                    <div
                      key={item.id}
                      className="bg-gray-50 border border-dashed border-gray-300 p-6 rounded-lg text-center text-gray-600"
                    >
                      <p>[ Slider content goes here ]</p>
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </div>
        </div>
        <div style={{ marginTop: '5rem' }}>
          <Footer />

        </div>
      </div>
      )};
    </div>
  )
}

export default Page