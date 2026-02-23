import type { CardProps } from './types';
import './Card.css';

const Card = ({ children, className }: CardProps) => {
  return (
    <div className={`card ${className || ''}`}>
      {children}
    </div>
  );
};

export default Card;
