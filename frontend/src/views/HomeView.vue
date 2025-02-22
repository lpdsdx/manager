<template>
  <div class="home">
    <div class="content-wrapper">
      <base-card class="statistics-card">
        <template #header>
          <div class="page-header">
            <h3>
              <span class="title-icon">📊</span>
              任务统计看板
            </h3>
            <p class="subtitle">记录每一个任务的进展 / Progress Tracking</p>
          </div>
        </template>
        
        <div class="dashboard-content">
          <el-row :gutter="16" class="status-cards">
            <el-col :span="8">
              <div class="status-card pending" @click="navigateToTasks('待办')">
                <div class="card-content">
                  <div class="card-header">
                    <div class="tag">
                      <span class="dot pending-dot"></span>
                      待办任务
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="number-wrapper">
                      <span class="number">{{ statistics.pending }}</span>
                      <span class="unit">个任务</span>
                    </div>
                    <p class="description">等待处理中...</p>
                  </div>
                </div>
              </div>
            </el-col>

            <el-col :span="8">
              <div class="status-card in-progress" @click="navigateToTasks('进行中')">
                <div class="card-content">
                  <div class="card-header">
                    <div class="tag">
                      <span class="dot progress-dot"></span>
                      进行中
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="number-wrapper">
                      <span class="number">{{ statistics.inProgress }}</span>
                      <span class="unit">个任务</span>
                    </div>
                    <p class="description">正在进行中...</p>
                  </div>
                </div>
              </div>
            </el-col>

            <el-col :span="8">
              <div class="status-card completed" @click="navigateToTasks('已完成')">
                <div class="card-content">
                  <div class="card-header">
                    <div class="tag">
                      <span class="dot completed-dot"></span>
                      已完成
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="number-wrapper">
                      <span class="number">{{ statistics.completed }}</span>
                      <span class="unit">个任务</span>
                    </div>
                    <p class="description">已经完成啦！</p>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>

          <div class="chart-section" v-if="showChart">
            <div class="section-header">
              <h4 class="section-title">
                <span class="title-icon">📈</span>
                数据分析
              </h4>
              <p class="section-desc">任务完成度概览</p>
            </div>
            <div class="chart-container">
              <div ref="chartRef" class="chart"></div>
            </div>
          </div>
        </div>
      </base-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '../utils/axios'
import * as echarts from 'echarts'
import BaseCard from '../components/BaseCard.vue'

const router = useRouter()
const route = useRoute()

const statistics = ref({
  pending: 0,
  inProgress: 0,
  completed: 0
})

const chartRef = ref(null)
const showChart = ref(false)
let chart = null

// 获取任务统计数据
const fetchTaskStatistics = async () => {
  try {
    const response = await axios.get('/api/tasks')
    const tasks = response.data

    // 统计各状态任务数量
    statistics.value = {
      pending: tasks.filter(task => task.status === '待办').length,
      inProgress: tasks.filter(task => task.status === '进行中').length,
      completed: tasks.filter(task => task.status === '已完成').length
    }

    // 更新图表
    updateChart()
  } catch (error) {
    console.error('获取任务统计失败:', error)
  }
}

// 更新图表
const updateChart = () => {
  if (!chartRef.value) return

  if (!chart) {
    chart = echarts.init(chartRef.value)
  }

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 'bottom'
    },
    series: [
      {
        name: '任务状态',
        type: 'pie',
        radius: ['35%', '60%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c}',
          fontSize: 12
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        data: [
          { 
            value: statistics.value.pending, 
            name: '待办',
            itemStyle: { color: '#909399' }
          },
          { 
            value: statistics.value.inProgress, 
            name: '进行中',
            itemStyle: { color: '#E6A23C' }
          },
          { 
            value: statistics.value.completed, 
            name: '已完成',
            itemStyle: { color: '#67C23A' }
          }
        ]
      }
    ]
  }

  chart.setOption(option)
}

// 计算总任务数
const totalTasks = computed(() => {
  return statistics.value.pending + statistics.value.inProgress + statistics.value.completed
})

// 跳转到任务列表
const navigateToTasks = (status) => {
  router.push({
    path: '/tasks',
    query: { status }
  }).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      console.error('导航错误:', err)
    }
  })
}

// 修改路由监听
watch(
  () => route.path,
  () => {
    fetchTaskStatistics()
  }
)

onMounted(async () => {
  await fetchTaskStatistics()
  showChart.value = true
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    chart?.resize()
  })
})
</script>

<style scoped>
.home {
  min-height: calc(100vh - 60px);
  background-color: #ffffff;
  overflow-y: auto;
  padding: 16px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100%;
}

.statistics-card {
  background: #ffffff;
  border: none;
  box-shadow: none;
  height: auto;
  min-height: calc(100vh - 92px);
}

.page-header {
  margin-bottom: 24px;
  padding: 0 8px;
}

.page-header h3 {
  font-size: 32px;
  font-weight: 700;
  color: #37352f;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 28px;
}

.subtitle {
  margin-top: 8px;
  color: #787774;
  font-size: 14px;
  font-weight: 400;
}

.dashboard-content {
  padding: 0 8px;
}

.status-cards {
  margin-bottom: 32px;
}

.status-card {
  background: #ffffff;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  transition: all 0.2s ease;
  height: 140px;
  cursor: pointer;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
}

.status-card:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  border-color: #d0d0d0;
}

.status-card::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 120%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%) scale(0);
  border-radius: 50%;
  opacity: 0;
  transition: transform 0.5s, opacity 0.3s;
}

.status-card:active::after {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  transition: 0s;
}

/* 添加点击提示 */
.status-card:hover::before {
  content: '点击查看详情';
  position: absolute;
  bottom: 12px;
  right: 12px;
  font-size: 12px;
  color: #909399;
  opacity: 0.6;
}

.card-content {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  margin-bottom: 12px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #37352f;
  font-weight: 500;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.pending-dot {
  background-color: #9B9B9B;
}

.progress-dot {
  background-color: #F5A623;
}

.completed-dot {
  background-color: #2ECC71;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.number-wrapper {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 4px;
}

.number {
  font-size: 32px;
  font-weight: 600;
  color: #37352f;
}

.unit {
  font-size: 14px;
  color: #787774;
}

.description {
  font-size: 14px;
  color: #787774;
  margin: 0;
}

.chart-section {
  background: #ffffff;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 16px;
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #37352f;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-desc {
  margin: 4px 0 0;
  color: #787774;
  font-size: 13px;
}

.chart-container {
  height: 360px;
}

/* 修改图表样式 */
:deep(.echarts) {
  background: transparent !important;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-wrapper {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .home {
    padding: 12px;
  }

  .page-header h3 {
    font-size: 24px;
  }

  .title-icon {
    font-size: 24px;
  }

  .status-card {
    height: 120px;
  }

  .number {
    font-size: 28px;
  }

  .chart-container {
    height: 300px;
  }
}

@media (max-width: 576px) {
  .el-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .el-col {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .status-card {
    margin-bottom: 12px;
  }

  .chart-section {
    padding: 16px;
  }
}
</style> 