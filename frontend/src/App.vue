<template>
  <el-container class="layout-container">
    <el-aside width="200px" class="aside">
      <el-menu
        default-active="1"
        class="el-menu-vertical"
        :router="true"
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><List /></el-icon>
            <span>任务管理</span>
          </template>
          <el-menu-item index="/tasks">
            <el-icon><Document /></el-icon>
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
import { House, List, Document } from '@element-plus/icons-vue'
</script>

<style>
.layout-container {
  height: 100vh;
  width: 100vw;
}

.aside {
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
}

.el-menu-vertical {
  height: 100%;
  border-right: none;
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