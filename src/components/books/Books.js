import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { setTitle, setAuthor, setPrice, setCover, setPaidBooks, setFreeBooks } from '../../actions/book'
import { sortFreeBooks, sortPaidBooks } from './SortBooks'
import axios from 'axios'
import Modal from '../Modal'
import { booksAnimations } from '../../animations/booksAnimations'
import Loading from '../Loading'

const Books = ({ freeBooks, paidBooks, setTitle, setAuthor, setPrice, setCover, setPaidBooks, setFreeBooks }) => {
    const [bookTitle, setBookTitle] = useState("");
    const [savedFreeBooks, setSavedFreeBooks] = useState("");
    const [savedPaidBooks, setSavedPaidBooks] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        getBooks();
    }, [])
    const getBooks = () => {
        axios.get('/getFreeBooks', { headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt')}` } }).then(result => {
            const books = result.data.books;
            setFreeBooks(books);
            setSavedFreeBooks(sortFreeBooks(books, setTitle, setAuthor, setCover));
            booksAnimations('.free-book-item');
        })
        axios.get('/getPaidBooks', { headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt')}` } }).then(result => {
            const books = result.data.books;
            setPaidBooks(books);
            setSavedPaidBooks(sortPaidBooks(books, setTitle, setAuthor, setPrice, setCover));
            booksAnimations('.paid-book-item');
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (bookTitle.length !== 0) {
            axios.post('/findNewBook', {
                title: bookTitle
            }, { headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt')}` } }).then(result => {
                const book = result.data.book;
                const done = result.data.done;
                const message = result.data.msg;
                if (done) {
                    setBookTitle("");
                    setErrorMessage("");
                    const currentFreeBooks = freeBooks;
                    const currentPaidBooks = paidBooks;
                    if (book.price) {
                        currentPaidBooks.unshift(book);
                        setPaidBooks(currentPaidBooks);
                        setSavedPaidBooks(sortPaidBooks(paidBooks, setTitle, setAuthor, setPrice, setCover));
                        booksAnimations('.paid-book-item');
                    } else {
                        currentFreeBooks.unshift(book);
                        setFreeBooks(currentFreeBooks);
                        setSavedFreeBooks(sortFreeBooks(freeBooks, setTitle, setAuthor, setCover));
                        booksAnimations('.free-book-item');
                    }
                } else {
                    setErrorMessage(message)
                    setTimeout(() => {
                        setErrorMessage("")
                    }, 3000);
                }
            })
        } else {
            setErrorMessage("You have to type book's title!");
            setTimeout(() => {
                setErrorMessage("")
            }, 3000);
        }
    }
    return (
        <React.Fragment>
            <Modal setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />
            <div className="books">
                <div className="free-books-container books-container">
                    <div className="free-books-header books-header">
                        <div className="free-books-title books-title fullflex">Find here awesome books!</div>
                        <form autoComplete="off" className="free-books-search fullflex" onSubmit={handleSubmit}>
                            <input className="free-books-search-input input" id="book-title" name="book-title" value={bookTitle} type="text" placeholder="Type title of book..." onChange={e => setBookTitle(e.target.value)} />
                            <button className="free-books-search-button button">Find</button>
                        </form>
                        {successMessage && <div className="success">{successMessage}</div>}
                        {errorMessage && <div className="error">{errorMessage}</div>}
                    </div>
                    <div className="free-books-items books-items" style={savedFreeBooks === "" ? { display: 'flex', justifyContent: 'center', alignItems: 'center' } : {}}>
                        {savedFreeBooks === "" ? <Loading /> : savedFreeBooks}
                    </div>
                </div>
                <div className="paid-books-container books-container">
                    <div className="paid-books-header books-header fullflex">
                        <div className="paid-books-title books-title">Buy premium books!</div>
                    </div>
                    <div className="paid-books-items books-items" style={savedPaidBooks === "" ? { display: 'flex', justifyContent: 'center', alignItems: 'center' } : {}}>
                        {savedPaidBooks === "" ? <Loading /> : savedPaidBooks}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        title: state.book.title,
        author: state.book.author,
        price: state.book.price,
        cover: state.book.cover,
        freeBooks: state.book.freeBooks,
        paidBooks: state.book.paidBooks
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPaidBooks: payload => dispatch(setPaidBooks(payload)),
        setFreeBooks: payload => dispatch(setFreeBooks(payload)),
        setTitle: payload => dispatch(setTitle(payload)),
        setAuthor: payload => dispatch(setAuthor(payload)),
        setPrice: payload => dispatch(setPrice(payload)),
        setCover: payload => dispatch(setCover(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Books)
