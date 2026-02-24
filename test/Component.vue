<template>
  <div class="vue-card">
    <h3>Vue Component</h3>
    <p>测试 Vue 文件扫描</p>
  </div>
</template>

<style scoped>
/* 用例 3.3：Vue 文件类型支持 */
.vue-card {
  background: #1161fe;     /* 应该报错：硬编码品牌色 */
  padding: 15px;           /* 应该报错：不规范间距 */
  color: #181818;          /* 应该报错：硬编码文字色 */
}
</style>
