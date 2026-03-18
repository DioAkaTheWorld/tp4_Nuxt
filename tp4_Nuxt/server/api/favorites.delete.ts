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
            "DELETE FROM favorite_beers WHERE beer_id = ?",
            [body.beer_id]
        )
        return { success: true, message: "Bière retirée des favoris !" }
    } catch (error) {
        console.error("Erreur SQL (DELETE) :", error)
        throw createError({ statusCode: 500, statusMessage: "Erreur lors de la suppression." })
    } finally {
        await connection.end()
    }
})