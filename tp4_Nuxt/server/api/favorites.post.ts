import mysql from 'mysql2/promise'
import bluebird from 'bluebird'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body || !body.beer_id) {
        throw createError({ statusCode: 400, statusMessage: "L'ID de la bière est manquant." })
    }

    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'bieres_db',
        Promise: bluebird,
    })

    try {
        await connection.execute(
            "INSERT IGNORE INTO favorite_beers (beer_id) VALUES (?)",
            [body.beer_id]
        )
        return { success: true, message: "Bière ajoutée aux favoris !" }
    } catch (error) {
        console.error("Erreur SQL (POST) :", error)
        throw createError({ statusCode: 500, statusMessage: "Erreur lors de l'ajout." })
    } finally {
        await connection.end()
    }
})