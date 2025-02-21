const db = require('../config/database')

class Task {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM tasks", [], (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM tasks WHERE id = ?", [id], (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })
  }

  static create(task) {
    return new Promise((resolve, reject) => {
      const { title, description, status, due_date } = task
      db.run(
        "INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)",
        [title, description, status || '待办', due_date],
        function(err) {
          if (err) reject(err)
          else resolve({ id: this.lastID })
        }
      )
    })
  }

  static update(id, task) {
    return new Promise((resolve, reject) => {
      const { title, description, status, due_date } = task
      db.run(
        "UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE id = ?",
        [title, description, status, due_date, id],
        (err) => {
          if (err) reject(err)
          else resolve({ message: '任务更新成功' })
        }
      )
    })
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM tasks WHERE id = ?", [id], (err) => {
        if (err) reject(err)
        else resolve({ message: '任务已删除' })
      })
    })
  }
}

module.exports = Task
