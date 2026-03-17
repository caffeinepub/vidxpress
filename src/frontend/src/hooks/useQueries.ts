import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Video } from "../backend";
import { useActor } from "./useActor";

export function useAllVideos() {
  const { actor, isFetching } = useActor();
  return useQuery<Video[]>({
    queryKey: ["videos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteVideo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

export function useAddVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      title: string;
      description: string;
      fileId: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addVideo(
        params.id,
        params.title,
        params.description,
        params.fileId,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}
