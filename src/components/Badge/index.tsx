import type { BadgeProps } from './types';
import classNames from 'classnames';
import './Badge.css';

import checkIconUrl from '../../assets/check.svg';

const VARIANT_ICONS: Record<NonNullable<BadgeProps['variant']>, string> = {
  check: checkIconUrl,
};

const Badge = ({ variant = 'check', className }: BadgeProps) => {
  const iconSrc = VARIANT_ICONS[variant];

  return (
    <span
      className={classNames('badge', `badge--${variant}`, className)}
      aria-hidden="true"
    >
      {iconSrc && (
        <img
          src={iconSrc}
          alt=""
          className="badge__icon"
        />
      )}
    </span>
  );
};

export default Badge;
