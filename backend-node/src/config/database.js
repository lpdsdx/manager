const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.resolve(__dirname, '../../data.db')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接失败:', err)
  } else {
    console.log('数据库连接成功')
    initDatabase()
  }
})

function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT '待办',
      start_date TEXT,
      due_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('创建表失败:', err)
    } else {
      console.log('数据库表已创建')
      // 添加测试数据
      insertTestData()
    }
  })
}

function insertTestData() {
  db.get("SELECT COUNT(*) as count FROM tasks", [], (err, row) => {
    if (err) {
      console.error('查询失败:', err)
      return
    }
    
    console.log('当前数据库中的任务数量:', row.count)
    
    if (row.count === 0) {
      const testTasks = [
        {
          title: '学习Vue',
          description: '掌握Vue3核心语法',
          status: '进行中',
          start_date: '2024-02-20',
          due_date: '2024-02-28'
        },
        {
          title: '完成项目',
          description: '实现所有基本功能',
          status: '待办',
          start_date: '2024-03-01',
          due_date: '2024-03-15'
        },
        {
          title: '编写文档',
          description: '完成项目文档编写',
          status: '已完成',
          start_date: '2024-02-25',
          due_date: '2024-03-01'
        }
      ]

      const stmt = db.prepare(`
        INSERT INTO tasks (title, description, status, start_date, due_date)
        VALUES (?, ?, ?, ?, ?)
      `)

      testTasks.forEach(task => {
        stmt.run([task.title, task.description, task.status, task.start_date, task.due_date])
      })

      stmt.finalize()
      console.log('测试数据已添加')
    }
  })
}

module.exports = db
