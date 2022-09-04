import { useEffect, useState } from 'react'

import { API } from 'online-library'

import type { Book } from 'gql'

import { useForm } from 'hooks'

import { defaultAxios } from 'utils'

import type { BookSuggestionsProps, GetSuggestionsResponse } from 'types'

export const useBookSuggestions = ({
   freeBooks,
   paidBooks,
   setFreeBooks,
   setPaidBooks,
   withProfile,
}: BookSuggestionsProps) => {
   const { control, getValues, setValue, watch } = useForm(API.getSuggestions.validation)

   const [findByTitle, setFindByTitle] = useState(true)

   const [books, setBooks] = useState<Book[]>([])

   const [title, author] = watch(['title', 'author'])

   useEffect(() => {
      const getSuggestions = async () => {
         const response = await defaultAxios.post<GetSuggestionsResponse>(API.getSuggestions.url, {
            ...getValues(),
            withProfile: !!withProfile,
         })
         if (response) {
            const { books } = response.data
            setBooks(books)
         }
      }
      getSuggestions()
   }, [title, author, withProfile])

   const switchFindBy = () => {
      findByTitle ? setValue('title', '') : setValue('author', '')
      setFindByTitle(findByTitle => !findByTitle)
   }

   const handleSort = (id: number, price: number | null | undefined) => {
      const filterOut = (book: Book) => book.id !== id

      const filter = (book: Book) => book.id === id

      if (!price) {
         const sortedFreeBooks = freeBooks.filter(filterOut)

         const sortedFreeBook = freeBooks.find(filter) || books.find(filter)

         if (sortedFreeBook) {
            setFreeBooks([sortedFreeBook, ...sortedFreeBooks])
         }
      } else {
         const sortedPaidBooks = paidBooks.filter(filterOut)

         const sortedPaidBook = paidBooks.find(filter) || books.find(filter)

         if (sortedPaidBook) {
            setPaidBooks([sortedPaidBook, ...sortedPaidBooks])
         }
      }

      findByTitle ? setValue('title', '') : setValue('author', '')
   }

   return {
      title,
      author,
      findByTitle,
      books,
      switchFindBy,
      handleSort,
      control,
   }
}
