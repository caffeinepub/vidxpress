import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Clapperboard, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Video } from "./backend";
import { CreatorsHub } from "./components/CreatorsHub";
import { Header } from "./components/Header";
import { UploadModal } from "./components/UploadModal";
import { VideoCard } from "./components/VideoCard";
import { VideoPlayerModal } from "./components/VideoPlayerModal";
import { useAllVideos } from "./hooks/useQueries";

const sampleVideos: Video[] = [
  {
    id: "sample_1",
    title: "Cinematic Tokyo Night Walk — Neon Reflections",
    description:
      "A slow, meditative walk through Shinjuku at 2am. Rain-soaked streets and neon signs blurring into abstract art.",
    fileId: "sample_1",
    timestamp: BigInt(Date.now() - 2 * 3600 * 1000) * BigInt(1_000_000),
    uploader: { toString: () => "xyzab-1234a-abcde" } as any,
  },
  {
    id: "sample_2",
    title: "How I Built a Decentralized Video Platform in 48 Hours",
    description:
      "Speed-coding session documenting the entire process of building VidXpress on the Internet Computer.",
    fileId: "sample_2",
    timestamp: BigInt(Date.now() - 5 * 3600 * 1000) * BigInt(1_000_000),
    uploader: { toString: () => "aaaaa-bbbbb-ccccc" } as any,
  },
  {
    id: "sample_3",
    title: "Aerial Iceland — Fire, Ice & Midnight Sun",
    description:
      "Drone footage captured during the summer solstice in Iceland. Volcanoes, glaciers, and endless golden light.",
    fileId: "sample_3",
    timestamp: BigInt(Date.now() - 24 * 3600 * 1000) * BigInt(1_000_000),
    uploader: { toString: () => "drone-pilotz-99" } as any,
  },
  {
    id: "sample_4",
    title: "Making Ramen from Scratch — 18 Hour Process",
    description:
      "Every bowl of ramen has a story. Homemade noodles, 18-hour tonkotsu broth, and chashu that falls apart.",
    fileId: "sample_4",
    timestamp: BigInt(Date.now() - 2 * 24 * 3600 * 1000) * BigInt(1_000_000),
    uploader: { toString: () => "ramen-master-ix" } as any,
  },
  {
    id: "sample_5",
    title: "The Last Analog Photographer in Manhattan",
    description:
      "A documentary short following Marcus Chen, one of the last film photographers in New York City.",
    fileId: "sample_5",
    timestamp: BigInt(Date.now() - 3 * 24 * 3600 * 1000) * BigInt(1_000_000),
    uploader: { toString: () => "doc-films-co" } as any,
  },
  {
    id: "sample_6",
    title: "Lo-Fi Beats — Midnight Study Session Vol. 3",
    description:
      "Two hours of carefully curated lo-fi hip hop. Rain sounds, soft piano, and vinyl crackle.",
    fileId: "sample_6",
    timestamp: BigInt(Date.now() - 4 * 24 * 3600 * 1000) * BigInt(1_000_000),
    uploader: { toString: () => "lofi-wave-hq" } as any,
  },
];

const CREATOR_NAMES: Record<string, string> = {
  "xyzab-1234a-abcde": "NightWalker",
  "aaaaa-bbbbb-ccccc": "DevStudio",
  "drone-pilotz-99": "AerialVision",
  "ramen-master-ix": "RamenMaster",
  "doc-films-co": "DocFilms",
  "lofi-wave-hq": "LoFiWave",
};

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

type Tab = "discover" | "creators";

function VideoGrid({ videos }: { videos: Video[] }) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <>
      <div
        data-ocid="feed.list"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
      >
        <AnimatePresence>
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
            >
              <VideoCard
                video={video}
                index={i + 1}
                onClick={setSelectedVideo}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <VideoPlayerModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div
      data-ocid="feed.loading_state"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
    >
      {SKELETON_KEYS.map((key) => (
        <div
          key={key}
          className="rounded-lg overflow-hidden bg-card border border-border/60"
        >
          <Skeleton className="aspect-video w-full" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      data-ocid="feed.empty_state"
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-muted border border-border flex items-center justify-center mb-5">
        <Clapperboard className="w-9 h-9 text-muted-foreground" />
      </div>
      <h3 className="font-display text-lg font-600 text-foreground mb-2">
        No videos yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        Be the first to share something. Hit the camera button in the corner.
      </p>
    </div>
  );
}

export default function App() {
  const { data: backendVideos, isLoading } = useAllVideos();
  const [activeTab, setActiveTab] = useState<Tab>("discover");
  const [creatorFilter, setCreatorFilter] = useState<string | null>(null);

  const allVideos: Video[] =
    backendVideos && backendVideos.length > 0 ? backendVideos : sampleVideos;

  const filteredVideos = creatorFilter
    ? allVideos.filter((v) => v.uploader.toString() === creatorFilter)
    : allVideos;

  function handleViewCreator(principalId: string) {
    setCreatorFilter(principalId);
    setActiveTab("discover");
  }

  function clearFilter() {
    setCreatorFilter(null);
  }

  const filterDisplayName = creatorFilter
    ? (CREATOR_NAMES[creatorFilter] ?? creatorFilter.slice(0, 12))
    : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero strip */}
        <div className="border-b border-border/40 bg-gradient-to-r from-background via-muted/20 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-display text-3xl sm:text-4xl font-700 tracking-tight">
                <span className="text-gradient">
                  {activeTab === "discover" ? "Discover" : "Creators"}
                </span>{" "}
                {activeTab === "discover" ? "videos" : "Hub"}
              </h1>
              <p className="mt-2 text-muted-foreground text-sm sm:text-base max-w-md">
                {activeTab === "discover"
                  ? "A decentralized video platform. Upload, share, and stream on-chain."
                  : "Meet the creative minds behind VidXpress content."}
              </p>
            </motion.div>

            {/* Tabs */}
            <div className="mt-6 flex items-center gap-1">
              <button
                type="button"
                data-ocid="nav.discover_tab"
                onClick={() => setActiveTab("discover")}
                className={`px-5 py-2 rounded-full text-sm font-600 transition-all duration-200 ${
                  activeTab === "discover"
                    ? "bg-primary text-primary-foreground shadow-amber"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                Discover
              </button>
              <button
                type="button"
                data-ocid="nav.creators_tab"
                onClick={() => setActiveTab("creators")}
                className={`px-5 py-2 rounded-full text-sm font-600 transition-all duration-200 ${
                  activeTab === "creators"
                    ? "bg-primary text-primary-foreground shadow-amber"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                Creators
              </button>
            </div>
          </div>
        </div>

        {/* Active filter banner */}
        <AnimatePresence>
          {activeTab === "discover" && creatorFilter && (
            <motion.div
              data-ocid="feed.filter_banner"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-primary/20 bg-primary/8 overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                <span className="text-sm text-primary font-600">
                  Showing videos by{" "}
                  <span className="font-700">{filterDisplayName}</span>
                </span>
                <button
                  type="button"
                  data-ocid="feed.clear_filter_button"
                  onClick={clearFilter}
                  className="w-6 h-6 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center transition-colors"
                  aria-label="Clear filter"
                >
                  <X className="w-3.5 h-3.5 text-primary" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === "discover" ? (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
            >
              {isLoading ? (
                <LoadingSkeleton />
              ) : filteredVideos.length === 0 ? (
                <EmptyState />
              ) : (
                <VideoGrid videos={filteredVideos} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="creators"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <CreatorsHub
                videos={allVideos}
                onViewCreator={handleViewCreator}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </footer>

      <UploadModal />
      <Toaster />
    </div>
  );
}
