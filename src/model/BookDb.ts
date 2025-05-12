import * as mongoose from "mongoose";
import {BookGenres, BookStatus} from "./Book.js";

const PickRecordSchema = new mongoose.Schema({
 reader: { type: String, required: true },
 date: { type: Date, required: true }
});

export const BookSchema = new mongoose.Schema({
 id: { type: String, required: true },
 title: { type: String, required: true },
 author: { type: String, required: true },
 genre: { type: String, enum: Object.values(BookGenres), required: true },
 status: { type: String, enum: Object.values(BookStatus), required: true },
 pickList: { type: [PickRecordSchema], required: true },
});

export const BookDb = mongoose.model('Book', BookSchema,'bookCollection');
