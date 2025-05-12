import express from "express";
import {booksRouter} from "./booksRouter.js";
import {booksRouterDb} from "./booksRouterDb.js";


export const libRouter = express.Router();
libRouter.use('/books', booksRouterDb)
