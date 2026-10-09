import cors from'cors';

//Metodos Normales GET/HEAD/POST
//METODOS DE CORS O COMPLEJOS: OPTIONS, PUT, PATCH, DELETE

//CORS PRE-FLIGHT REQUESTS. Al momento de hacer una peticion de tipo PUT, PATCH o DELETE, el navegador hace una peticion OPTIONS para verificar si el servidor permite ese tipo de peticion. Si el servidor responde con un 200 OK, entonces el navegador hace la peticion real. Si el servidor responde con un 403 Forbidden, entonces el navegador no hace la peticion real y muestra un error en la consola.
//Necesita una OPTIONS para que el navegador haga la peticion real. Si no, el navegador no hace la peticion real y muestra un error en la consola.
//Osea antes de ejecutar la peticion le preguna a la API si puede ejecutar la peticion. Si la API responde que si, entonces el navegador hace la peticion real. Si la API responde que no, entonces el navegador no hace la peticion real y muestra un error en la consola.
const ACCEPTED_ORIGINS = ['http://localhost:3000', 'http://localhost:8080', 'https://peliculas.com'];
export const corsMeddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
    origin: (origin, callback) => {
        if (acceptedOrigins.includes(origin) || !origin) {
            return callback(null, true); // Permitir solicitudes desde el origen específico
        } else if (!origin) {
            return callback(null, true); // Permitir solicitudes desde el origen específico
        } else {
            return callback(new Error('Origen no permitido por CORS')); // Rechazar solicitudes desde otros orígenes
        }
    }
})