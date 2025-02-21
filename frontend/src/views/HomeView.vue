<template>
  <div class="home">
    <el-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <h2>万物管理系统</h2>
        </div>
      </template>
      <div class="card-content">
        <p>欢迎使用万物管理系统，这是一个简约而强大的管理平台。</p>
        <div class="action-buttons">
          <el-button type="primary" @click="goToTasks">
            <el-icon><List /></el-icon>
            进入任务管理
          </el-button>
        </div>
      </div>
    </el-card>

    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover" class="stat-card">
            <template #header>
              <div class="stat-header">
                <el-icon><Timer /></el-icon>
                待办任务
              </div>
            </template>
            <div class="stat-number">8</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="stat-card">
            <template #header>
              <div class="stat-header">
                <el-icon><Loading /></el-icon>
                进行中
              </div>
            </template>
            <div class="stat-number">5</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="stat-card">
            <template #header>
              <div class="stat-header">
                <el-icon><Select /></el-icon>
                已完成
              </div>
            </template>
            <div class="stat-number">12</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { List, Timer, Loading, Select } from '@element-plus/icons-vue'

const router = useRouter()
const message = ref('欢迎使用Vue全栈应用')

const goToTasks = () => {
  router.push('/tasks')
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-card {
  margin-bottom: 30px;
  background-color: #fff;
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h2 {
  margin: 0;
  color: #303133;
  font-size: 24px;
  font-weight: 500;
}

.card-content {
  color: #606266;
  line-height: 1.6;
}

.action-buttons {
  margin-top: 20px;
}

.stats-cards {
  margin-top: 30px;
}

.stat-card {
  background-color: #fff;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  color: #409EFF;
  text-align: center;
  padding: 20px 0;
}

.el-icon {
  vertical-align: middle;
}
</style> 