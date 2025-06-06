import {LibraryServiceImplEmbedded} from "../service/LibraryServiceImplEmbedded.js";
import {LibraryService} from "../service/LibraryService.js";
import {BookDto} from "../model/BookDto.js";
import {Book} from "../model/Book.js";
import {convertBookDtoToBook, convertBookToBookDto, getGenre} from "../utils/tools.js";

export class BookController {
    private libService:LibraryService = new LibraryServiceImplEmbedded();

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

    pickUpBook(id: string) {
        this.libService.pickUpBook(id)
    }

    returnBook(id: string, reader: string) {
        this.libService.returnBook(id, reader)
    }

    async getBooksByGenre(genre: string) {
        const gen = getGenre(genre);
        const filteredBooks = this.libService.getBooksByGenre(gen)
        return (await filteredBooks).map(book => convertBookToBookDto(book));
    }
}