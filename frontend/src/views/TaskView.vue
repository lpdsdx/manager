<template>
  <div class="task-manager">
    <div class="table-toolbar">
      <div class="left-actions">
        <span class="selected-count" v-if="selectedTasks.length">
          已选择 {{ selectedTasks.length }} 项
        </span>
      </div>
      <div class="right-actions">
        <el-button 
          type="danger" 
          :disabled="!selectedTasks.length"
          @click="batchDelete"
          class="toolbar-button"
          plain
        >
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
        <el-button 
          type="primary" 
          class="toolbar-button"
          @click="showDialog = true"
          plain
        >
          <el-icon><CirclePlus /></el-icon>
          创建新任务
        </el-button>
      </div>
    </div>

    <el-table 
      :data="tasks" 
      style="width: 100%" 
      border
      class="custom-table"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column 
        prop="description" 
        label="任务内容" 
        min-width="300"
        sortable="custom"
      >
        <template #default="{ row }">
          <div class="content-cell">
            <div class="content-wrapper">
              <el-tooltip
                :content="row.description || '无内容'"
                placement="top"
                :disabled="!isTextOverflow(row.description)"
              >
                <div class="text-container">
                  <template v-if="row.isEditingDesc">
                    <el-input
                      v-model="row.description"
                      type="textarea"
                      :rows="2"
                      @blur="handleCellBlur(row, 'description')"
                      size="small"
                      ref="descInput"
                      @keyup.enter="handleCellBlur(row, 'description')"
                      @keyup.esc="cancelEdit(row, 'description')"
                    />
                  </template>
                  <span v-else class="content-text">{{ row.description || '-' }}</span>
                </div>
              </el-tooltip>
              <div class="actions-container">
                <el-tooltip content="编辑内容" placement="top" :show-after="0">
                  <el-button 
                    class="action-icon"
                    @click.stop="handleCellClick(row, 'description')"
                  >
                    <el-icon><EditPen /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="删除任务" placement="top" :show-after="0">
                  <el-button 
                    class="action-icon delete"
                    @click.stop="handleDelete(row.id)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column 
        prop="status" 
        label="状态" 
        width="120"
        align="center"
        sortable="custom"
      >
        <template #default="{ row }">
          <el-popover
            placement="bottom"
            :width="100"
            trigger="hover"
            popper-class="status-popover"
          >
            <template #default>
              <div class="status-options">
                <div 
                  v-for="status in ['待办', '进行中', '已完成']" 
                  :key="status"
                  class="status-option"
                  :class="{ active: row.status === status }"
                  @click="updateStatus(row, status)"
                >
                  {{ status }}
                </div>
              </div>
            </template>
            <template #reference>
              <el-tag :type="statusTagType(row.status)">
                {{ row.status }}
              </el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column 
        prop="priority" 
        label="优先级" 
        width="120"
        align="center"
        sortable="custom"
      >
        <template #default="{ row }">
          <el-popover
            placement="bottom"
            :width="100"
            trigger="hover"
            popper-class="status-popover"
          >
            <template #default>
              <div class="status-options">
                <div 
                  v-for="priority in ['高', '中', '低']" 
                  :key="priority"
                  class="status-option"
                  :class="{ active: row.priority === priority }"
                  @click="updatePriority(row, priority)"
                >
                  {{ priority }}
                </div>
              </div>
            </template>
            <template #reference>
              <el-tag :type="priorityTagType(row.priority)">
                {{ row.priority || '未设置' }}
              </el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column 
        prop="start_date" 
        label="开始时间" 
        width="180"
        align="center"
        sortable="custom"
      >
        <template #default="{ row }">
          <el-popover
            placement="bottom"
            :width="220"
            trigger="click"
            popper-class="date-popover"
          >
            <template #default>
              <div class="date-picker-wrapper">
                <el-date-picker
                  v-model="row.start_date"
                  type="datetime"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  @change="updateDate(row, 'start_date')"
                  size="small"
                  style="width: 100%"
                />
              </div>
            </template>
            <template #reference>
              <div class="date-cell">
                {{ formatDate(row.start_date) }}
              </div>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column 
        prop="due_date" 
        label="截止时间" 
        width="180"
        align="center"
        sortable="custom"
      >
        <template #default="{ row }">
          <el-popover
            placement="bottom"
            :width="220"
            trigger="click"
            popper-class="date-popover"
          >
            <template #default>
              <div class="date-picker-wrapper">
                <el-date-picker
                  v-model="row.due_date"
                  type="datetime"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  @change="updateDate(row, 'due_date')"
                  size="small"
                  style="width: 100%"
                />
              </div>
            </template>
            <template #reference>
              <div class="date-cell">
                {{ formatDate(row.due_date) }}
              </div>
            </template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog 
      v-model="showDialog" 
      :title="isEditing ? '编辑任务' : '新建任务'"
      class="custom-dialog"
      width="500px"
    >
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="task-form"
      >
        <el-form-item label="任务内容" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入任务内容"
          />
        </el-form-item>

        <el-form-item label="优先级" prop="priority">
          <el-select 
            v-model="form.priority" 
            placeholder="请选择优先级"
            class="form-select"
          >
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select 
            v-model="form.status" 
            placeholder="请选择状态"
            class="form-select"
          >
            <el-option label="待办" value="待办" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </el-form-item>

        <el-form-item label="开始时间" prop="start_date">
          <el-date-picker
            v-model="form.start_date"
            type="datetime"
            placeholder="选择开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            class="form-date-picker"
          />
        </el-form-item>

        <el-form-item label="截止时间" prop="due_date">
          <el-date-picker
            v-model="form.due_date"
            type="datetime"
            placeholder="选择截止时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            class="form-date-picker"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../utils/axios'
import { 
  CirclePlus, 
  EditPen, 
  Delete 
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const tasks = ref([])
const showDialog = ref(false)
const isEditing = ref(false)
const currentTaskId = ref(null)
const filterStatus = ref('')
const selectedTasks = ref([])

// 添加排序相关的响应式数据
const sortBy = ref('')
const sortOrder = ref('ascending')

// 计算排序后的任务列表
const sortedTasks = computed(() => {
  let result = [...tasks.value]
  
  // 排序处理
  if (sortBy.value) {
    result.sort((a, b) => {
      let aValue = a[sortBy.value]
      let bValue = b[sortBy.value]
      
      // 处理日期类型
      if (sortBy.value.includes('date')) {
        aValue = aValue ? new Date(aValue).getTime() : 0
        bValue = bValue ? new Date(bValue).getTime() : 0
      }
      
      // 处理空值
      if (!aValue) return sortOrder.value === 'ascending' ? -1 : 1
      if (!bValue) return sortOrder.value === 'ascending' ? 1 : -1
      
      // 比较值
      if (aValue < bValue) return sortOrder.value === 'ascending' ? -1 : 1
      if (aValue > bValue) return sortOrder.value === 'ascending' ? 1 : -1
      return 0
    })
  }
  
  return result
})

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
    
    // 为每个任务添加编辑状态标记
    tasks.value = filteredTasks.map(task => ({
      ...task,
      showActions: false,
      isEditingDesc: false
    }))
    console.log('获取到的任务数据:', tasks.value)
  } catch (error) {
    console.error('获取任务列表失败:', error)
    ElMessage.error('获取任务列表失败')
  }
}

// 修改表单数据结构
const form = ref({
  description: '',
  priority: '中', // 设置默认优先级
  status: '待办',
  start_date: null,
  due_date: null
})

// 表单验证规则
const rules = {
  description: [
    { required: true, message: '请输入任务内容', trigger: 'blur' },
    { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
  ],
  priority: [
    { required: true, message: '请选择优先级', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ],
  start_date: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  due_date: [
    { required: true, message: '请选择截止时间', trigger: 'change' }
  ]
}

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

// 重置表单方法
const resetForm = () => {
  form.value = {
    description: '',
    priority: '中',
    status: '待办',
    start_date: null,
    due_date: null
  }
}

// 提交表单
const submitForm = async () => {
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
    description: task.description,
    priority: task.priority,
    status: task.status,
    start_date: task.start_date || null,
    due_date: task.due_date || null
  }
  showDialog.value = true
}

// 修改删除处理方法
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个任务吗？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await deleteTask(id)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除确认错误:', error)
      ElMessage.error('操作失败，请重试')
    }
  }
}

// 删除任务方法保持不变
const deleteTask = async (id) => {
  try {
    await axios.delete(`/api/tasks/${id}`)
    ElMessage.success('删除成功')
    await fetchTasks()
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error(error.response?.data?.message || '删除失败')
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

// 优先级标签类型
const priorityTagType = (priority) => {
  const types = {
    '高': 'danger',
    '中': 'warning',
    '低': 'info'
  }
  return types[priority] || 'info'
}

// 修改日期格式化函数
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return '-'
    
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  } catch (error) {
    console.error('日期格式化错误:', error)
    return '-'
  }
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

// 处理表格选择变化
const handleSelectionChange = (selection) => {
  selectedTasks.value = selection
}

// 批量删除方法
const batchDelete = async () => {
  if (!selectedTasks.value.length) return

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedTasks.value.length} 个任务吗？`,
      '批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 使用 Promise.all 并添加错误处理
    try {
      const deletePromises = selectedTasks.value.map(task => 
        axios.delete(`/api/tasks/${task.id}`)
          .catch(err => {
            console.error(`删除任务 ${task.id} 失败:`, err)
            throw err
          })
      )
      
      await Promise.all(deletePromises)
      ElMessage.success('批量删除成功')
      selectedTasks.value = [] // 清空选中的任务
      await fetchTasks() // 重新获取任务列表
    } catch (error) {
      console.error('批量删除过程中出错:', error)
      ElMessage.error('批量删除失败，请重试')
    }
  } catch (error) {
    // 用户取消删除操作，不需要显示错误提示
    if (error !== 'cancel') {
      console.error('批量删除确认框错误:', error)
      ElMessage.error('操作失败，请重试')
    }
  }
}

// 修改处理单元格点击方法
const handleCellClick = (row, field) => {
  // 设置编辑状态
  row.isEditingDesc = true
  // 创建临时备份
  row._originalValue = row[field]
  
  // 在下一个 tick 后聚焦输入框
  nextTick(() => {
    const input = document.querySelector('.content-cell .el-textarea__inner')
    if (input) {
      input.focus()
    }
  })
}

// 添加取消编辑方法
const cancelEdit = (row, field) => {
  row.isEditingDesc = false
  row[field] = row._originalValue
}

// 修改处理单元格失焦方法
const handleCellBlur = async (row, field) => {
  // 如果正在编辑中，不要立即失焦
  if (row.isEditingDesc) {
    // 清除编辑状态
    row.isEditingDesc = false
    
    // 如果值没有变化，不需要更新
    if (row._originalValue === row[field]) {
      return
    }

    try {
      // 构建更新数据
      const updateData = {
        ...row,
        description: row[field]
      }
      
      // 移除临时属性
      delete updateData.isEditingDesc
      delete updateData._originalValue
      delete updateData.showActions

      // 发送更新请求
      await axios.put(`/api/tasks/${row.id}`, updateData)
      ElMessage.success('更新成功')
      await fetchTasks()
    } catch (error) {
      console.error('更新失败:', error)
      // 恢复原值
      row[field] = row._originalValue
      ElMessage.error('更新失败，请重试')
    }
  }
}

// 更新状态方法
const updateStatus = async (row, newStatus) => {
  if (row.status === newStatus) return
  
  try {
    const updateData = { ...row, status: newStatus }
    // 移除不需要的属性
    delete updateData.showActions
    delete updateData.isEditingDesc
    
    await axios.put(`/api/tasks/${row.id}`, updateData)
    ElMessage.success('状态更新成功')
    await fetchTasks()
  } catch (error) {
    console.error('状态更新失败:', error)
    ElMessage.error('状态更新失败')
  }
}

// 更新优先级方法
const updatePriority = async (row, newPriority) => {
  if (row.priority === newPriority) return
  
  try {
    const updateData = { ...row, priority: newPriority }
    delete updateData.showActions
    delete updateData.isEditingDesc
    
    await axios.put(`/api/tasks/${row.id}`, updateData)
    ElMessage.success('优先级更新成功')
    await fetchTasks()
  } catch (error) {
    console.error('优先级更新失败:', error)
    ElMessage.error('优先级更新失败')
  }
}

// 更新日期方法
const updateDate = async (row, field) => {
  try {
    const updateData = { ...row }
    delete updateData.showActions
    delete updateData.isEditingDesc
    
    await axios.put(`/api/tasks/${row.id}`, updateData)
    ElMessage.success('时间更新成功')
    await fetchTasks()
  } catch (error) {
    console.error('时间更新失败:', error)
    ElMessage.error('时间更新失败')
  }
}

// 添加判断文本是否溢出的方法
const isTextOverflow = (text) => {
  if (!text) return false
  const element = document.createElement('span')
  element.style.visibility = 'hidden'
  element.style.whiteSpace = 'nowrap'
  element.style.position = 'absolute'
  element.textContent = text
  document.body.appendChild(element)
  const isOverflow = element.offsetWidth > 300 // 根据列宽调整
  document.body.removeChild(element)
  return isOverflow
}

// 处理排序变化
const handleSortChange = ({ prop, order }) => {
  if (!prop || !order) {
    sortBy.value = ''
    sortOrder.value = 'ascending'
  } else {
    sortBy.value = prop
    sortOrder.value = order
  }
}

onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
.task-manager {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 16px;
}

.table-toolbar {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.selected-count {
  font-size: 14px;
  color: #606266;
  background: #f4f4f5;
  padding: 4px 8px;
  border-radius: 4px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.modern-button {
  border-radius: 20px !important;
  padding: 10px 20px !important;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none !important;
}

.modern-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.create-button {
  background-color: #ecf5ff !important;
  color: #409eff !important;
}

.create-button:hover {
  background-color: #409eff !important;
  color: white !important;
}

.delete-button {
  background-color: #fef0f0 !important;
  color: #f56c6c !important;
}

.delete-button:hover {
  background-color: #f56c6c !important;
  color: white !important;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.action-btn {
  padding: 6px;
}

/* Notion 风格的表格 */
.custom-table {
  margin-top: 12px;
  border: none !important;
  box-shadow: none !important;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.el-table) {
  background-color: transparent !important;
  --el-table-border-color: #eaecef;
}

:deep(.el-table::before),
:deep(.el-table::after) {
  display: none;
}

:deep(.el-table__inner-wrapper::before) {
  display: none;
}

:deep(.el-table th) {
  background-color: transparent !important;
  border-bottom: 1px solid var(--el-table-border-color) !important;
  padding: 6px 0 !important;
  font-weight: 500;
  color: #606266;
}

:deep(.el-table td) {
  padding: 4px 0 !important;
  border-bottom: 1px solid var(--el-table-border-color) !important;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background-color: #f5f7fa !important;
}

/* 修改内容单元格样式 */
.content-cell {
  position: relative;
  padding: 4px 8px;
}

.content-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 32px;
}

.text-container {
  flex: 1;
  min-width: 0;
  max-width: calc(100% - 80px); /* 为按钮留出空间 */
}

.content-text {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #2c3e50;
  line-height: 1.5;
  font-size: 14px;
  transition: all 0.2s ease;
}

.actions-container {
  flex-shrink: 0;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.content-wrapper:hover .actions-container {
  opacity: 1;
}

.action-icon {
  width: 28px !important;
  height: 28px !important;
  padding: 4px !important;
  border: none !important;
  background-color: #f5f7fa !important;
  color: #606266 !important;
  border-radius: 4px !important;
  transition: all 0.2s ease;
}

.action-icon:hover {
  background-color: #ecf5ff !important;
  color: #409eff !important;
  transform: scale(1.1);
}

.action-icon.delete:hover {
  background-color: #fef0f0 !important;
  color: #f56c6c !important;
}

/* 确保表格布局 */
:deep(.el-table__body-wrapper) {
  overflow-x: visible !important;
}

:deep(.el-table__cell) {
  padding: 8px 0 !important;
}

/* 状态和优先级标签样式 */
:deep(.el-tag) {
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  border: none;
  background-color: #f5f7fa;
}

/* 日期单元格样式 */
.date-cell {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 13px;
  color: #606266;
}

/* 修改选择列样式 */
:deep(.el-table-column--selection .cell) {
  padding-left: 8px;
}

/* 修改表头样式 */
.card-header {
  padding: 16px 0;
  display: flex;
  align-items: center;
}

.header-left h3 {
  font-size: 16px;
  color: #1a1a1a;
  font-weight: 500;
}

/* 修改动画效果 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.status-filter {
  font-size: 16px;
  color: #909399;
  margin-left: 8px;
  font-weight: normal;
}

/* 优化删除确认框样式 */
:deep(.el-popconfirm__main) {
  padding: 12px 0;
  font-size: 14px;
}

:deep(.el-popover.el-popper) {
  min-width: 220px;
  padding: 12px;
}

.cell-content {
  padding: 4px 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 4px;
}

.cell-content:hover {
  background-color: #f5f7fa;
}

.clickable-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.clickable-tag:hover {
  transform: scale(1.05);
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  padding: 0 8px;
}

:deep(.el-input__inner) {
  height: 32px;
}

:deep(.el-select .el-input) {
  width: 100%;
}

:deep(.el-date-editor.el-input) {
  width: 100%;
}

.content-cell {
  position: relative;
  padding: 8px;
  z-index: 10;
}

.content-wrapper {
  position: relative;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  min-height: 40px;
}

.content-text {
  display: block;
  color: #2c3e50;
  line-height: 1.6;
  word-break: break-word;
  position: relative;
}

.content-actions {
  position: absolute;
  left: 12px;
  bottom: -44px;
  transform: none;
  z-index: 20;
}

.actions-container {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 20px;
  background-color: rgba(248, 249, 250, 0.95);
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.action-icon {
  width: 32px !important;
  height: 32px !important;
  padding: 6px !important;
  border: none !important;
  background-color: transparent !important;
  color: #606266 !important;
  transition: all 0.2s ease;
  border-radius: 8px !important;
}

.action-icon:hover {
  transform: scale(1.1);
  background-color: rgba(64, 158, 255, 0.1) !important;
  color: #409eff !important;
}

.action-icon.delete:hover {
  background-color: rgba(245, 108, 108, 0.1) !important;
  color: #f56c6c !important;
}

/* 确保表格内容可见 */
:deep(.el-table__body) {
  overflow: visible !important;
}

:deep(.el-table__body-wrapper) {
  overflow: visible !important;
}

:deep(.el-table) {
  overflow: visible !important;
}

:deep(.el-table__row) {
  position: relative;
  z-index: 1;
}

:deep(.el-table__row:hover) {
  z-index: 11;
}

:deep(.el-table__cell) {
  position: relative;
}

.status-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-option {
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.status-option:hover {
  background-color: #f5f7fa;
}

.status-option.active {
  background-color: #ecf5ff;
  color: #409eff;
}

:deep(.status-popover) {
  padding: 12px;
  min-width: 100px;
}

/* 移除不需要的样式 */
.action-buttons,
.action-btn {
  display: none;
}

.date-cell {
  padding: 6px 12px;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.date-cell:hover {
  background-color: #ecf5ff;
  color: #409eff;
}

.date-picker-wrapper {
  padding: 8px;
}

:deep(.date-popover) {
  padding: 0;
}

:deep(.el-date-editor.el-input) {
  width: 100%;
}

:deep(.el-tag) {
  cursor: pointer;
  transition: all 0.3s;
}

:deep(.el-tag:hover) {
  transform: scale(1.05);
}

/* 优先级标签样式 */
:deep(.el-tag.el-tag--danger) {
  background-color: #fef0f0;
  border-color: #fde2e2;
  color: #f56c6c;
}

:deep(.el-tag.el-tag--warning) {
  background-color: #fdf6ec;
  border-color: #faecd8;
  color: #e6a23c;
}

:deep(.el-tag.el-tag--info) {
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
}

/* 优化表单样式 */
.task-form {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.form-select,
.form-date-picker {
  width: 100%;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
  background-color: white;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #2c3e50;
}

:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper),
:deep(.el-date-editor.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover),
:deep(.el-select .el-input__wrapper:hover),
:deep(.el-date-editor.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.el-textarea__inner) {
  padding: 4px 8px;
  min-height: 32px !important;
  line-height: 1.5;
  font-size: 14px;
  border-radius: 4px;
  resize: none;
}

:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}

/* 自定义对话框样式 */
:deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 20px;
  background-color: #f8fafc;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-dialog__body) {
  padding: 0;
}

:deep(.el-dialog__footer) {
  padding: 20px;
  border-top: 1px solid #ebeef5;
  background-color: #f8fafc;
}

/* 移除卡片悬浮效果 */
:deep(.no-hover) {
  display: none;
}

/* 优化按钮提示样式 */
:deep(.el-tooltip__trigger) {
  display: inline-flex;
}

/* 确保按钮提示可见 */
:deep(.el-popper) {
  z-index: 9999 !important;
}

/* 添加表格工具栏样式 */
.table-toolbar {
  padding: 16px 0;
  margin-bottom: 16px;
}

.left-actions {
  display: flex;
  align-items: center;
}

.right-actions {
  display: flex;
  gap: 12px;
}

.toolbar-button {
  font-size: 14px !important;
  height: 36px !important;
  padding: 0 16px !important;
}

/* 移除分页相关样式 */
.pagination-wrapper,
:deep(.el-pagination),
:deep(.el-pagination .el-select .el-input),
:deep(.el-pagination__sizes),
:deep(.el-pagination__total),
:deep(.el-pagination__jump) {
  display: none;
}
</style> 