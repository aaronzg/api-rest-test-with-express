import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'moviesdb'
}

const conection = await mysql.createConnection(config)


export class MovieModel {
    static async getAll({ genre }) {
        if (genre) {
            const lowerCaseLowerGenres = genre.toLowerCase()
            const [genres] = await conection.query('SELECT * FROM genre WHERE LOWER(name) = ?;',
                 [lowerCaseLowerGenres])
            
            if (genres.length <= 0) return []

            const [{id}] = genres
            
            const [movies] = await conection.query('SELECT genre_id, title, director, year, duration, poster, rate FROM movie_genres INNER JOIN movies ON movies.id = movie_id WHERE genre_id = ?', [id])
            
            return movies
        }   
        
        const [movies] = await conection.query('SELECT BIN_TO_UUID(id) id, title, director, year, duration, poster, rate FROM movies')

        return movies

    }

    static async getById({ id }) {

    }

    static async create({ input }) {

    }

    static async delete({ id }) {

    }

    static async update({ id, input }) {

    }
}
