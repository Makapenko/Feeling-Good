import React from 'react';
import styles from './ChapterImage.module.css';

interface ChapterImageProps {
  src: string;
  alt?: string;
  className?: string;
}

const ChapterImage: React.FC<ChapterImageProps> = ({ src, alt = '', className = '' }) => {
  // Убираем начальный слеш, если он есть
  const normalizedSrc = src.startsWith('/') ? src.slice(1) : src;
  
  return (
    <img 
      src={normalizedSrc}
      alt={alt}
      className={`${styles.image} ${className}`}
      onError={(e) => {
        console.error(`Failed to load image: ${src}`);
        e.currentTarget.style.display = 'none';
      }}
    />
  );
};

export default ChapterImage; 
