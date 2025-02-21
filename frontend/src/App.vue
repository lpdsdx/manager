<template>
  <el-container class="layout-container">
    <el-aside width="200px" class="aside">
      <div class="system-title">
        <h1>✨ 万物管理系统</h1>
        <p>简约而强大的平台</p>
      </div>
      <el-menu
        default-active="1"
        class="el-menu-vertical"
        :router="true"
      >
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><Management /></el-icon>
            <span>任务管理</span>
          </template>
          <el-menu-item index="/tasks">
            <el-icon><Tickets /></el-icon>
            <span>任务列表</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-main class="main-content">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { HomeFilled, Management, Tickets } from '@element-plus/icons-vue'
</script>

<style>
.layout-container {
  height: 100vh;
  width: 100vw;
}

.system-title {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 20px;
}

.system-title h1 {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  line-height: 1.4;
}

.system-title p {
  font-size: 12px;
  color: #7f8c8d;
  margin: 4px 0 0;
}

.aside {
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
}

.el-menu-vertical {
  border-right: none;
  flex: 1;
}

.main-content {
  background-color: #f5f7fa;
  padding: 20px;
}

/* 重置一些基础样式 */
body {
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
}
</style> 