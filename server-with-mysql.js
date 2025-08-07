import { MovieModel } from "./models/mysql/movies.js";
import { createApp } from "./web/app.js";

createApp({model: MovieModel});

