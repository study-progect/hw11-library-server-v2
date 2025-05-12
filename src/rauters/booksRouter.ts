import express from "express";
import {BookController} from "../controllers/BookController.js";
import asyncHandler from "express-async-handler";
import {Book} from "../model/Book.js";
import {bookDtoSchema, bookIdSchema, readerSchema} from "../utils/joiSchemas.js";
import {BookDto} from "../model/BookDto.js";
import {getGenre} from "../utils/tools.js";

export const booksRouter = express.Router();

const controller = new BookController();

booksRouter.get('/', asyncHandler((req, res) => {
    const result: Book[] = controller.getAllBooks();
    res.type("application/json").json(result)
}));

booksRouter.post('/',asyncHandler((req, res) => {
    const dto = req.body;
    const {error} = bookDtoSchema.validate(dto);
    if(error) throw new Error(JSON.stringify({status:400, message:error.message}));
    const result:Book = controller.addBook(dto as BookDto);
    res.type("application/json").json(result);
}));

booksRouter.delete('/',asyncHandler((req, res) => {
    const id = req.query.id;
    const{error} = bookIdSchema.validate(id);
    if(error) throw new Error(JSON.stringify({status:400, message:error.message}));
    const result:BookDto = controller.removeBook(id as string);
    res.type("application/json").json(result);
}))
booksRouter.put('/pickup', asyncHandler((req, res) => {
    const id = req.query.id;
    let{error} = bookIdSchema.validate(id);
    if(error) throw new Error(JSON.stringify({status:400, message:error.message}));

    controller.pickUpBook(id as string);
    res.send('Book picked up')
}));

booksRouter.put('/return', asyncHandler((req, res) => {
    const id = req.query.id;
    let{error} = bookIdSchema.validate(id);
    if(error) throw new Error(JSON.stringify({status:400, message:error.message}));
    const {reader} = req.body;
    error = readerSchema.validate(reader).error;
    if(error) throw new Error(JSON.stringify({status:400, message:error.message}));
    controller.returnBook(id as string, reader as string);
    res.send('Book returned')
}));

booksRouter.get('/genre', asyncHandler((req, res)=> {
    const result:BookDto[] = controller.getBooksByGenre(req.query.genre as string);
    res.type("application/json").json(result)
}))