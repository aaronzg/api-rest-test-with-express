import { createConnection } from 'mysql2/promise'
import mysql from 'mysql2/promise'

const config = {
    port: 3306,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'moviesdb'
}

const connection = await createConnection(config)

export class MovieModel {
    static async getAll({ genre }) {
        if (genre) {
            const lowerCaseGenre = genre.toLowerCase()
            const [genres] = await connection.query(
                'SELECT id, genre FROM genres WHERE LOWER(genre) = ?;', [lowerCaseGenre]
            )
            
            if (genres.length === 0) return []

            const [{ id }] = genres
            const [movies] = await connection.query(
                `SELECT BIN_TO_UUID(m.id) id, title, year, director, duration, poster, rate, JSON_ARRAYAGG(g.genre) AS genre
                FROM movies m
                JOIN movie_genres mg ON 
                m.id = mg.movie_id
                JOIN genres g ON
                mg.genre_id = g.id
                WHERE m.id IN (
                	SELECT movie_id FROM movie_genres WHERE genre_id = ?
                )
                GROUP BY m.id;`,
                [id]
            )

            return movies
        }

        const [movies] = await connection.query('SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movies')
        return movies
    }

    static async getById({ id }) {
 
    }

    static async create ({ input }) {
 
    }

    static async update ({ id, input }) {
 
    }

    static async delete ({ id }) {
 
    }
}