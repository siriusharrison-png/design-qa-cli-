// 示例组件 - 包含一些硬编码的样式问题

const Button = ({ children }) => {
  return (
    <button
      style={{
        backgroundColor: '#1161fe',  // 应该用 var(--brand-0)
        color: '#ffffff',
        padding: '17px',             // 不在规范内，应该用 16px 或 24px
        fontSize: '14px',
        borderRadius: '4px',
        border: 'none',
      }}
    >
      {children}
    </button>
  );
};

export default Button;
