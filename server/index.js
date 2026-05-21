const express = require('express')
const cors = require('cors')
const pool = require('./db')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/employees', async (req, res) => {
    try {
        const { q, sortBy, order } = req.query
        let sql = 'SELECT * FROM employees'
        const params = []

        if (q) {
            sql += ' WHERE name LIKE ? OR empId LIKE ? OR email LIKE ?'
            const like = `%${q}%`
            params.push(like, like, like)
        }

        const allowedSort = ['empId', 'name', 'email', 'department', 'hireDate', 'salary'];
        if (sortBy && allowedSort.includes(sortBy)) {
            const direction = order === 'desc' ? 'DESC' : 'ASC'
            sql += ` ORDER BY ${sortBy} ${direction}`
        }

        const [rows] = await pool.query(sql, params)
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database Error' })
    }
})

app.post('/employees', async (req, res) => {
    
    try {
        const { empId, name, email, department, position, hireDate, salary, active } = req.body;
        const [r] = await pool.query(
            `INSERT INTO employees 
            (empId, name, email, department, position, hireDate, salary, active) 
             VALUES (?,?,?,?,?,?,?,?)`,
             [empId, name, email, department, position, hireDate, salary, active ? 1:0]
        )
        
        res.status(201).json({ id: r.insertId,  ...req.body })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Conflict: Employee ID or Email already exists.' })
        }
        res.status(500).json({ error: 'Database Error' })
    }
})

app.put('/employees/:id', async (req, res) => { 

    try {
        const { name, email, department, position, hireDate, salary, active } = req.body
        const [r] = await pool.query(
            `UPDATE employees SET empId=?, name=?, email=?, department=?, position=?, hireDate=?, salary=?, active=? WHERE id=?`,
            [req.body.empId, name, email, department, position, hireDate, salary, active ? 1 : 0, req.params.id]
        )

        if (!r.affectedRows) {
            return res.status(404).json({ error: 'Not Found' })
        }
        res.json({ id: Number(req.params.id), ...req.body })
    } catch (err) {
        res.status(500).json({ error: 'Database Error.' })
    }
})

app.delete('/employees/:id', async (req, res) => {
    try {
        const [r] = await pool.query(
            `DELETE FROM employees WHERE id = ?`, [req.params.id]
        )
        if (!r.affectedRows) {
            return res.status(404).json({ error: 'Not Found' })
        }
        res.json({ deleted: true })
    } catch (err) {
        res.status(500).json({ error: 'Database Error' });
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
})