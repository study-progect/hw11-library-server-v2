import {Book, BookGenres} from "../model/Book.js";

export interface LibraryService {
     addBook: (book:Book) => boolean;
     removeBook:(id:string) => Book;
     pickUpBook:(id:string) => void;
     returnBook:(id:string, reader:string) => void;
     getAllBooks:() => Book[];
     getBooksByGenre:(genre: BookGenres) => Book[];
 }