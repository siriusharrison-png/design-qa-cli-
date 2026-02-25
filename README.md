# Design QA

Detect hardcoded styles in code and suggest design tokens.

检测代码中的硬编码样式，建议使用设计系统 tokens。

[English](#english) | [中文](#中文)

---

## English

### Features

- **Color Detection** - Find hardcoded hex colors, suggest CSS variables
- **Font Size Detection** - Find hardcoded font sizes, suggest CSS variables
- **Spacing Detection** - Find non-standard spacing values
- **Auto Fix** - Automatically replace hardcoded colors and font sizes
- **HTML Report** - Generate visual reports with color comparison
- **Export** - Export issues as JSON or CSV

### Installation

```bash
# Using npx (recommended)
npx design-qa check ./src

# Global install
npm install -g design-qa
design-qa check ./src
```

### Usage

```bash
# Check for issues
design-qa check ./src

# Auto-fix colors and font sizes
design-qa check ./src --fix

# Generate HTML report
design-qa check ./src --output report.html

# Use custom tokens file
design-qa check ./src --tokens ./my-tokens.css
```

### Tokens File Format

Create a CSS file with your design tokens:

```css
:root {
  /* Colors */
  --brand-primary-1: #1161fe;
  --text-1: #181818;

  /* Spacing (prefix with space-) */
  --space-4: 4px;
  --space-8: 8px;
  --space-16: 16px;

  /* Font sizes (prefix with font-size-) */
  --font-size-14: 14px;
  --font-size-16: 16px;
}
```

### Output Example

```
🔍 Design QA 检测中...

📄 Button.tsx
   🎨 Line 8  #1161fe → var(--brand-primary-1)
   📏 Line 12  15px → 16px

📄 Card.css
   🔤 Line 13  18px → var(--font-size-18)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Found 3 issues:
   🎨 Colors: 1
   📏 Spacing: 1
   🔤 Font sizes: 1
```

### Supported File Types

- `.js` / `.jsx` / `.ts` / `.tsx`
- `.css` / `.scss`
- `.vue` / `.svelte`

---

## 中文

### 功能特性

- **颜色检测** - 找出硬编码的十六进制颜色，建议使用 CSS 变量
- **字号检测** - 找出硬编码的字号，建议使用 CSS 变量
- **间距检测** - 找出不在规范内的间距值
- **自动修复** - 自动将硬编码的颜色和字号替换为变量
- **HTML 报告** - 生成可视化报告，包含颜色对比
- **数据导出** - 导出 JSON 或 CSV 格式

### 安装

```bash
# 使用 npx（推荐）
npx design-qa check ./src

# 全局安装
npm install -g design-qa
design-qa check ./src
```

### 使用方法

```bash
# 检测问题
design-qa check ./src

# 自动修复颜色和字号
design-qa check ./src --fix

# 生成 HTML 报告
design-qa check ./src --output report.html

# 使用自定义 tokens 文件
design-qa check ./src --tokens ./my-tokens.css
```

### Tokens 文件格式

创建一个包含设计变量的 CSS 文件：

```css
:root {
  /* 颜色 */
  --brand-primary-1: #1161fe;
  --text-1: #181818;

  /* 间距（以 space- 开头） */
  --space-4: 4px;
  --space-8: 8px;
  --space-16: 16px;

  /* 字号（以 font-size- 开头） */
  --font-size-14: 14px;
  --font-size-16: 16px;
}
```

### 输出示例

```
🔍 Design QA 检测中...

📄 Button.tsx
   🎨 第8行  #1161fe → var(--brand-primary-1)
   📏 第12行  15px → 16px

📄 Card.css
   🔤 第13行  18px → var(--font-size-18)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ 检测完成，发现 3 个问题：
   🎨 颜色问题: 1 个
   📏 间距问题: 1 个
   🔤 字号问题: 1 个
```

### 支持的文件类型

- `.js` / `.jsx` / `.ts` / `.tsx`
- `.css` / `.scss`
- `.vue` / `.svelte`

---

## License

MIT
