<template>
  <div class="task-manager">
    <el-card class="task-card">
      <template #header>
        <div class="card-header">
          <h3>任务管理</h3>
          <el-button type="primary" @click="showDialog = true">
            <el-icon><Plus /></el-icon>
            新建任务
          </el-button>
        </div>
      </template>

      <el-table :data="tasks" style="width: 100%" border>
        <el-table-column prop="title" label="标题" min-width="180" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="due_date" label="截止时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" type="primary" @click="editTask(row)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button size="small" type="danger" @click="deleteTask(row.id)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showDialog" :title="isEditing ? '编辑任务' : '新建任务'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题" required>
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" class="w-full">
            <el-option label="待办" value="待办" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间">
          <el-date-picker
            v-model="form.due_date"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
            class="w-full"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="submitTask">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

const tasks = ref([])
const showDialog = ref(false)
const isEditing = ref(false)
const currentTaskId = ref(null)

const form = ref({
  title: '',
  description: '',
  status: '待办',
  due_date: null
})

// 获取任务列表
const fetchTasks = async () => {
  const response = await axios.get('/api/tasks')
  tasks.value = response.data
}

// 提交表单
const submitTask = async () => {
  try {
    const url = isEditing.value 
      ? `/api/tasks/${currentTaskId.value}`
      : '/api/tasks'
      
    const method = isEditing.value ? 'put' : 'post'
    
    await axios[method](url, form.value)
    await fetchTasks()
    showDialog.value = false
  } catch (error) {
    console.error('操作失败:', error)
  }
}

// 编辑任务
const editTask = (task) => {
  isEditing.value = true
  currentTaskId.value = task.id
  form.value = {
    title: task.title,
    description: task.description,
    status: task.status,
    due_date: task.due_date
  }
  showDialog.value = true
}

// 删除任务
const deleteTask = async (id) => {
  try {
    await axios.delete(`/api/tasks/${id}`)
    await fetchTasks()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 状态标签样式
const statusTagType = (status) => {
  return {
    '待办': 'info',
    '进行中': 'warning',
    '已完成': 'success'
  }[status]
}

onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
.task-manager {
  max-width: 1200px;
  margin: 0 auto;
}

.task-card {
  background-color: #fff;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #303133;
}

.w-full {
  width: 100%;
}

.el-button-group {
  display: flex;
  gap: 8px;
}
</style> 