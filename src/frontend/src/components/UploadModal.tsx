import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, LogIn, Upload, Video } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useBlobStorage } from "../hooks/useBlobStorage";
import { useAddVideo } from "../hooks/useQueries";

function generateId(): string {
  return `vid_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function UploadModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { upload } = useBlobStorage();
  const { isAuthenticated, login } = useAuth();
  const addVideo = useAddVideo();

  const reset = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleClose = () => {
    if (!isUploading) {
      setOpen(false);
      reset();
    }
  };

  const handleFile = (f: File) => {
    if (f.type.startsWith("video/")) {
      setFile(f);
      if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
    } else {
      toast.error("Please select a video file");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      setUploadProgress(30);
      const fileId = await upload(file);
      setUploadProgress(70);

      const id = generateId();
      await addVideo.mutateAsync({
        id,
        title: title.trim(),
        description: description.trim(),
        fileId,
      });
      setUploadProgress(100);

      toast.success("Video uploaded successfully!");
      setOpen(false);
      reset();
    } catch {
      toast.error("Upload failed. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleClose();
        else setOpen(true);
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          data-ocid="upload.open_modal_button"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-amber flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all"
          aria-label="Upload video"
        >
          <Video className="w-6 h-6" />
        </button>
      </DialogTrigger>

      <DialogContent
        data-ocid="upload.modal"
        className="max-w-lg bg-card border-border/60"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Share a Video
          </DialogTitle>
        </DialogHeader>

        {!isAuthenticated ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">
              Sign in to upload videos
            </p>
            <Button onClick={login} className="gap-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Drop zone */}
            <label
              data-ocid="upload.dropzone"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors block ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : file
                    ? "border-primary/50 bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-muted/30"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
              {file ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                    <Video className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drop a video file here or{" "}
                    <span className="text-primary">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    MP4, MOV, AVI, WebM
                  </p>
                </>
              )}
            </label>

            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="upload-title" className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="upload-title"
                data-ocid="upload.input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your video a title"
                required
                className="bg-muted/40 border-border"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="upload-desc" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="upload-desc"
                data-ocid="upload.textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your video (optional)"
                rows={3}
                className="bg-muted/40 border-border resize-none"
              />
            </div>

            {/* Progress */}
            {isUploading && (
              <div data-ocid="upload.loading_state" className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Uploading...
                  </span>
                  <span className="text-primary font-mono">
                    {uploadProgress}%
                  </span>
                </div>
                <Progress value={uploadProgress} className="h-1.5" />
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              data-ocid="upload.submit_button"
              disabled={!file || !title.trim() || isUploading}
              className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Upload Video
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
