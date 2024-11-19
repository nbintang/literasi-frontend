import UpdateBookForm from '@/components/book-form/update-book-form'
import React from 'react'

export default function EditPage({params}:{params:{id:string}}) {
  return (
    <div className='min-h-screen container mx-auto'><UpdateBookForm id={params.id}/></div>
  )
}
