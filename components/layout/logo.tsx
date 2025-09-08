import LogoIcon from '@/public/images/logo.svg';
import Link from 'next/link';

export const Logo = () => {
  return (
    <Link className="flex items-center gap-2 shrink-0" href="/">
      <LogoIcon className="h-10" />
      <div className="hidden sm:flex flex-col uppercase text-sm leading-none">
        <div>ЮЖНЫЙ</div>
        <div>ВОЕННЫЙ</div>
        <div>ОКРУГ</div>
      </div>
    </Link>
  );
};
