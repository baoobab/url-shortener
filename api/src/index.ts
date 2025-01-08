import express, {Application} from 'express';
import dotenv from 'dotenv';
import {Database} from "./services/db.service";
import shortenUrlsRouter from "./routes/shortenUrls.route";

async function bootstrap() {
    dotenv.config()

    const app: Application = express()
    const PORT = Number(process.env.API_PORT)


    // const specs = swaggerJsDoc(options)
    // app.use(
    //     "/api-docs",
    //     swaggerUi.serve,
    //     swaggerUi.setup(specs)
    // )

    app.use(express.json())
    app.use('/', shortenUrlsRouter)


    app
    .listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    })
    .on("error", (error: unknown) => {
        console.log(error)
    })
}


bootstrap();