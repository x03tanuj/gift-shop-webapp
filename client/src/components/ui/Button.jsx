import React from 'react';

/**
 * Reusable Button Component supporting DESIGN.md variants:
 * - 'primary' (WhatsApp Emerald CTA)
 * - 'secondary' (Royal Burgundy Outline CTA)
 * - 'call' (Warm Terracotta Phone CTA)
 */
export default function Button({
  variant = 'primary',
  children,
  href,
  onClick,
  type = 'button',
  className = '',
  icon,
  target,
  rel,
  fullWidth = true,
  ...rest
}) {
  const isLink = Boolean(href);

  // Base mobile-first layout styles with guaranteed 44px touch target
  const baseStyles = `inline-flex items-center justify-center font-sans select-none min-h-[44px] active:scale-[0.98] transition duration-150 cursor-pointer ${
    fullWidth ? 'w-full' : ''
  }`;

  // Variant-specific styling matching DESIGN.md
  let variantStyles = '';
  let defaultIcon = null;

  switch (variant) {
    case 'secondary':
    case 'outline':
      variantStyles =
        'border border-brand-burgundy text-brand-burgundy hover:bg-brand-burgundy hover:text-white font-semibold text-xs py-2.5 px-4 rounded-lg gap-2';
      defaultIcon = (
        <svg
          className="w-3.5 h-3.5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      );
      break;

    case 'call':
      variantStyles =
        'bg-[#FBF5F0] border border-brand-terracotta/40 text-brand-terracotta hover:bg-orange-50 font-medium text-xs py-2.5 px-4 rounded-lg gap-2';
      defaultIcon = (
        <svg
          className="w-3.5 h-3.5 text-brand-terracotta shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
      );
      break;

    case 'primary':
    case 'whatsapp':
    default:
      variantStyles =
        'bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs py-3 px-4 rounded-lg shadow-sm gap-2.5';
      defaultIcon = (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      );
      break;
  }

  const activeIcon = icon !== undefined ? icon : defaultIcon;
  const combinedClasses = `${baseStyles} ${variantStyles} ${className}`.trim();

  if (isLink) {
    return (
      <a
        href={href}
        className={combinedClasses}
        target={target}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        onClick={onClick}
        {...rest}
      >
        {variant !== 'secondary' && activeIcon}
        <span>{children}</span>
        {variant === 'secondary' && activeIcon}
      </a>
    );
  }

  return (
    <button type={type} className={combinedClasses} onClick={onClick} {...rest}>
      {variant !== 'secondary' && activeIcon}
      <span>{children}</span>
      {variant === 'secondary' && activeIcon}
    </button>
  );
}
