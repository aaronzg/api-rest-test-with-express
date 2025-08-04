import { Router } from "express";
import { MovieController } from "../controllers/movies.js";

export const moviesRouter = Router()

// Recuperar pelicula por id
moviesRouter.get('/:id', MovieController.getById)

// Recuperar peliculas por genero
moviesRouter.get('/', MovieController.getAll)

// Crear una pelicula
moviesRouter.post('/', MovieController.create)

// Actualizar una pelicula
moviesRouter.patch('/:id', MovieController.update)

// Borrar una pelicula
moviesRouter.delete('/:id', MovieController.delete)