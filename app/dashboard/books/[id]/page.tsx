'use client'

import React from 'react'
import DOMPurify from 'isomorphic-dompurify'
import { BookOpen, User, Calendar } from 'lucide-react'
import useFetchData from '@/hooks/use-fetch-data'
import Image from 'next/image'

interface Book {
  id: string
  title: string
  imageUrl: string
  author: string
  category: string
  content: string
  description: string
  userId: string
  createdAt: string
  updatedAt: string
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data, isLoading, isError } = useFetchData({ tags: "book", endpointOptions: `/books/${id}` });
  if(isLoading) return <p>Loading...</p>
  if(isError) return <p>Error loading book data</p>

const book = data.data as Book
  const sanitizedContent = DOMPurify.sanitize(book.content)

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <div className="max-w-4xl md:max-w-none w-full  mx-auto h-full bg-white shadow rounded-lg overflow-hidden">
        <div className="md:flex flex-col lg:flex-row">
          <div className="md:flex-shrink-0">
            <Image className="rounded-md m-3 h-40 md:h-72 w-full object-cover md:w-48" src={book.imageUrl} alt={book.title} width={200} height={200} />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{book.category}</div>
            <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {book.title}
            </h1>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              <span>{book.author}</span>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              <span>Updated on {new Date(book.updatedAt).toLocaleDateString()}</span>
            </div>
            <p className="mt-4 text-lg text-gray-500">{book.description}</p>
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Content Preview</h2>
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}