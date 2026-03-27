const db = require('../db')

const createHabit = async ({user_id, sueno, agua, tabaco, alcohol}) => {
    const [result] = await db.query( //mejor query que execute porque no hay datos sensibles
        'INSERT INTO habits (user_id, sueno, agua, tabaco, alcohol) VALUES (?, ?, ?, ?, ?)',
        [user_id, sueno, agua, tabaco, alcohol]
    )
    return result.insertId
}

const getHabitsByUser = async (user_id) => {
    const [rows] = await db.query(`SELECT * FROM habits WHERE user_id = ?`, [user_id])
    return rows
}

const updateHabit = async ({user_id, sueno, agua, tabaco, alcohol}) => {
    const [result] = await db.query(
        `UPDATE habits SET sueno = ?, agua = ?, tabaco = ?, alcohol = ? WHERE user_id = ?`,
        [sueno, agua, tabaco, alcohol, user_id]
    )
    return result.affectedRows
}

module.exports = {createHabit, getHabitsByUser, updateHabit}