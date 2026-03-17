import { Clock, Play, User } from "lucide-react";
import type { Video } from "../backend";

interface VideoCardProps {
  video: Video;
  index: number;
  onClick: (video: Video) => void;
}

function formatRelativeTime(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const diff = Date.now() - ms;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

function truncatePrincipal(principal: { toString(): string }): string {
  const str = principal.toString();
  if (str.length <= 12) return str;
  return `${str.slice(0, 6)}...${str.slice(-4)}`;
}

export function VideoCard({ video, index, onClick }: VideoCardProps) {
  return (
    <div
      data-ocid={`feed.item.${index}`}
      className="group card-glow rounded-lg overflow-hidden bg-card border border-border/60"
    >
      {/* Thumbnail */}
      <button
        type="button"
        className="relative w-full aspect-video bg-muted overflow-hidden cursor-pointer"
        onClick={() => onClick(video)}
        aria-label={`Play ${video.title}`}
      >
        {/* Dark cinematic placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(ellipse at ${(index * 37) % 100}% ${(index * 53) % 100}%, oklch(0.35 0.08 ${(index * 60 + 30) % 360}) 0%, oklch(0.12 0.005 285) 70%)`,
            }}
          />
          <div className="relative z-10 w-12 h-12 rounded-full bg-background/30 border border-white/10 flex items-center justify-center backdrop-blur-sm">
            <div className="w-2 h-6 bg-white/20 rounded-full mr-[-2px]" />
            <div className="w-2 h-6 bg-white/20 rounded-full" />
          </div>
        </div>

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div
            data-ocid={`video.play_button.${index}`}
            className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-amber transition-transform group-hover:scale-110"
          >
            <Play className="w-6 h-6 text-primary-foreground fill-current ml-0.5" />
          </div>
        </div>

        {/* Badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white/80 font-mono">
          VIDEO
        </div>
      </button>

      {/* Info */}
      <button
        type="button"
        className="w-full text-left p-3 hover:bg-muted/20 transition-colors"
        onClick={() => onClick(video)}
      >
        <h3 className="font-display font-600 text-sm text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
            {video.description}
          </p>
        )}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span className="font-mono">
              {truncatePrincipal(video.uploader)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatRelativeTime(video.timestamp)}</span>
          </div>
        </div>
      </button>
    </div>
  );
}
