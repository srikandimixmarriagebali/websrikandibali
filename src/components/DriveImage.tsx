import React, { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';

/**
 * Extracts Google Drive File ID from various URL formats
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  
  const trimmed = url.trim();

  // Pattern 1: https://drive.google.com/file/d/FILE_ID/view...
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]{20,})/i);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  // Pattern 2: https://drive.google.com/open?id=FILE_ID or id=FILE_ID
  const matchParamId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{20,})/i);
  if (matchParamId && matchParamId[1]) return matchParamId[1];

  // Pattern 3: https://lh3.googleusercontent.com/d/FILE_ID
  const matchLh3 = trimmed.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]{20,})/i);
  if (matchLh3 && matchLh3[1]) return matchLh3[1];

  // Pattern 4: Raw file ID directly (usually 25-45 chars without slashes)
  if (/^[a-zA-Z0-9_-]{25,45}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Converts any Google Drive link to direct display image URL
 */
export function getDriveDirectUrl(src: string): string {
  if (!src) return '';
  const driveId = extractGoogleDriveId(src);
  if (driveId) {
    return `https://lh3.googleusercontent.com/d/${driveId}`;
  }
  return src;
}

/**
 * Fallback alternative URL in case primary CDN has permission / rate issues
 */
export function getDriveThumbnailUrl(src: string, width = 1200): string {
  if (!src) return '';
  const driveId = extractGoogleDriveId(src);
  if (driveId) {
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w${width}`;
  }
  return src;
}

export interface DriveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  className?: string;
  alt?: string;
  showSkeleton?: boolean;
}

export const DriveImage: React.FC<DriveImageProps> = ({
  src,
  fallbackSrc = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
  className = '',
  alt = 'Image',
  showSkeleton = true,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(() => getDriveDirectUrl(src) || fallbackSrc);
  const [fallbackAttempt, setFallbackAttempt] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setCurrentSrc(getDriveDirectUrl(src) || fallbackSrc);
    setFallbackAttempt(0);
    setIsLoaded(false);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const driveId = extractGoogleDriveId(src);
    
    if (driveId && fallbackAttempt === 0) {
      setFallbackAttempt(1);
      setCurrentSrc(getDriveThumbnailUrl(src, 1200));
    } else if (driveId && fallbackAttempt === 1) {
      setFallbackAttempt(2);
      setCurrentSrc(`https://drive.google.com/uc?export=view&id=${driveId}`);
    } else {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
      if (props.onError) {
        props.onError(e);
      }
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-slate-800/40">
      {/* Skeleton Shimmer Loading Placeholder */}
      {showSkeleton && !isLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse">
          <ImageIcon className="w-8 h-8 text-slate-500/50 mb-1 animate-bounce" />
          <span className="text-[10px] font-medium text-slate-400/70 tracking-wider uppercase">Loading Image...</span>
        </div>
      )}

      {/* Actual Image */}
      <img
        {...props}
        src={currentSrc}
        alt={alt}
        className={`${className} transition-all duration-500 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105 blur-sm'
        }`}
        onLoad={(e) => {
          setIsLoaded(true);
          if (props.onLoad) props.onLoad(e);
        }}
        onError={handleError}
        loading={props.loading || 'lazy'}
      />
    </div>
  );
};
