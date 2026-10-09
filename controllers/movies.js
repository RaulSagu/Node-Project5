//import { MovieModel } from '../models/mysql/movie.js'
import { validateMovie, validatePartialMovie } from '../shemas/movies.js'

export class MovieController {
    constructor ({ movieModel }) {
        this.movieModel = movieModel
    }

    getAll = async (req, res) => {
        const { genre } = req.query
        const movies = await this.movieModel.getAll({ genre })
        return res.json(movies)
    }

    getById = async (req, res) => {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ error: 'El id es requerido' })
        }

        const movie = await this.movieModel.getById({ id })
        if (!movie) {
            return res.status(404).json({ error: 'Película no encontrada' })
        }

        return res.json(movie)
    }

    create = async (req, res) => {
        const result = validateMovie(req.body)
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues.map((issue) => issue.message) })
        }

        const existingMovie = await this.movieModel.getByTitle({ title: result.data.title })
        if (existingMovie) {
            return res.status(409).json({ error: 'La película ya existe' })
        }

        const newMovie = await this.movieModel.create({ input: result.data })
        return res.status(201).json(newMovie)
    }

    delete = async (req, res) => {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ error: 'El id es requerido' })
        }

        const result = await this.movieModel.delete({ id })
        if (!result) {
            return res.status(404).json({ error: 'Película no encontrada' })
        }

        return res.json({ message: 'Película eliminada correctamente' })
    }

    update = async (req, res) => {
        const result = validatePartialMovie(req.body)
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues.map((issue) => issue.message) })
        }

        const { id } = req.params
        if (!id) {
            return res.status(400).json({ error: 'El id es requerido' })
        }

        const updateMovie = await this.movieModel.update({ id, input: result.data })
        if (!updateMovie) {
            return res.status(404).json({ error: 'Película no encontrada' })
        }

        return res.json(updateMovie)
    }
}
