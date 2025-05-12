import {LibraryService} from "./LibraryService.js";
import {Book, BookGenres, BookStatus} from "../model/Book.js";

export class LibraryServiceImplEmbedded implements LibraryService{
    private books:Book[] = [];
    addBook(book: Book): boolean {
        const index = this.books.findIndex(item => item.id === book.id)
        if(index === -1){
            this.books.push(book);
            return true;
        }
        return false;
    }

    getAllBooks(): Book[] {
        return [...this.books];
    }

    getBooksByGenre(genre: BookGenres): Book[] {
        return this.books.filter(b => b.genre === genre);
    }

    pickUpBook(id: string): void {
        const book = this.books.find(b => b.id === id);
        if(!book)
           throw new Error(JSON.stringify({status:404, message:`Book with id ${id} not found`}))

        if(book.status !== BookStatus.ON_STOCK)
            throw new Error(JSON.stringify({status:403, message: `Book with id ${id} is removed or already on hand`}))
        book.status = BookStatus.ON_HAND
    }

    removeBook(id: string): Book {
        const index = this.books.findIndex(b => b.id === id)
        if(index === -1)
            throw new Error(JSON.stringify({status:404, message:`Book with id ${id} not found`}))
        const removed = this.books[index];
        removed.status = BookStatus.REMOVED;
        this.books.splice(index,1);
        return removed;
    }

    returnBook(id: string, reader: string): void {
        const book = this.books.find(b => b.id === id);
        if(!book)
            throw new Error(JSON.stringify({status:404, message:`Book with id ${id} not found`}))
        if(book.status !== BookStatus.ON_HAND)
            throw new Error(JSON.stringify({status:403, message: `Book with id ${id} is on stock or removed. Check your book ID`}))
        book.status = BookStatus.ON_STOCK;
        book.pickList.push({reader, date: new Date().toDateString()})
    }

}