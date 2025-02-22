<template>
  <div class="task-manager">
    <base-card class="task-card">
      <template #header>
        <div class="card-header-content">
          <h3>
            任务列表
            <span v-if="filterStatus" class="status-filter">
              ({{ filterStatus }})
            </span>
          </h3>
          <el-button type="primary" class="add-button" @click="showDialog = true">
            <el-icon><CirclePlus /></el-icon>
            新建任务
          </el-button>
        </div>
      </template>

      <el-table 
        :data="tasks" 
        style="width: 100%" 
        border
        class="custom-table"
      >
        <el-table-column 
          prop="title" 
          label="任务名称" 
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column 
          prop="description" 
          label="任务详情" 
          min-width="200"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            {{ row.description || '-' }}
          </template>
        </el-table-column>
        <el-table-column 
          prop="status" 
          label="状态" 
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column 
          prop="start_date" 
          label="开始时间" 
          width="160"
          align="center"
        >
          <template #default="{ row }">
            {{ formatDate(row.start_date) }}
          </template>
        </el-table-column>
        <el-table-column 
          prop="due_date" 
          label="截止时间" 
          width="160"
          align="center"
        >
          <template #default="{ row }">
            {{ row.due_date ? formatDate(row.due_date) : '-' }}
          </template>
        </el-table-column>
        <el-table-column 
          label="操作" 
          width="120" 
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <el-button-group>
              <el-button 
                size="small" 
                type="primary" 
                @click="editTask(row)"
                title="编辑"
              >
                <el-icon><EditPen /></el-icon>
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                @click="deleteTask(row.id)"
                title="删除"
              >
                <el-icon><RemoveFilled /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </base-card>

    <el-dialog 
      v-model="showDialog" 
      :title="isEditing ? '编辑任务' : '新建任务'" 
      width="500px"
      custom-class="custom-dialog"
      @closed="handleDialogClose"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="任务名称" required>
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="任务详情">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" class="w-full">
            <el-option label="待办" value="待办" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="form.start_date"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
            placeholder="选择开始时间"
            class="w-full"
          />
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
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../utils/axios'
import { 
  CirclePlus, 
  EditPen, 
  RemoveFilled 
} from '@element-plus/icons-vue'
import BaseCard from '../components/BaseCard.vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const tasks = ref([])
const showDialog = ref(false)
const isEditing = ref(false)
const currentTaskId = ref(null)
const filterStatus = ref('')

// 获取任务列表方法 - 移到前面
const fetchTasks = async () => {
  try {
    console.log('开始获取任务列表')
    const response = await axios.get('/api/tasks')
    let filteredTasks = response.data
    
    // 根据状态过滤任务
    if (filterStatus.value) {
      filteredTasks = filteredTasks.filter(task => task.status === filterStatus.value)
    }
    
    tasks.value = filteredTasks
    console.log('获取到的任务数据:', tasks.value)
  } catch (error) {
    console.error('获取任务列表失败:', error)
    ElMessage.error('获取任务列表失败')
  }
}

// 表单数据
const form = ref({
  title: '',
  description: '',
  status: '待办',
  start_date: null,
  due_date: null
})

// 路由参数监听
watch(
  [() => route.path, () => route.query.status],
  ([newPath, newStatus]) => {
    if (newPath === '/tasks') {
      filterStatus.value = newStatus || ''
      fetchTasks()
    }
  },
  { immediate: true }
)

// 重置表单函数
const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    status: '待办',
    start_date: null,
    due_date: null
  }
}

// 提交表单
const submitTask = async () => {
  try {
    const url = isEditing.value 
      ? `/api/tasks/${currentTaskId.value}`
      : '/api/tasks'
      
    const method = isEditing.value ? 'put' : 'post'
    
    // 打印提交的表单数据
    console.log('提交的表单数据:', form.value)
    
    const formData = {
      ...form.value,
      start_date: form.value.start_date || null,
      due_date: form.value.due_date || null
    }
    
    console.log('处理后的表单数据:', formData)
    
    const response = await axios[method](url, formData)
    console.log('服务器响应:', response.data)
    
    resetForm()
    showDialog.value = false
    await fetchTasks()
    ElMessage.success(isEditing.value ? '任务更新成功' : '任务创建成功')
    
    if (isEditing.value) {
      isEditing.value = false
      currentTaskId.value = null
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
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
    start_date: task.start_date || null,
    due_date: task.due_date || null
  }
  showDialog.value = true
}

// 删除任务
const deleteTask = async (id) => {
  try {
    await axios.delete(`/api/tasks/${id}`)
    await fetchTasks()
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败')
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

// 添加日期格式化函数
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  
  // 如果是无效日期，返回 '-'
  if (isNaN(date.getTime())) return '-'
  
  // 统一使用中文日期时间格式
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// 监听对话框关闭
const handleDialogClose = () => {
  resetForm()
  isEditing.value = false
  currentTaskId.value = null
}

// 添加返回首页方法
const backToHome = () => {
  router.push('/')
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

.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header-content h3 {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
}

.add-button {
  border-radius: 8px;
  padding: 8px 16px;
}

.custom-table {
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
}

/* 自定义表格样式 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th) {
  background-color: #f8fafc !important;
  color: #2c3e50;
  font-weight: 600;
}

:deep(.el-table td) {
  padding: 12px 0;
}

/* 自定义对话框样式 */
:deep(.custom-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 20px;
  background-color: #f8fafc;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-dialog__footer) {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
}

/* 表单样式美化 */
:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-input) {
  border-radius: 8px;
}

:deep(.el-button) {
  border-radius: 8px;
  padding: 8px 20px;
}

.status-filter {
  font-size: 16px;
  color: #909399;
  margin-left: 8px;
  font-weight: normal;
}
</style> 