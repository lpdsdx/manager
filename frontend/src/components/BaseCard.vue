<template>
  <el-card class="base-card" :class="className">
    <template #header v-if="showHeader">
      <div class="card-header">
        <slot name="header"></slot>
      </div>
    </template>
    <div class="card-body">
      <slot></slot>
    </div>
  </el-card>
</template>

<script setup>
defineProps({
  showHeader: {
    type: Boolean,
    default: true
  },
  className: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.base-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: none;
  overflow: hidden;
}

.base-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.card-body {
  padding: 20px;
}

/* 预设主题 */
.primary-card {
  border-top: 3px solid #409EFF;
}

.success-card {
  border-top: 3px solid #67C23A;
}

.warning-card {
  border-top: 3px solid #E6A23C;
}

.danger-card {
  border-top: 3px solid #F56C6C;
}
</style> 