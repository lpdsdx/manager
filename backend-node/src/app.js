import express from 'express'
import cors from 'cors'
import { db, initDatabase } from './config/database.js'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// 获取所有任务
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json(rows)
  })
})

// 创建新任务
app.post('/api/tasks', (req, res) => {
  const { description, status, priority, start_date, due_date } = req.body
  
  db.run(
    `INSERT INTO tasks (description, status, priority, start_date, due_date)
     VALUES (?, ?, ?, ?, ?)`,
    [description, status, priority, start_date, due_date],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      res.json({
        id: this.lastID,
        description,
        status,
        priority,
        start_date,
        due_date
      })
    }
  )
})

// 更新任务
app.put('/api/tasks/:id', (req, res) => {
  const { description, status, priority, start_date, due_date } = req.body
  
  db.run(
    `UPDATE tasks 
     SET description = ?,
         status = ?,
         priority = ?,
         start_date = ?,
         due_date = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [description, status, priority, start_date, due_date, req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      res.json({ message: 'Task updated successfully' })
    }
  )
})

// 删除任务
app.delete('/api/tasks/:id', (req, res) => {
  db.run('DELETE FROM tasks WHERE id = ?', req.params.id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Task deleted successfully' })
  })
})

// 获取任务统计
app.get('/api/tasks/statistics', (req, res) => {
  db.all(
    `SELECT 
      COUNT(CASE WHEN status = '待办' THEN 1 END) as pending,
      COUNT(CASE WHEN status = '进行中' THEN 1 END) as inProgress,
      COUNT(CASE WHEN status = '已完成' THEN 1 END) as completed
     FROM tasks`,
    [],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      res.json(rows[0])
    }
  )
})

// 测试路由
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' })
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: err.message,
    error: err.name
  })
})

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`)
})
