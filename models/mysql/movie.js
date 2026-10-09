import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT ?? 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export class MovieModel {
    static async getAll ({ genre }) {
        if (genre) {
        const normalizedGenre = String(genre).toLowerCase()
        const [movies] = await pool.query(
            `SELECT m.*
            FROM Movies m
            INNER JOIN Movie_Genres mg ON m.id = mg.movie_id
            INNER JOIN Genres g ON g.id = mg.genre_id
            WHERE LOWER(g.name) = ?
            ORDER BY m.code ASC`,
            [normalizedGenre]
        )
        return movies
        }

        const [movies] = await pool.query(
        'SELECT * FROM Movies ORDER BY code ASC'
        )
        return movies
    }

    static async getById ({ id }) {
        const normalizedId = String(id)
        const numericId = Number(normalizedId)
        const [rows] = await pool.query(
            'SELECT * FROM Movies WHERE id = ? OR code = ? LIMIT 1',
            [normalizedId, Number.isFinite(numericId) ? numericId : null]
        )
        return rows[0] ?? null
    }

    static async getByTitle ({ title }) {
        const [rows] = await pool.query(
            'SELECT * FROM Movies WHERE LOWER(title) = ? LIMIT 1',
            [String(title).toLowerCase()]
        )
        return rows[0] ?? null
    }

    static async create ({ input }) {
        const {
            title,
            year,
            director,
            description,
            duration,
            rate,
            recaudation,
            poster
        } = input

        const [result] = await pool.query(
            'INSERT INTO Movies (title, year, director, description, duration, rate, recaudation, poster) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, year, director, description, duration, rate, recaudation, poster]
        )

        return {
        code: result.insertId,
        ...input
        }
    }

    static async delete ({ id }) {
        const normalizedId = String(id)
        const numericId = Number(normalizedId)
        const [result] = await pool.query(
            'DELETE FROM Movies WHERE id = ? OR code = ?',
            [normalizedId, Number.isFinite(numericId) ? numericId : null]
        )

        return result.affectedRows > 0
    }

    static async update ({ id, input }) {
        const entries = Object.entries(input)
        if (entries.length === 0) return null

        const normalizedId = String(id)
        const numericId = Number(normalizedId)
        const setClause = entries.map(([key]) => `${key} = ?`).join(', ')
        const values = entries.map(([, value]) => value)

        const [result] = await pool.query(
            `UPDATE Movies SET ${setClause} WHERE id = ? OR code = ?`,
            [...values, normalizedId, Number.isFinite(numericId) ? numericId : null]
        )

        if (result.affectedRows === 0) {
            return null
        }

        return this.getById({ id })
    }
}
