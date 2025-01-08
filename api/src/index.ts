import express, {Application} from 'express';
import dotenv from 'dotenv';
// import {initDatabase} from "./src/utils/db.init";
// import BooksRoutes from "./src/routes/books.routes";

async function bootstrap() {
    dotenv.config()

    const app: Application = express()
    const PORT = Number(process.env.API_PORT) || 3000


    // const specs = swaggerJsDoc(options)
    // app.use(
    //     "/api-docs",
    //     swaggerUi.serve,
    //     swaggerUi.setup(specs)
    // )

    await initDatabase()

    app.use(express.json())
    app.use('/books', BooksRoutes)


    app
    .listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    })
    .on("error", (error: unknown) => {
        console.log(error)
    })
}


bootstrap();