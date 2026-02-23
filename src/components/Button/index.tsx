import { Button as AriaButton } from 'react-aria-components';
import classNames from 'classnames';
import type { ButtonProps } from './types';
import './Button.css';

const Button = ({
	ref,
	children,
	id,
	label,
	onPress,
	className,
	'aria-label': ariaLabel,
}: ButtonProps) => {
	const text = label ?? (typeof children === 'string' ? children : null);
	const effectiveAriaLabel = ariaLabel ?? text ?? undefined;

	return (
		<AriaButton
			ref={ref}
			id={id}
			className={classNames('app-button', className)}
			onPress={onPress}
			aria-label={effectiveAriaLabel}
		>
			{children != null ? (
				typeof children === 'string' ? (
					<span className='app-button__text'>{children}</span>
				) : (
					children
				)
			) : text != null ? (
				<span className='app-button__text'>{text}</span>
			) : null}
		</AriaButton>
	);
};

export default Button;
