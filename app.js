import express from 'express'
import { moviesRouter } from './routes/movies.js'

const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 8080

app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`)
}) 