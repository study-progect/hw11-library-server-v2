import express from "express";
import {BookControllerDb} from "../controllers/BookControllerDb.js";
import asyncHandler from "express-async-handler";
import {Book} from "../model/Book.js";
import {bookDtoSchema, bookIdSchema, readerSchema} from "../utils/joiSchemas.js";
import {BookDto} from "../model/BookDto.js";
import {getGenre} from "../utils/tools.js";

export const booksRouterDb = express.Router();

const controller = new BookControllerDb();

booksRouterDb.get('/', asyncHandler(async (req, res) => {
    const result: Book[] = await controller.getAllBooks();
    res.type("application/json").json(result)
}));

booksRouterDb.post('/',asyncHandler(async (req, res) => {
    const dto = req.body;
    const {error} = bookDtoSchema.validate(dto);
    if(error) throw new Error(JSON.stringify({status:400, message:error.message}));
    const result:Book = await controller.addBook(dto as BookDto);
    res.type("application/json").json(result);
}));

booksRouterDb.delete('/',asyncHandler(async (req, res) => {
    const id = req.query.id;
    const{error} = bookIdSchema.validate(id);
    if(error) throw new Error(JSON.stringify({status:400, message:error.message}));
    const result:BookDto = await controller.removeBook(id as string);
    res.type("application/json").json(result);
}))
booksRouterDb.put('/pickup', asyncHandler((req, res) => {
    const id = req.query.id;
    let{error} = bookIdSchema.validate(id);
    if(error) throw new Error(JSON.stringify({status:400, message:error.message}));

    controller.pickUpBook(id as string);
    res.send('Book picked up')
}));

booksRouterDb.put('/return', asyncHandler((req, res) => {
    const id = req.query.id;
    let{error} = bookIdSchema.validate(id);
    if(error) throw new Error(JSON.stringify({status:400, message:error.message}));
    const {reader} = req.body;
    error = readerSchema.validate(reader).error;
    if(error) throw new Error(JSON.stringify({status:400, message:error.message}));
    controller.returnBook(id as string, reader as string);
    res.send('Book returned')
}));

booksRouterDb.get('/genre', asyncHandler(async (req, res)=> {
    const genre = getGenre(req.query.genre as string); // validate genre
    // @ts-ignore
    const result: BookDto[] = await controller.getBooksByGenre(genre);
    res.type("application/json").json(result);
}));
