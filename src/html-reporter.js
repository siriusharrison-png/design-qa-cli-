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
  return '<style>/* TODO */</style>';
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
