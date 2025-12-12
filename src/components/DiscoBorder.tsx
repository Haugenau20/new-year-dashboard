import React, { CSSProperties, PropsWithChildren } from 'react';
import './DiscoBorder.css';

type DiscoBorderProps = PropsWithChildren<{
  className?: string;
  style?: CSSProperties;
}>;

const DiscoBorder: React.FC<DiscoBorderProps> = ({
  children,
  className,
  style
}: DiscoBorderProps) => {
  return (
    <div className={`disco-border ${className ?? ''}`} style={style}>
      {children}
    </div>
  );
};

export default DiscoBorder;
