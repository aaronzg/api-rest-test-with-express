import { Router } from "express";
import { MovieController } from "../controllers/movies.js";

export const createMoviesRouter = ({ model }) => {
    const moviesRouter = Router()
    
    const movieController = new MovieController({ model })
    // Recuperar pelicula por id
    moviesRouter.get('/:id', movieController.getById)
    
    // Recuperar peliculas por genero
    moviesRouter.get('/', movieController.getAll)
    
    // Crear una pelicula
    moviesRouter.post('/', movieController.create)
    
    // Actualizar una pelicula
    moviesRouter.patch('/:id', movieController.update)
    
    // Borrar una pelicula
    moviesRouter.delete('/:id', movieController.delete)

    return moviesRouter
}
