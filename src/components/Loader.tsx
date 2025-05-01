import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'red' | 'green' | 'yellow' | 'gray';
  thickness?: 'thin' | 'normal' | 'thick';
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const thicknessMap = {
  thin: 'border',
  normal: 'border-2',
  thick: 'border-4',
};

const colorMap = {
  blue: 'border-blue-500',
  red: 'border-red-500',
  green: 'border-green-500',
  yellow: 'border-yellow-500',
  gray: 'border-gray-500',
};

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color = 'blue',
  thickness = 'normal',
}) => {
  const sizeClass = sizeMap[size];
  const thicknessClass = thicknessMap[thickness];
  const borderColorClass = colorMap[color];

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full ${sizeClass} ${thicknessClass} border-t-transparent ${borderColorClass} shadow-sm`}
      />
    </div>
  );
};

export default Loader;