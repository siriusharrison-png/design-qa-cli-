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

    // 统计可修复的问题数
    for (const issue of fileIssues) {
      if (issue.type === 'color') stats.color++;
      if (issue.type === 'fontSize') stats.fontSize++;
    }
    stats.total += fixedCount;
  }

  return stats;
}
