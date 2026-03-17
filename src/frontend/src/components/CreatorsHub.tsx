import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Video } from "../backend";

const CREATOR_NAMES: Record<string, string> = {
  "xyzab-1234a-abcde": "NightWalker",
  "aaaaa-bbbbb-ccccc": "DevStudio",
  "drone-pilotz-99": "AerialVision",
  "ramen-master-ix": "RamenMaster",
  "doc-films-co": "DocFilms",
  "lofi-wave-hq": "LoFiWave",
};

const AVATAR_HUES = [72, 150, 200, 320, 30, 260];

interface Creator {
  principalId: string;
  displayName: string;
  videoCount: number;
  avatarHue: number;
}

function deriveCreators(videos: Video[]): Creator[] {
  const map = new Map<string, number>();
  for (const v of videos) {
    const pid = v.uploader.toString();
    map.set(pid, (map.get(pid) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([pid, count], i) => ({
    principalId: pid,
    displayName: CREATOR_NAMES[pid] ?? pid.slice(0, 8),
    videoCount: count,
    avatarHue: AVATAR_HUES[i % AVATAR_HUES.length],
  }));
}

function getInitials(name: string): string {
  return name
    .split(/[\s-_]/, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

interface CreatorsHubProps {
  videos: Video[];
  onViewCreator: (principalId: string) => void;
}

export function CreatorsHub({ videos, onViewCreator }: CreatorsHubProps) {
  const creators = deriveCreators(videos);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-700 tracking-tight">
            <span className="text-gradient">Creators</span> Hub
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-md">
          Discover the talented creators behind VidXpress. Explore their work
          and dive into their worlds.
        </p>
      </motion.div>

      {/* Creators grid */}
      {creators.length === 0 ? (
        <div
          data-ocid="creators.empty_state"
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-muted border border-border flex items-center justify-center mb-5">
            <Users className="w-9 h-9 text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-600 text-foreground mb-2">
            No creators yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Upload a video to become the first creator on VidXpress.
          </p>
        </div>
      ) : (
        <div
          data-ocid="creators.list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {creators.map((creator, i) => (
              <motion.div
                key={creator.principalId}
                data-ocid={`creators.item.${i + 1}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.07,
                  duration: 0.38,
                  ease: "easeOut",
                }}
                className="group relative rounded-xl overflow-hidden bg-card border border-border/60 p-6 flex flex-col items-center text-center card-glow"
              >
                {/* Background glow accent */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, oklch(0.35 0.08 ${creator.avatarHue} / 0.3) 0%, transparent 70%)`,
                  }}
                />

                {/* Avatar */}
                <div
                  className="relative w-20 h-20 rounded-full flex items-center justify-center mb-4 text-2xl font-display font-700 text-white shadow-lg"
                  style={{
                    background: `radial-gradient(135deg at 30% 30%, oklch(0.55 0.18 ${creator.avatarHue}) 0%, oklch(0.32 0.1 ${creator.avatarHue}) 100%)`,
                    boxShadow: `0 0 0 3px oklch(0.78 0.14 ${creator.avatarHue} / 0.25), 0 8px 24px oklch(0.4 0.12 ${creator.avatarHue} / 0.35)`,
                  }}
                >
                  {getInitials(creator.displayName)}
                </div>

                {/* Name */}
                <h3 className="font-display text-lg font-700 text-foreground mb-1">
                  {creator.displayName}
                </h3>

                {/* Principal ID */}
                <p className="text-[11px] font-mono text-muted-foreground mb-4 truncate max-w-[180px]">
                  {creator.principalId.length > 20
                    ? `${creator.principalId.slice(0, 10)}...${creator.principalId.slice(-6)}`
                    : creator.principalId}
                </p>

                {/* Video count badge */}
                <Badge
                  variant="secondary"
                  className="mb-5 px-3 py-1 text-xs font-600 bg-muted border border-border/60"
                >
                  {creator.videoCount}{" "}
                  {creator.videoCount === 1 ? "video" : "videos"}
                </Badge>

                {/* CTA */}
                <Button
                  size="sm"
                  data-ocid={`creators.view_button.${i + 1}`}
                  onClick={() => onViewCreator(creator.principalId)}
                  className="w-full bg-primary/15 border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  variant="outline"
                >
                  View Videos
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
