import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.resolve(__dirname, '../../data.db')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接失败:', err)
  } else {
    console.log('数据库连接成功')
    initDatabase()
  }
})

// 将回调形式改为 Promise
const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err)
      else resolve(this)
    })
  })
}

const createTasksTable = async () => {
  try {
    await runQuery(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        status TEXT DEFAULT '待办',
        priority TEXT DEFAULT '中',
        start_date TEXT,
        due_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('任务表创建成功')
  } catch (error) {
    console.error('创建任务表失败:', error)
  }
}

const addPriorityColumn = async () => {
  try {
    await runQuery(`
      ALTER TABLE tasks 
      ADD COLUMN priority TEXT DEFAULT '中'
    `)
    console.log('优先级字段添加成功')
  } catch (error) {
    if (!error.message.includes('duplicate column name')) {
      console.error('添加优先级字段失败:', error)
    }
  }
}

const initDatabase = async () => {
  try {
    await createTasksTable()
    await addPriorityColumn()
  } catch (error) {
    console.error('初始化数据库失败:', error)
  }
}

// 修改测试数据插入函数为异步形式
const insertTestData = async () => {
  try {
    const result = await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM tasks", [], (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })
    
    if (result.count === 0) {
      const testTasks = [
        {
          description: '掌握Vue3核心语法',
          status: '进行中',
          priority: '高',
          start_date: '2024-02-20',
          due_date: '2024-02-28'
        },
        {
          description: '实现所有基本功能',
          status: '待办',
          priority: '中',
          start_date: '2024-03-01',
          due_date: '2024-03-15'
        },
        {
          description: '完成项目文档编写',
          status: '已完成',
          priority: '低',
          start_date: '2024-02-25',
          due_date: '2024-03-01'
        }
      ]

      for (const task of testTasks) {
        await runQuery(
          `INSERT INTO tasks (description, status, priority, start_date, due_date)
           VALUES (?, ?, ?, ?, ?)`,
          [task.description, task.status, task.priority, task.start_date, task.due_date]
        )
      }
      console.log('测试数据已添加')
    }
  } catch (error) {
    console.error('插入测试数据失败:', error)
  }
}

export { db, initDatabase }
