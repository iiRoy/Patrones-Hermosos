import React, { useEffect, useState, useRef } from 'react';

interface IconProps {
  width?: number | string;
  height?: number | string;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
}

const withIconDecorator = (Icon: React.FC<IconProps>) => {
  const DecoratedIcon: React.FC<IconProps> = (props) => {
    const [strokeWidth, setStrokeWidth] = useState<number>(1.1);
    const iconRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const updateStrokeWidth = () => {
        if (iconRef.current) {
          const computedStyle = getComputedStyle(iconRef.current);
          const strokeWidthValue = parseFloat(
            computedStyle.getPropertyValue('--icon-stroke-width'),
          );

          if (!isNaN(strokeWidthValue)) {
            setStrokeWidth(strokeWidthValue);
          }
        }
      };

      updateStrokeWidth();

      const observer = new MutationObserver(updateStrokeWidth);
      if (iconRef.current) {
        observer.observe(iconRef.current, {
          attributes: true,
          attributeFilter: ['class', 'style'],
        });
      }

      return () => observer.disconnect();
    }, []);

    const finalStrokeWidth = props.strokeWidth ?? strokeWidth;

    const decoratedProps = {
      ...props,
      strokeColor: props.strokeColor || 'currentColor',
      fillColor: props.fillColor || 'currentColor',
      strokeWidth: finalStrokeWidth,
    };

    return (
      <div ref={iconRef}>
        <Icon {...decoratedProps} />
      </div>
    );
  };

  // Asignar un nombre de componente para que ESLint y React DevTools lo reconozcan
  DecoratedIcon.displayName = `withIconDecorator(${Icon.displayName || Icon.name || 'Component'})`;

  return DecoratedIcon;
};

export default withIconDecorator;
