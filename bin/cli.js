#!/usr/bin/env node

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseTokens } from '../src/tokens-parser.js';
import { scanFiles } from '../src/scanner.js';
import { printReport } from '../src/reporter.js';
import { generateHTMLReport } from '../src/html-reporter.js';
import { fixFiles } from '../src/fixer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 颜色输出
const colors = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  blue: (s) => `\x1b[34m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

// 帮助信息
function showHelp() {
  console.log(`
${colors.blue('Design QA CLI')} - 检测代码是否正确使用设计系统 tokens

${colors.yellow('用法:')}
  design-qa check <目录> [选项]

${colors.yellow('选项:')}
  --tokens, -t <文件>   指定 tokens 文件路径 (默认: design-tokens.css)
  --output, -o <文件>   输出 HTML 报告 (如: report.html)
  --fix                 自动修复颜色和字号问题
  --help, -h            显示帮助信息

${colors.yellow('示例:')}
  design-qa check ./src
  design-qa check ./src --tokens ./tokens.json
`);
}

// 解析命令行参数
function parseArgs(args) {
  const result = {
    command: null,
    target: null,
    tokensFile: 'design-tokens.css',
    output: null,
    fix: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === 'check') {
      result.command = 'check';
      result.target = args[++i];
    } else if (arg === '--tokens' || arg === '-t') {
      result.tokensFile = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      result.output = args[++i];
    } else if (arg === '--fix') {
      result.fix = true;
    } else if (arg === '--help' || arg === '-h') {
      result.command = 'help';
    }
  }

  return result;
}

// 主函数
async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.command === 'help' || !args.command) {
    showHelp();
    process.exit(0);
  }

  if (args.command === 'check') {
    if (!args.target) {
      console.log(colors.red('错误: 请指定要检测的目录'));
      showHelp();
      process.exit(1);
    }

    const targetPath = resolve(process.cwd(), args.target);
    const tokensPath = resolve(process.cwd(), args.tokensFile);

    if (!existsSync(targetPath)) {
      console.log(colors.red(`错误: 目录不存在 - ${targetPath}`));
      process.exit(1);
    }

    if (!existsSync(tokensPath)) {
      console.log(colors.red(`错误: tokens 文件不存在 - ${tokensPath}`));
      console.log(colors.dim('提示: 使用 --tokens 指定 tokens 文件路径'));
      process.exit(1);
    }

    console.log(colors.blue('\n🔍 Design QA 检测中...\n'));

    // 1. 解析 tokens（支持 CSS 和 JSON 格式）
    const tokensContent = readFileSync(tokensPath, 'utf-8');
    let tokens;

    if (tokensPath.endsWith('.css')) {
      // CSS 文件：直接传入内容
      tokens = parseTokens(tokensContent);
    } else {
      // JSON 文件：先解析再传入
      tokens = parseTokens(JSON.parse(tokensContent));
    }

    // 2. 扫描代码
    const issues = await scanFiles(targetPath, tokens);

    // 3. 输出报告
    printReport(issues, colors, { fixMode: args.fix });

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

    // 5. 生成 HTML 报告（如果指定了输出）
    if (args.output) {
      const html = generateHTMLReport(issues, {
        projectName: 'Design QA Report',
        date: new Date()
      });
      writeFileSync(args.output, html, 'utf-8');
      console.log(colors.green(`\n📄 HTML 报告已生成: ${args.output}`));
    }
  }
}

main().catch((err) => {
  console.error('错误:', err.message);
  process.exit(1);
});
