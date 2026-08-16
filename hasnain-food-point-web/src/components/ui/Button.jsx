export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  as: Component = 'button',
  href,
  disabled = false,
  type = 'button',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary select-none';

  const sizeStyles = {
    sm: 'min-h-[40px] px-3.5 py-2 text-sm gap-1.5',
    md: 'min-h-[44px] px-5 py-2.5 text-base gap-2',
    lg: 'min-h-[50px] px-6 py-3 text-lg gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-accent-primary hover:bg-[#ff6f38] text-text-primary shadow-md shadow-accent-primary/20 font-semibold',
    secondary:
      'bg-accent-secondary hover:bg-[#f6c459] text-bg-primary font-bold shadow-md shadow-accent-secondary/20',
    whatsapp:
      'bg-whatsapp hover:bg-[#20bd5a] text-white font-semibold shadow-md shadow-whatsapp/25',
    outline:
      'bg-transparent border border-border-subtle hover:border-accent-primary/60 hover:bg-bg-surface text-text-primary',
    ghost:
      'bg-transparent hover:bg-bg-surface text-text-primary',
  };

  const chosenSize = sizeStyles[size] || sizeStyles.md;
  const chosenVariant = variantStyles[variant] || variantStyles.primary;

  const combinedClasses = `${baseStyles} ${chosenSize} ${chosenVariant} ${className}`;

  if (Component === 'a' || href) {
    return (
      <a
        href={href}
        className={combinedClasses}
        {...props}
      >
        {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
        <span>{children}</span>
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={combinedClasses}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
      <span>{children}</span>
    </button>
  );
}
