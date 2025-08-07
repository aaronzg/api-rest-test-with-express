import express from 'express'
import { createMoviesRouter } from '../routes/movies.js'

export const createApp = ({ model }) => {
    const app = express()
    app.disable('x-powered-by')
    app.use(express.json())
    app.use('/movies', createMoviesRouter({ model }))
    
    const PORT = process.env.PORT ?? 8080
    
    app.listen(PORT, () => {
        console.log(`server listening on http://localhost:${PORT}`)
    }) 
}