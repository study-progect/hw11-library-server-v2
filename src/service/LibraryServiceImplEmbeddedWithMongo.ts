import {LibraryService} from "./LibraryService.js";
import {Book, BookGenres, BookStatus} from "../model/Book.js";
import {BookDb} from "../model/BookDb.js";

export class LibraryServiceImplEmbeddedWithMongo implements LibraryService {
    async addBook(book: Book): Promise<boolean> {
        const existingBook = await BookDb.findOne({ id: book.id });
        if (existingBook)
            return false;
        const newBook = new BookDb(book);
        try {
            await newBook.save();
            return true;
        } catch (e) {
            console.log("Error saving book to database:", e);
            return false;
        }
    }

    async getAllBooks(): Promise<Book[]> {
        return BookDb.find();
    }

    async getBooksByGenre(genre: BookGenres): Promise<Book[]> {
        return BookDb.find({ genre });
    }

    async pickUpBook(id: string): Promise<void> {
        const book = await BookDb.findOne({ id: id });
        if (!book)
            throw new Error(JSON.stringify({ status: 404, message: `Book with id ${id} not found` }));
        if (book.status !== BookStatus.ON_STOCK)
            throw new Error(JSON.stringify({ status: 403, message: `Book with id ${id} is removed or already on hand` }));
        book.status = BookStatus.ON_HAND;
        try {
            await book.save();
        } catch (e) {
            console.error("Error updating book status:", e);
            throw new Error("Error updating book status");
        }
    }

    async removeBook(id: string): Promise<Book> {
        const book = await BookDb.findOne({ id: id });
        if (!book) {
            throw new Error(JSON.stringify({ status: 404, message: `Book with id ${id} not found` }));
        }

        const bookData = book.toObject(); // Преобразуем документ в обычный объект
        try {
            await book.deleteOne(); // Удаляем книгу из базы данных
            return bookData as unknown as Book; // Возвращаем данные о книге
        } catch (e) {
            console.log("Error removing book from database:", e);
            throw new Error("Error removing book from database"); // Выбрасываем ошибку
        }
    }



    async returnBook(id: string, reader: string): Promise<void> {
        const book = await BookDb.findOne({ id: id });
        if (!book)
            throw new Error(JSON.stringify({ status: 404, message: `Book with id ${id} not found` }));

        if (book.status !== BookStatus.ON_HAND)
            throw new Error(JSON.stringify({ status: 403, message: `Book with id ${id} is on stock or removed. Check your book ID` }));

        book.status = BookStatus.ON_STOCK;
        // book.pickList.push({ reader, date: new Date().toDateString() });
        book.pickList.push({ reader, date: new Date() });

        try {
            await book.save();
        } catch (e) {
            console.error("Error updating book status:", e);
            throw new Error("Error updating book status");
        }

    }
}