export default function SectionHeading({ title, subtitle, className = '' }) {
  return (
    <div className={`text-center my-6 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-text-primary">{title}</h2>
      {subtitle && <p className="text-sm md:text-base text-text-secondary mt-1">{subtitle}</p>}
    </div>
  );
}
