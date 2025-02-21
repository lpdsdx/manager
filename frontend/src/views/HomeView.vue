<template>
  <div class="home">
    <!-- 欢迎卡片 -->
    <el-card class="welcome-card">
      <div class="card-content">
        <p class="welcome-text">👋 今天也要元气满满哦～</p>
        <el-button type="primary" class="start-button" @click="goToTasks">
          <el-icon><Promotion /></el-icon>
          开始管理任务
        </el-button>
      </div>
    </el-card>

    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover" class="stat-card todo-card">
            <template #header>
              <div class="stat-header">
                <el-icon><Clock /></el-icon>
                <span>待办任务</span>
                <div class="stat-badge">8</div>
              </div>
            </template>
            <div class="stat-content">
              <div class="stat-number">8</div>
              <div class="stat-label">项待处理</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="stat-card progress-card">
            <template #header>
              <div class="stat-header">
                <el-icon><Refresh /></el-icon>
                <span>进行中</span>
                <div class="stat-badge warning">5</div>
              </div>
            </template>
            <div class="stat-content">
              <div class="stat-number">5</div>
              <div class="stat-label">项进行中</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="stat-card done-card">
            <template #header>
              <div class="stat-header">
                <el-icon><CircleCheckFilled /></el-icon>
                <span>已完成</span>
                <div class="stat-badge success">12</div>
              </div>
            </template>
            <div class="stat-content">
              <div class="stat-number">12</div>
              <div class="stat-label">项已完成</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Promotion, 
  Clock, 
  Refresh, 
  CircleCheckFilled 
} from '@element-plus/icons-vue'

const router = useRouter()

const goToTasks = () => {
  router.push('/tasks')
}
</script>

<style scoped>
/* 引入Google字体 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.home {
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.welcome-card {
  margin-bottom: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}

.welcome-text {
  font-size: 18px;
  font-weight: 500;
  color: #34495e;
  margin: 0;
}

.start-button {
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stats-cards {
  margin-top: 30px;
}

.stat-card {
  background-color: #fff;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: none;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
  position: relative;
}

.stat-badge {
  position: absolute;
  right: 20px;
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.stat-badge.warning {
  background-color: #fff3e0;
  color: #f57c00;
}

.stat-badge.success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.stat-content {
  padding: 20px;
  text-align: center;
}

.stat-number {
  font-size: 42px;
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 8px;
  line-height: 1;
}

.todo-card .stat-number {
  color: #1976d2;
}

.progress-card .stat-number {
  color: #f57c00;
}

.done-card .stat-number {
  color: #2e7d32;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
}

.el-icon {
  font-size: 20px;
}

/* 添加一些趣味性的动画效果 */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
}

.stat-card:hover .stat-number {
  animation: float 2s ease-in-out infinite;
}
</style> 