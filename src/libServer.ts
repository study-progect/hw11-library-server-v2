
import express from 'express';
import {PORT} from "./config/libConfig.js";
import {errorHandler} from "./errorHandler/errorHandler.js";
import {libRouter} from "./rauters/libRouter.js";
import morgan from "morgan";
import * as fs from "node:fs";

export const launchServer = () => {
    const logStream = fs.createWriteStream('./src/access.log',{flags:"a"})
    const app = express();
    app.listen(PORT, () => console.log(`Server runs at http://localhost:${PORT}`))

    //===============Middleware====================
    app.use(express.json());
    app.use(morgan('dev'));
    app.use(morgan('combined', {stream: logStream}))
    //===============Router========================
    app.use('/api',libRouter);

    //==============ErrorHandler===================
    app.use(errorHandler);

}