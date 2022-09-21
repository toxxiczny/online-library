import { useEffect, useState } from 'react'

import type { Book as BookType } from 'gql'

import * as Styled from './styled'
import { Button, PopupContainer } from 'components/shared/styled'
import * as StyledBookPopup from 'components/user/Store/modules/BookPopup/styled'

import { Book } from 'components/shared'

import type { SetBookPopupDataFn } from 'types'

type BookPreviewProps = BookType & {
   setBookPopupData: SetBookPopupDataFn
}

export const BookPreview = ({
   id,
   title,
   author,
   cover,
   price,
   setBookPopupData,
}: BookPreviewProps) => {
   const [pages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

   const [currentPage, setCurrentPage] = useState(0)

   const [opened, setOpened] = useState(false)

   const [read, setRead] = useState(false)

   useEffect(() => {
      setOpened(currentPage > 0)
      setRead(currentPage >= pages.length - 1)
   }, [currentPage])

   return (
      <PopupContainer>
         <StyledBookPopup.ContentContainer withFlips>
            <Styled.BookContainer withFlips={opened} read={read}>
               {pages.map((_, index) => (
                  <Styled.Page
                     key={index}
                     flip={opened && (index === currentPage || index <= currentPage)}
                     zIndex={index <= currentPage ? 1 : -index}
                  >
                     {index === 0 ? (
                        <Book
                           id={id}
                           title={title}
                           author={author}
                           cover={cover}
                           price={price}
                           withPopup
                           withFlips
                        />
                     ) : (
                        <Styled.PageContent>FRONT {index}</Styled.PageContent>
                     )}
                     <Styled.PageContent back>BACK {index}</Styled.PageContent>
                  </Styled.Page>
               ))}
            </Styled.BookContainer>
            <StyledBookPopup.Content withFlips>
               <StyledBookPopup.ButtonsContainer>
                  {opened ? (
                     <>
                        <Button onClick={() => setCurrentPage(0)} notAbsolute withoutFixedWidth>
                           First page
                        </Button>
                        <Button
                           onClick={() => setCurrentPage(currentPage => currentPage - 1)}
                           notAbsolute
                           withoutFixedWidth
                        >
                           Previous page
                        </Button>
                        <Button
                           onClick={() => {
                              if (!read) {
                                 setCurrentPage(currentPage => currentPage + 1)
                              }
                           }}
                           notAbsolute
                           withoutFixedWidth
                           withMarginLeft
                        >
                           Next page
                        </Button>
                     </>
                  ) : (
                     <>
                        <Button
                           onClick={() => setCurrentPage(currentPage => currentPage + 1)}
                           notAbsolute
                           withoutFixedWidth
                        >
                           Read it
                        </Button>
                        <Button
                           onClick={() => setBookPopupData(undefined)}
                           notAbsolute
                           withoutFixedWidth
                        >
                           Close
                        </Button>
                     </>
                  )}
               </StyledBookPopup.ButtonsContainer>
            </StyledBookPopup.Content>
         </StyledBookPopup.ContentContainer>
      </PopupContainer>
   )
}