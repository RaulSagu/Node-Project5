import z from 'zod'

const movieSchema = z.object({
  title: z.string().min(1, { message: 'El campo title es obligatorio' }),
  year: z.number({
    invalid_type_error: 'El campo year debe ser un número entero'
  }).int().min(1888, { message: 'El campo year debe ser un número entero mayor o igual a 1888' }),
  director: z.string().min(1, { message: 'El campo director es obligatorio' }),
  description: z.string().min(1, { message: 'El campo description es obligatorio' }),
  duration: z.number({
    invalid_type_error: 'El campo duration debe ser un número entero positivo'
  }).int().positive({ message: 'El campo duration debe ser un número entero positivo' }),
  rate: z.number().min(0, { message: 'El campo rate debe ser un número mayor o igual a 0' }).max(10, { message: 'El campo rate debe ser un número menor o igual a 10' }).default(5),
  recaudation: z.number().nonnegative({ message: 'El campo recaudation debe ser un número no negativo' }),
  poster: z.string({
    invalid_type_error: 'El campo poster debe ser una URL válida'
  }).url({ message: 'El campo poster debe ser una URL válida' }).optional()
})

export function validateMovie (object) {
  return movieSchema.safeParse(object)
}

export function validatePartialMovie (object) {
  return movieSchema.partial().safeParse(object)
}
