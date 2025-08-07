import { MovieModel } from "../models/mysql/movies.js" 
import { validateMovie, validatePartialMovie } from '../schemas/movieSchema.js'

export class MovieController {
    constructor ({ model }) {
        this.model = model
    }

    getAll = async (req, res) => {
        const { genre } = req.query 
        const movies = await this.model.getAll({ genre })
        res.json(movies)
    }

    getById = async (req, res) => {
        const { id } = req.params
        const movie = await this.model.getById({ id })
        if (!movie) return res.json({ error: 'Movie not found'})
        res.json(movie)
    }

    create = async (req, res) => {
        const result = validateMovie(req.body)
        if(!result.success) return res.status(400).json({ error: JSON.parse(result.error.message)})
     
        const newMovie = await this.model.create({input: result.data})
        res.status(201).json(newMovie)
    }

    update = async (req, res) => {
        const result = validatePartialMovie(req.body)

        if(!result.success) return res.status(400).json({ error: JSON.parse(result.error.message)})
        
        const { id } = req.params
        const updatedMovie = await this.model.update({ id, input: result.data })
        if(!updatedMovie) return res.status(404).json({message: 'Movie not found'})
        res.json(updatedMovie)
    }

    delete = async (req, res)  => {
        const { id } = req.params
        const result = await this.model.delete({ id })
        if(!result) return res.status(404).json({message: 'Movie not found'})
        res.json({ message: 'Movie deleted'})
    }

}