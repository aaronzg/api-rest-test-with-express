import { Router } from "express";
import { require } from "../utilities/require";
import { MovieController } from "../controllers/movies";

export const moviesRouter = Router()

// Recuperar pelicula por id
app.get('/movies/:id', MovieController.getById)

// Recuperar peliculas por genero
moviesRouter.get('/movies', MovieController.getAll)

// Crear una pelicula
moviesRouter.post('/movies', MovieController.create)

// Actualizar una pelicula
moviesRouter.patch('/movies/:id', MovieController.update)

// Borrar una pelicula
moviesRouter.delete('/movies/:id', MovieController.delete)