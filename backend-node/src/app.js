const express = require('express')
const cors = require('cors')
const tasksRouter = require('./routes/tasks')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// API 路由
app.use('/api/tasks', tasksRouter)

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
