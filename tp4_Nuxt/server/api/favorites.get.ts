import mysql from 'mysql2/promise'
import bluebird from 'bluebird'

export default defineEventHandler(async (event) => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'bieres_db',
            Promise: bluebird,
        })

        const [rows, fields] = await connection.execute("SELECT * FROM favorite_beers")

        await connection.end()

        return {
            favorites: rows
        }

    } catch (error) {
        console.error("Erreur MySQL :", error)

        throw createError({
            statusCode: 500,
            statusMessage: "Impossible de se connecter à la base de données"
        })
    }
});