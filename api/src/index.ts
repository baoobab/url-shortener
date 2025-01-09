import express, {Application} from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc, {Options} from 'swagger-jsdoc';
import shortenUrlsRouter from "./routes/shortenUrls.route";

async function bootstrap() {
    dotenv.config()

    const app: Application = express()
    const PORT = Number(process.env.API_PORT)


    const options: Options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Simple Rest API for url shortening, with analytics and db",
                version: "1.0.0",
            },
            tags: [
                {
                    name: 'Shorten URLs',
                    description: 'Операции со ссылками',
                },
            ],
        },
        apis: ["**/*.ts"],
    }

    const specs = swaggerJsDoc(options)
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(specs)
    )

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