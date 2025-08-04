import {findIndexById} from '../utilities/helpers.js'
import {require} from '../utilities/require.js'
const movies = require('../movies.json')

export class MovieModel {
    static async getAll({ genre }) {
        if(genre) return movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
        
        return movies
    }

    static async getById({ id }) {
        const movie = movies.find(movie => movie.id === id)
        return movie
    }

    static async create ({ input }) {
        const newMovie = {
            id: crypto.randomUUID(),
            ...input
        }

        movies.push(newMovie)

        return newMovie
    }

    static async update ({ id, input }) {
        const movieIndex = findIndexById(movies, id)
        if(movieIndex < 0) return false

        movies[movieIndex] = {
            ...movies[movieIndex],
            ...input
        }

        return movies[movieIndex]
    }

    static async delete ({ id }) {
        const movieIndex = findIndexById(movies, id)
        if (movieIndex < 0) return false
        movies.splice(movieIndex, 1)
        return true
    }
}