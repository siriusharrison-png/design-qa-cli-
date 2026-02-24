/**
 * 解析 design tokens 文件，提取颜色、间距、字号等规范值
 * 支持两种格式：CSS 文件（推荐）和 Figma JSON
 */

/**
 * 从 CSS 文件解析 tokens（推荐方式）
 * 直接读取 :root 中定义的 CSS 变量
 */
export function parseTokensFromCSS(cssContent) {
  const tokens = {
    colors: new Map(),      // 颜色值 -> 变量名
    spacing: new Set(),     // 允许的间距值
    fontSize: new Map(),    // 字号值 -> 变量名
    radius: new Set(),      // 允许的圆角值
  };

  // 匹配 CSS 变量定义：--变量名: 值;
  const varRegex = /--([a-zA-Z0-9-]+):\s*([^;]+);/g;
  let match;

  while ((match = varRegex.exec(cssContent)) !== null) {
    const varName = match[1];
    const value = match[2].trim();

    // 颜色（hex 格式）
    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
      tokens.colors.set(value.toLowerCase(), varName);
    }
    // 间距（px 值，变量名包含 space）
    else if (varName.startsWith('space-')) {
      const num = parseInt(value);
      if (!isNaN(num)) {
        tokens.spacing.add(num);
      }
    }
    // 字号（px 值，变量名包含 font-size）
    else if (varName.startsWith('font-size-')) {
      const num = parseInt(value);
      if (!isNaN(num)) {
        tokens.fontSize.set(num, varName);
      }
    }
    // 圆角（变量名包含 radius）
    else if (varName.startsWith('radius-')) {
      const num = parseInt(value);
      if (!isNaN(num)) {
        tokens.radius.add(num);
      }
    }
  }

  // 输出解析结果
  console.log(`   已加载 ${tokens.colors.size} 个颜色 tokens`);
  console.log(`   已加载 ${tokens.spacing.size} 个间距规范值`);
  console.log(`   已加载 ${tokens.fontSize.size} 个字号规范值`);
  console.log('');

  return tokens;
}

/**
 * 从 Figma JSON 解析 tokens（兼容旧格式）
 */
export function parseTokensFromJSON(tokensData) {
  const tokens = {
    colors: new Map(),      // 颜色值 -> token 名称
    spacing: new Set(),     // 允许的间距值
    fontSize: new Map(),    // 字号值 -> token 名称
    radius: new Set(),      // 允许的圆角值
  };

  // 递归遍历 tokens 对象
  function traverse(obj, path = []) {
    if (!obj || typeof obj !== 'object') return;

    const value = obj.value || obj.$value;
    const type = obj.type || obj.$type;

    if (value !== undefined && type) {
      // 把空格转换成 -，并转小写，生成有效的 CSS 变量名
      const tokenName = path
        .map(p => p.replace(/\s+/g, '-').toLowerCase())
        .join('-');

      if (type === 'color') {
        let hex = value;
        if (typeof hex === 'string' && hex.startsWith('#')) {
          if (hex.length === 9) {
            hex = hex.slice(0, 7);
          }
          tokens.colors.set(hex.toLowerCase(), tokenName);
        }
      } else if (type === 'spacing' || type === 'dimension') {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          tokens.spacing.add(num);
        }
      } else if (type === 'number' && path.some(p => p.includes('radius'))) {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          tokens.radius.add(num);
        }
      }

      return;
    }

    for (const [key, val] of Object.entries(obj)) {
      if (key.startsWith('$') || key === 'extensions' || key === 'description' || key === 'blendMode') {
        continue;
      }
      traverse(val, [...path, key]);
    }
  }

  traverse(tokensData);

  // 默认值
  if (tokens.spacing.size === 0) {
    [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 120].forEach(v => tokens.spacing.add(v));
  }

  if (tokens.radius.size === 0) {
    [0, 2, 4, 6, 8, 12, 16, 999].forEach(v => tokens.radius.add(v));
  }

  console.log(`   已加载 ${tokens.colors.size} 个颜色 tokens`);
  console.log(`   已加载 ${tokens.spacing.size} 个间距规范值`);
  console.log('');

  return tokens;
}

/**
 * 自动检测文件类型并解析（保持向后兼容）
 */
export function parseTokens(data) {
  // 如果是字符串，当作 CSS 内容
  if (typeof data === 'string') {
    return parseTokensFromCSS(data);
  }
  // 如果是对象，当作 JSON
  return parseTokensFromJSON(data);
}

/**
 * 查找最接近的 token 值
 */
export function findClosestSpacing(value, spacingSet) {
  const arr = Array.from(spacingSet).sort((a, b) => a - b);
  let closest = arr[0];
  let minDiff = Math.abs(value - closest);

  for (const s of arr) {
    const diff = Math.abs(value - s);
    if (diff < minDiff) {
      minDiff = diff;
      closest = s;
    }
  }

  return closest;
}
