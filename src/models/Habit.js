const db = require('../db');

const Habit = {
    // Obtener los hábitos de un usuario
    getHabitsByUser: async (user_id) => {
        const [rows] = await db.query('SELECT * FROM habits WHERE user_id = ?', [user_id]); //mejor query que execute porque no hay datos sensibles 
        return rows[0] || null; //devolvemos el objeto directamente o null
    },

    //crea o actualiza según corresponda
    upsertHabits: async (user_id, {sueno, agua, tabaco, alcohol}) => {
        //comprobar si ya existen
        const [exists] = await db.query('SELECT id FROM habits WHERE user_id = ?', [user_id])

        if (exists.length > 0) {
            //si existen, actualizamos
            const [result] = await db.query(
                `UPDATE habits SET sueno = ?, agua = ?, tabaco = ?, alcohol = ? WHERE user_id = ?`,
                [sueno, agua, tabaco, alcohol, user_id]
            )
            return {type: 'UPDATE', affectedRows: result.affectedRows}
        } else {
            //si no existen, insertamos
            const [result] = await db.query(
                'INSERT INTO habits (user_id, sueno, agua, tabaco, alcohol) VALUES (?, ?, ?, ?, ?)',
                [user_id, sueno, agua, tabaco, alcohol]
            );
            return {type: 'INSERT', insertId: result.insertId};
        }
    }
}

module.exports = Habit