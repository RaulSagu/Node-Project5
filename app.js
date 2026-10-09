import express, { json } from 'express'
import { createMoviesRouter } from './routes/movies.js'
import { corsMeddleware } from './middlewares/cors.js'
//import { MovieModel } from './models/mysql/movie.js'
//import { MovieModel } from './models/local-file-system/movie.js'

export const createApp = ({ movieModel }) => {
  const app = express()
  app.use(json())
  app.use(corsMeddleware())
  app.disable('x-powered-by')

  //app.use('/movies', createMoviesRouter({ movieModel: MovieModel }))
  app.use('/movies', createMoviesRouter({ movieModel }))

  const PORT = process.env.PORT ?? 3000
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT} 🚀`)
  })
}


