const express = require('express')
const router = express.Router()
const Task = require('../models/Task')

// 获取所有任务
router.get('/', async (req, res) => {
  try {
    console.log('收到获取任务列表请求')
    const tasks = await Task.getAll()
    console.log('返回任务列表:', tasks)
    res.json(tasks)
  } catch (err) {
    console.error('获取任务列表失败:', err)
    res.status(500).json({ error: err.message })
  }
})

// 获取单个任务
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.getById(req.params.id)
    if (task) {
      res.json(task)
    } else {
      res.status(404).json({ message: '任务不存在' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 创建任务
router.post('/', async (req, res) => {
  try {
    const result = await Task.create(req.body)
    res.status(201).json({ message: '任务创建成功', id: result.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 更新任务
router.put('/:id', async (req, res) => {
  try {
    await Task.update(req.params.id, req.body)
    res.json({ message: '任务更新成功' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 删除任务
router.delete('/:id', async (req, res) => {
  try {
    await Task.delete(req.params.id)
    res.json({ message: '任务已删除' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
