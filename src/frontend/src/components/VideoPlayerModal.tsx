import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Trash2, User, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { Video } from "../backend";
import { useAuth } from "../hooks/useAuth";
import { useBlobStorage } from "../hooks/useBlobStorage";
import { useDeleteVideo } from "../hooks/useQueries";

interface VideoPlayerModalProps {
  video: Video | null;
  onClose: () => void;
}

function formatRelativeTime(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const diff = Date.now() - ms;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} days ago`;
  if (hours > 0) return `${hours} hours ago`;
  if (minutes > 0) return `${minutes} minutes ago`;
  return "Just now";
}

export function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
  const { getUrl } = useBlobStorage();
  const { principal } = useAuth();
  const deleteVideo = useDeleteVideo();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!video && videoRef.current) {
      videoRef.current.pause();
    }
  }, [video]);

  const isOwner =
    video && principal && video.uploader.toString() === principal.toString();

  const handleDelete = async () => {
    if (!video) return;
    try {
      await deleteVideo.mutateAsync(video.id);
      toast.success("Video deleted");
      onClose();
    } catch {
      toast.error("Failed to delete video");
    }
  };

  return (
    <Dialog open={!!video} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        data-ocid="player.modal"
        className="max-w-4xl w-full p-0 overflow-hidden bg-card border-border/60"
        showCloseButton={false}
      >
        {video && (
          <>
            {/* Video player */}
            <div className="relative bg-black aspect-video">
              {/* biome-ignore lint/a11y/useMediaCaption: user-uploaded video content */}
              <video
                ref={videoRef}
                key={video.fileId}
                src={getUrl(video.fileId)}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>

            {/* Info bar */}
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <DialogHeader>
                    <DialogTitle className="font-display text-xl text-foreground text-left">
                      {video.title}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span className="font-mono text-xs">
                        {video.uploader.toString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatRelativeTime(video.timestamp)}</span>
                    </div>
                  </div>
                  {video.description && (
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {video.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isOwner && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled={deleteVideo.isPending}
                      data-ocid="player.delete_button"
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    data-ocid="player.close_button"
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Close</span>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
