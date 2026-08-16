export default function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`min-h-[44px] px-6 py-3 rounded-xl font-medium transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
