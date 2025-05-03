"use client"
import React, { useState, useEffect } from 'react';
import MarkdownHTML from '../../components/MarkdownHTML';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/footer';


export default function Page({ params }) {
    const { slug } = React.use(params);
    const [response, setBlog] = useState();
    const [postResponse, setPost] = useState();
    const [media, setMedia] = useState([]);

    // Fetch blog data
    const fetchData = async () => {
        const url = `http://localhost:1337/api/articles?sort[0]=title:asc&filters[slug][$eq]=${slug}&status=published&locale[0]=en&populate=*`;
        const data = await fetch(url, { cache: 'no-store' });
        const response = await data.json();
        setBlog(response);
        document.title = `${response.data[0].title} | No Title`;
    };


    // Fetch related posts
    const fetchPosts = async () => {
        const url = `http://localhost:1337/api/articles?populate=*`;
        const data2 = await fetch(url, { cache: 'no-store' });
        const postResponse = await data2.json();
        setPost(postResponse);
    };


    const fetchMedia = async () => {
        const url = `http://localhost:1337/api/upload/files`;
        const res = await fetch(url, { cache: 'no-store' });
        const mediaData = await res.json();
        setMedia(mediaData);
    };



    useEffect(() => {
        fetchData();
        fetchPosts();
        fetchMedia();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4" style={{ marginInline: 'auto' }}>

                {/* Blog Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 text-center cursor-default leading-tight">
                    {response?.data[0]?.title}
                </h1>

                {/* Author and Date */}
                <div className="flex flex-col items-center text-gray-600 mb-8 space-y-1 cursor-default">
                    <p className="text-md font-medium">
                        Written by {response?.data[0]?.author?.name}
                    </p>
                    <p className="text-sm">Published on October 6, 2024</p>
                </div>

                {/* Cover Image */}
                {response?.data[0]?.cover?.url && (
                    <div className="flex justify-center mb-10">
                        <Image
                            key={response.data[0].id}
                            src={`http://localhost:1337${response.data[0].cover.url}`}
                            alt={response.data[0].title || "Cover Image"}
                            width={800}
                            height={500}
                            className="rounded-lg shadow-lg w-full h-auto object-cover max-h-[500px]"
                        />
                    </div>
                )}

                {/* Blog Content */}
                <div className="bg-white p-6 md:p-10 rounded-xl shadow-md space-y-6">
                    {response?.data[0]?.blocks.map((item) => {
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

                {/* Related Posts */}
                <div className="mt-16">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
                        Related Posts
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {postResponse?.data.map((data) => (
                            <Link href={`/blogpost/${data.slug}`} key={data.id}>
                                <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition duration-300 cursor-pointer hover:scale-[1.02]">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {data.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {data.description.split(" ").length > 6
                                            ? data.description.split(" ").slice(0, 11).join(" ") + "..."
                                            : data.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ marginTop: '5rem' }}>
                <Footer />

            </div>
        </div>
    );
}