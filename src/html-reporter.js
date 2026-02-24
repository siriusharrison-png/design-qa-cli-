/**
 * 生成 HTML 格式的检测报告
 */

export function generateHTMLReport(issues, options = {}) {
  const { projectName = 'Design QA Report', date = new Date() } = options;

  // 统计数据
  const summary = {
    color: issues.filter(i => i.type === 'color').length,
    spacing: issues.filter(i => i.type === 'spacing').length,
    fontSize: issues.filter(i => i.type === 'fontSize').length,
    total: issues.length
  };

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  ${getStyles()}
</head>
<body>
  ${getHeader(projectName, date)}
  ${getSummaryCards(summary)}
  ${getExportButtons()}
  ${getIssuesList(issues)}
  ${getScripts(issues, summary, projectName, date)}
</body>
</html>`;
}

function getStyles() {
  return `<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --brand-primary-1: #1161fe;
  --text-1: #181818;
  --text-2: #616161;
  --text-3: #9e9e9e;
  --fill-3: #f2f3f5;
  --fill-4: #f7f8fa;
  --fill-5: #ffffff;
  --border-3: #ebecef;
  --success-1: #00b42a;
  --warning-1: #ff7d00;
  --red-1: #f53f3f;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: var(--fill-4);
  color: var(--text-1);
  line-height: 1.6;
  padding: 24px;
}

.container {
  max-width: 960px;
  margin: 0 auto;
}

header {
  background: var(--fill-5);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  border: 1px solid var(--border-3);
}

header h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

header .meta {
  color: var(--text-3);
  font-size: 14px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.card {
  background: var(--fill-5);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  border: 1px solid var(--border-3);
}

.card .icon { font-size: 24px; margin-bottom: 8px; }
.card .count { font-size: 32px; font-weight: 700; }
.card .label { color: var(--text-3); font-size: 14px; }

.card.color .count { color: var(--brand-primary-1); }
.card.spacing .count { color: var(--warning-1); }
.card.font-size .count { color: var(--success-1); }

.export-bar {
  background: var(--fill-5);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid var(--border-3);
  display: flex;
  gap: 12px;
}

.export-bar button {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid var(--border-3);
  background: var(--fill-5);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.export-bar button:hover {
  border-color: var(--brand-primary-1);
  color: var(--brand-primary-1);
}

.issues-list {
  background: var(--fill-5);
  border-radius: 8px;
  border: 1px solid var(--border-3);
  overflow: hidden;
}

.file-group {
  border-bottom: 1px solid var(--border-3);
}

.file-group:last-child { border-bottom: none; }

.file-header {
  background: var(--fill-3);
  padding: 12px 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.issue-item {
  padding: 16px;
  border-bottom: 1px solid var(--fill-3);
}

.issue-item:last-child { border-bottom: none; }

.issue-type {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  margin-right: 8px;
}

.issue-type.color { background: #e6edfa; color: var(--brand-primary-1); }
.issue-type.spacing { background: #fff7e8; color: var(--warning-1); }
.issue-type.fontSize { background: #e8ffea; color: var(--success-1); }

.issue-line {
  color: var(--text-3);
  font-size: 13px;
}

.color-compare {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
  padding: 12px;
  background: var(--fill-4);
  border-radius: 4px;
}

.color-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid var(--border-3);
}

.color-value {
  font-family: monospace;
  font-size: 13px;
}

.arrow {
  color: var(--text-3);
  font-size: 20px;
}

.suggestion {
  color: var(--success-1);
  font-weight: 500;
}

.no-issues {
  text-align: center;
  padding: 48px;
  color: var(--text-3);
}

.no-issues .icon { font-size: 48px; margin-bottom: 16px; }
</style>`;
}

function getHeader(projectName, date) {
  return '<header><!-- TODO --></header>';
}

function getSummaryCards(summary) {
  return '<section><!-- TODO --></section>';
}

function getExportButtons() {
  return '<div><!-- TODO --></div>';
}

function getIssuesList(issues) {
  return '<main><!-- TODO --></main>';
}

function getScripts(issues, summary, projectName, date) {
  return '<script>/* TODO */</script>';
}
