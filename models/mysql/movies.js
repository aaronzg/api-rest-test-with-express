import { createConnection } from "mysql2/promise";
import mysql from "mysql2/promise";

const config = {
    port: 3306,
    host: "localhost",
    user: "root",
    password: "",
    database: "moviesdb",
};

const connection = await createConnection(config);

export class MovieModel {
    static async getAll({ genre }) {
        if (genre) {
            const lowerCaseGenre = genre.toLowerCase();
            const [genres] = await connection.query(
                "SELECT id, genre FROM genres WHERE LOWER(genre) = ?;",
                [lowerCaseGenre]
            );

            if (genres.length === 0) return [];

            const [{ id }] = genres;
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
            );

            return movies;
        }

        const [movies] = await connection.query(`
                SELECT BIN_TO_UUID(m.id) id, title, year, director, duration, poster, rate, JSON_ARRAYAGG(g.genre) AS genre
                FROM movies m
                JOIN movie_genres mg ON 
                m.id = mg.movie_id
                JOIN genres g ON
                mg.genre_id = g.id
                GROUP BY m.id;
            `);
        return movies;
    }

    static async getById({ id }) {
        const [movies] = await connection.query(
            `
                SELECT BIN_TO_UUID(m.id) id, title, year, director, duration, poster, rate, JSON_ARRAYAGG(g.genre) AS genre
                FROM movies m
                JOIN movie_genres mg ON
                m.id = mg.movie_id
                JOIN genres g ON
                mg.genre_id = g.id
                WHERE m.id = UUID_TO_BIN(?)
                GROUP BY m.id;
            `,
            [id]
        );

        return movies[0];
    }

    static async create({ input }) {
        const { title, year, director, duration, rate, poster, genre } = input;

        const [uuid] = await connection.query("SELECT UUID() as id");
        const [{ id: movie_id }] = uuid;

        connection.query(
            `
                INSERT INTO movies (id, title, year, director, duration, poster, rate)
                VALUES
                (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);
            `,
            [movie_id, title, year, director, duration, poster, rate]
        );

        for (const g of genre) {
            const lowerGenre = g.toLowerCase();

            const [[{ id: genre_id }]] = await connection.query(
              `SELECT id FROM genres WHERE LOWER(genre) = ?;`,
              [lowerGenre]
            );
        
            await connection.query(
              `INSERT INTO movie_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?);`,
              [movie_id, genre_id]
            );
        }



        const [ movies ] = await connection.query(
            `
                SELECT BIN_TO_UUID(m.id) id, title, year, director, duration, poster, rate, JSON_ARRAYAGG(g.genre) AS genre
                FROM movies m
                JOIN movie_genres mg ON
                m.id = mg.movie_id
                JOIN genres g ON
                mg.genre_id = g.id
                WHERE m.id = UUID_TO_BIN(?)
                GROUP BY m.id;
            `,
            [movie_id]
        );

        return movies[0]
    }

    static async update({ id, input }) {
        const movie = {
            title: input.title ?? '',
            year: input.year ?? 0,
            director: input.director ?? '',
            duration: input.duration ?? 0,
            poster: input.poster ?? '',
            genre: input.genre ?? []
        }

        const { title, year, director, duration, poster, genre } = movie;

        await connection.query(`
                UPDATE movies SET
                title = IF(CHAR_LENGTH(?) = 0, title, ?),
                year = IF(? = 0, year, ?),
                director = IF(CHAR_LENGTH(?) = 0, director, ?),
                duration = IF(? = 0, duration, ?),
                poster = IF(CHAR_LENGTH(?) = 0, poster, ?),
            `, [title, title, year, year, director, director, duration, duration, poster, poster, genre, genre])

        const [updatedMovie] = await connection.query(`
                SELECT * FROM movies
                WHERE id = UUID_TO_BIN(?);
            `, [id])

        console.log(updatedMovie)
    }

    static async delete({ id }) {}
}
