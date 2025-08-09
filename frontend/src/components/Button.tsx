import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'outline' | 'ghost';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  full?: boolean;
  small?: boolean;
}

const base = 'inline-flex items-center justify-center rounded-md font-medium transition text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:opacity-50 disabled:cursor-not-allowed';
const sizes = {
  normal: 'px-5 py-2.5',
  small: 'px-3 py-1.5'
};
const variants: Record<Variant,string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark shadow-sm',
  outline: 'border border-brand text-brand hover:bg-brand-light/70',
  ghost: 'text-brand hover:bg-brand-light/70'
};

export function Button({ variant='primary', full, small, className='', ...rest }: Props) {
  return (
    <button className={[base, variants[variant], small?sizes.small:sizes.normal, full?'w-full':'', className].join(' ').trim()} {...rest} />
  );
}
