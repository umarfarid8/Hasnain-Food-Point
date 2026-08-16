export default function SectionHeading({
  title,
  subtitle,
  badge,
  icon: Icon,
  align = 'center',
  className = '',
}) {
  const alignmentClass = align === 'left' ? 'text-left items-start' : 'text-center items-center';

  return (
    <div className={`flex flex-col my-6 md:my-8 ${alignmentClass} ${className}`}>
      {badge && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/25 text-accent-secondary text-xs font-semibold uppercase tracking-wider mb-2">
          {Icon && <Icon className="w-3.5 h-3.5 text-accent-primary" />}
          <span>{badge}</span>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-text-primary tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-text-secondary mt-1.5 max-w-xl">
          {subtitle}
        </p>
      )}
      <div className={`h-1 w-12 bg-accent-primary rounded-full mt-3 ${align === 'left' ? '' : 'mx-auto'}`} />
    </div>
  );
}
