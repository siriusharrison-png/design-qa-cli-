# 自动修复功能实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 添加 `--fix` 参数，自动将硬编码的颜色和字号替换为 CSS 变量。

**Architecture:** 新增 `src/fixer.js` 模块处理文件修复逻辑，修改 scanner 返回可修复信息，修改 CLI 添加 --fix 参数。

**Tech Stack:** Node.js、ES Modules、正则表达式替换

---

### Task 1: 创建 fixer 模块

**Files:**
- Create: `src/fixer.js`

**Step 1: 创建模块文件**

```javascript
/**
 * 自动修复硬编码的颜色和字号
 */

import { readFileSync, writeFileSync } from 'fs';

/**
 * 修复单个文件中的问题
 * @param {string} filePath - 文件绝对路径
 * @param {Array} issues - 该文件的问题列表
 * @returns {number} 修复的问题数量
 */
export function fixFile(filePath, issues) {
  // 只修复颜色和字号
  const fixableIssues = issues.filter(i => i.type === 'color' || i.type === 'fontSize');

  if (fixableIssues.length === 0) {
    return 0;
  }

  let content = readFileSync(filePath, 'utf-8');
  let fixedCount = 0;

  for (const issue of fixableIssues) {
    if (issue.type === 'color') {
      // 颜色：#1161fe → var(--brand-primary-1)
      const regex = new RegExp(issue.value, 'gi');
      const newContent = content.replace(regex, issue.suggestion);
      if (newContent !== content) {
        content = newContent;
        fixedCount++;
      }
    } else if (issue.type === 'fontSize') {
      // 字号：18px → var(--font-size-18)
      // 需要匹配 font-size: 18px 的模式
      const pxValue = issue.value; // 如 "18px"
      const regex = new RegExp(`(font-size\\s*:\\s*)${pxValue}`, 'gi');
      const newContent = content.replace(regex, `$1${issue.suggestion}`);
      if (newContent !== content) {
        content = newContent;
        fixedCount++;
      }
    }
  }

  if (fixedCount > 0) {
    writeFileSync(filePath, content, 'utf-8');
  }

  return fixedCount;
}

/**
 * 修复多个文件
 * @param {string} basePath - 基础路径
 * @param {Array} issues - 所有问题列表
 * @returns {Object} 修复统计 { color, fontSize, total }
 */
export function fixFiles(basePath, issues) {
  const stats = { color: 0, fontSize: 0, total: 0 };

  // 按文件分组
  const grouped = {};
  for (const issue of issues) {
    if (!grouped[issue.file]) {
      grouped[issue.file] = [];
    }
    grouped[issue.file].push(issue);
  }

  // 逐个文件修复
  for (const [file, fileIssues] of Object.entries(grouped)) {
    const filePath = `${basePath}/${file}`;
    const fixedCount = fixFile(filePath, fileIssues);

    // 统计
    for (const issue of fileIssues) {
      if (issue.type === 'color' || issue.type === 'fontSize') {
        stats[issue.type]++;
      }
    }
    stats.total += fixedCount;
  }

  return stats;
}
```

**Step 2: 验证模块可导入**

Run: `cd ~/Desktop/design-qa-cli && node -e "import('./src/fixer.js').then(m => console.log('OK'))"`
Expected: `OK`

**Step 3: Commit**

```bash
git add src/fixer.js
git commit -m "feat: add fixer module for auto-fix"
```

---

### Task 2: 修改 CLI 添加 --fix 参数

**Files:**
- Modify: `bin/cli.js`

**Step 1: 添加 fix 参数到 parseArgs**

在 `result` 对象中添加：
```javascript
fix: false,
```

在参数解析循环中添加：
```javascript
} else if (arg === '--fix') {
  result.fix = true;
}
```

**Step 2: 更新帮助信息**

在选项列表中添加：
```javascript
  --fix                 自动修复颜色和字号问题
```

**Step 3: 导入 fixer 模块**

在文件顶部添加：
```javascript
import { fixFiles } from '../src/fixer.js';
```

**Step 4: 添加修复逻辑**

在 `printReport(issues, colors);` 之后，HTML 报告生成之前添加：

```javascript
    // 4. 自动修复（如果指定了 --fix）
    if (args.fix) {
      const fixStats = fixFiles(targetPath, issues);

      if (fixStats.total > 0) {
        console.log(colors.green(`\n✅ 已修复 ${fixStats.total} 个问题`));
        if (fixStats.color > 0) console.log(`   🎨 颜色: ${fixStats.color} 个`);
        if (fixStats.fontSize > 0) console.log(`   🔤 字号: ${fixStats.fontSize} 个`);
      }

      const spacingCount = issues.filter(i => i.type === 'spacing').length;
      if (spacingCount > 0) {
        console.log(colors.yellow(`\n⚠️ 剩余 ${spacingCount} 个间距问题需手动处理`));
      }
    }
```

**Step 5: Commit**

```bash
git add bin/cli.js
git commit -m "feat: add --fix option for auto-fix"
```

---

### Task 3: 修改 reporter 显示修复状态

**Files:**
- Modify: `src/reporter.js`

**Step 1: 修改 printReport 函数签名**

```javascript
export function printReport(issues, colors, options = {}) {
  const { fixMode = false } = options;
```

**Step 2: 在问题输出后添加修复状态**

修改输出问题的代码，在每行末尾添加修复状态：

```javascript
      const fixable = issue.type === 'color' || issue.type === 'fontSize';
      const fixStatus = fixMode
        ? (fixable ? colors.green(' ✓ 已修复') : colors.dim(' (不自动修复)'))
        : '';

      console.log(`   ${icon} ${lineInfo}  ${value} → ${suggestion}${fixStatus}`);
```

**Step 3: Commit**

```bash
git add src/reporter.js
git commit -m "feat: add fix status to reporter output"
```

---

### Task 4: 更新 CLI 调用 reporter

**Files:**
- Modify: `bin/cli.js`

**Step 1: 传递 fixMode 参数给 reporter**

修改 printReport 调用：

```javascript
    // 3. 输出报告
    printReport(issues, colors, { fixMode: args.fix });
```

**Step 2: Commit**

```bash
git add bin/cli.js
git commit -m "feat: pass fixMode to reporter"
```

---

### Task 5: 测试完整功能

**Step 1: 先运行检测（不修复）**

Run: `cd ~/Desktop/design-qa-cli && node bin/cli.js check ./test`

Expected: 显示问题列表，无修复状态

**Step 2: 运行修复模式**

Run: `cd ~/Desktop/design-qa-cli && node bin/cli.js check ./test --fix`

Expected:
- 显示问题列表，带 "✓ 已修复" 或 "(不自动修复)" 状态
- 显示修复统计
- 显示剩余间距问题提示

**Step 3: 验证文件已修改**

Run: `cd ~/Desktop/design-qa-cli && git diff test/`

Expected: 显示颜色和字号的替换

**Step 4: 恢复测试文件**

Run: `cd ~/Desktop/design-qa-cli && git checkout test/`

**Step 5: Final Commit**

```bash
git add .
git commit -m "feat: complete auto-fix feature"
```

---

## 完成标准

- [ ] `--fix` 参数可用
- [ ] 颜色问题自动修复为 `var(--变量名)`
- [ ] 字号问题自动修复为 `var(--font-size-xx)`
- [ ] 间距问题不自动修复，显示提示
- [ ] 修复后显示统计信息
