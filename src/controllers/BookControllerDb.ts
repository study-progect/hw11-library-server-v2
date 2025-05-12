import {LibraryServiceImplEmbeddedWithMongo} from "../service/LibraryServiceImplEmbeddedWithMongo.js";
import {LibraryService} from "../service/LibraryService.js";
import {BookDto} from "../model/BookDto.js";
import {Book} from "../model/Book.js";
import {convertBookDtoToBook, convertBookToBookDto, getGenre} from "../utils/tools.js";


export class BookControllerDb {
    private libService:LibraryService = new LibraryServiceImplEmbeddedWithMongo();

    getAllBooks() {
        return this.libService.getAllBooks();
    }

    async addBook(dto:BookDto){
        const book:Book = convertBookDtoToBook(dto);
        if(await this.libService.addBook(book)){
            console.log(book)
            return book;
        }
        throw new Error(JSON.stringify({status:403, message: `Book with id ${book.id} not added`}))
    }

    async removeBook(id: string) {
        const book = await this.libService.removeBook(id);
        return convertBookToBookDto(book);
    }

    async pickUpBook(id: string) {
        await this.libService.pickUpBook(id)
    }

    async returnBook(id: string, reader: string) {
        await this.libService.returnBook(id, reader)
    }

    async getBooksByGenre(genre: string) {
        const gen = getGenre(genre);
        const filteredBooks = this.libService.getBooksByGenre(gen)
        return (await filteredBooks).map(book => convertBookToBookDto(book));
    }
}