import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import Loader from 'react-spinkit'

import hooks from 'hooks'

import Dashboard from '../styled/Dashboard'

import { IBook } from '../UserStore'

interface IProps {
    setBookPopupData?: React.Dispatch<React.SetStateAction<IBook | undefined>>
    withCart?: boolean
    withProfile?: boolean
    withPopup?: boolean
}

const BookContainer = styled.div`
    height: 100%;
    position: relative;
    ${({ withPopup }: { withPopup?: boolean }) =>
        withPopup &&
        css`
            width: 100%;
            @media (max-width: 1150px) {
                max-height: 50%;
            }
        `}
`

const Book: React.FC<IBook & IProps> = ({
    id,
    author,
    title,
    cover,
    price,
    setBookPopupData,
    withCart,
    withProfile,
    withPopup
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [timeoutId, setTimeoutId] = useState<number>()
    const { cart, removeFromCart } = hooks.useCart()
    useEffect(() => {
        !timeoutId && setTimeoutId(setTimeout(() => setIsLoading(true), 500))
    }, [])
    const isInCart = cart.includes(id)
    return (
        <BookContainer withPopup={withPopup}>
            <Dashboard.Loader
                onAnimationEnd={e => (e.currentTarget.style.display = 'none')}
                isLoading={isLoading}
            >
                {isLoading && <Loader name="circle" fadeIn="none" />}
            </Dashboard.Loader>
            <Dashboard.Cover
                src={cover}
                onLoad={() => {
                    setIsLoading(false)
                    clearTimeout(timeoutId)
                    setTimeoutId(undefined)
                }}
                onError={e => {
                    setIsLoading(true)
                    e.currentTarget.src = `https://picsum.photos/1920/108${Math.floor(
                        Math.random() * 10
                    )}`
                }}
            />
            <Dashboard.AnnotationsContainer>
                <Dashboard.Annotation>{author}</Dashboard.Annotation>
                <Dashboard.Annotation withTitle>{title}</Dashboard.Annotation>
            </Dashboard.AnnotationsContainer>
            {withCart ? (
                <Dashboard.Button onClick={() => removeFromCart(id)} price={price}>
                    Remove
                </Dashboard.Button>
            ) : withProfile ? (
                <Dashboard.Button>Open</Dashboard.Button>
            ) : !withPopup ? (
                <Dashboard.Button
                    onClick={() =>
                        setBookPopupData &&
                        !isInCart &&
                        setBookPopupData({
                            id,
                            author,
                            title,
                            cover,
                            price
                        })
                    }
                    price={price}
                    withoutHover={isInCart}
                >
                    {price ? (isInCart ? 'In cart' : 'Buy') : 'Borrow'}
                </Dashboard.Button>
            ) : (
                withPopup &&
                price && (
                    <Dashboard.Button price={price} withoutHover>
                        Price
                    </Dashboard.Button>
                )
            )}
        </BookContainer>
    )
}

export default Book
