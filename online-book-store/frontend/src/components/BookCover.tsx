import React, { useState } from 'react';
import { BookOpen, Sparkles, Bookmark } from 'lucide-react';

interface BookCoverProps {
  coverImage?: string;
  title: string;
  author: string;
  category?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BookCover: React.FC<BookCoverProps> = ({
  coverImage,
  title,
  author,
  category = 'Literature',
  className = '',
  size = 'md',
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Category specific color themes for rich book jackets
  const getTheme = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('computer') || c.includes('tech')) {
      return {
        bg: 'from-slate-900 via-indigo-950 to-blue-950',
        accent: 'text-sky-400 border-sky-400/40 bg-sky-500/10',
        ribbon: 'bg-sky-500',
        spine: 'border-l-4 border-sky-400/50',
      };
    } else if (c.includes('self') || c.includes('growth')) {
      return {
        bg: 'from-emerald-950 via-teal-950 to-slate-950',
        accent: 'text-emerald-400 border-emerald-400/40 bg-emerald-500/10',
        ribbon: 'bg-emerald-500',
        spine: 'border-l-4 border-emerald-400/50',
      };
    } else if (c.includes('sci-fi') || c.includes('fantasy')) {
      return {
        bg: 'from-purple-950 via-indigo-950 to-slate-950',
        accent: 'text-purple-300 border-purple-400/40 bg-purple-500/10',
        ribbon: 'bg-purple-500',
        spine: 'border-l-4 border-purple-400/50',
      };
    } else if (c.includes('business') || c.includes('finance')) {
      return {
        bg: 'from-amber-950 via-stone-900 to-slate-950',
        accent: 'text-amber-400 border-amber-400/40 bg-amber-500/10',
        ribbon: 'bg-amber-500',
        spine: 'border-l-4 border-amber-400/50',
      };
    } else if (c.includes('psychology')) {
      return {
        bg: 'from-cyan-950 via-slate-900 to-indigo-950',
        accent: 'text-cyan-300 border-cyan-400/40 bg-cyan-500/10',
        ribbon: 'bg-cyan-500',
        spine: 'border-l-4 border-cyan-400/50',
      };
    } else {
      return {
        bg: 'from-rose-950 via-red-950 to-slate-950',
        accent: 'text-rose-300 border-rose-400/40 bg-rose-500/10',
        ribbon: 'bg-rose-500',
        spine: 'border-l-4 border-rose-400/50',
      };
    }
  };

  const theme = getTheme(category);

  // If thumbnail size (like cart drawer / orders)
  if (size === 'sm') {
    return (
      <div
        className={`relative overflow-hidden rounded-lg shrink-0 bg-gradient-to-br ${theme.bg} ${theme.spine} flex flex-col justify-between p-1.5 shadow-sm text-white select-none ${className}`}
      >
        {!imageFailed && coverImage ? (
          <img
            src={coverImage}
            alt={title}
            onError={() => setImageFailed(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}
        <div className="relative z-10">
          <span className="text-[8px] uppercase tracking-wider text-amber-300 font-bold block truncate">
            {category}
          </span>
          <p className="text-[10px] font-black leading-tight line-clamp-2 mt-0.5">{title}</p>
        </div>
        <span className="text-[8px] opacity-75 truncate relative z-10">{author}</span>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-gradient-to-br ${theme.bg} ${theme.spine} text-white flex flex-col justify-between p-5 select-none ${className}`}
    >
      {/* Background Decorative Patterns */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/10 to-transparent pointer-events-none" />
      <BookOpen className="absolute right-3 bottom-3 w-28 h-28 text-white/[0.04] stroke-[1] pointer-events-none -rotate-12" />

      {/* Try loading original cover image if available */}
      {!imageFailed && coverImage && (
        <img
          src={coverImage}
          alt=""
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />
      )}

      {/* Styled Book Jacket (visible if no image, or while loading, or if image fails) */}
      <div
        className={`relative z-10 flex flex-col justify-between h-full transition-opacity duration-300 ${
          imageLoaded && !imageFailed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Top Jacket Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${theme.accent}`}
            >
              {category}
            </span>
            <Bookmark className="w-4 h-4 text-amber-400/80 fill-amber-400/30" />
          </div>

          <div className="w-8 h-0.5 bg-amber-400/50 rounded-full" />
        </div>

        {/* Center Title & Author */}
        <div className="my-auto py-4 space-y-2">
          <h3 className="font-serif font-black text-lg sm:text-xl leading-snug tracking-tight text-white/95 line-clamp-3 drop-shadow-md">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 pt-1">
            <div className="w-3 h-px bg-white/40" />
            <p className="text-xs text-white/80 font-medium tracking-wide truncate">
              {author}
            </p>
          </div>
        </div>

        {/* Bottom Publisher / Quality Badge */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60 uppercase tracking-widest font-semibold">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Authentic Edition
          </span>
          <span className="font-mono">ReadVault</span>
        </div>
      </div>
    </div>
  );
};
