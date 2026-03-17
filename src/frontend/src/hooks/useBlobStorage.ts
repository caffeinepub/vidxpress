import { HttpAgent } from "@icp-sdk/core/agent";
import { useCallback, useRef } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";
import { useInternetIdentity } from "./useInternetIdentity";

export function useBlobStorage() {
  const { identity } = useInternetIdentity();
  const configRef = useRef<Awaited<ReturnType<typeof loadConfig>> | null>(null);

  const getConfig = useCallback(async () => {
    if (!configRef.current) {
      configRef.current = await loadConfig();
    }
    return configRef.current;
  }, []);

  const upload = useCallback(
    async (file: File): Promise<string> => {
      const config = await getConfig();
      const agent = new HttpAgent({
        host: config.backend_host,
        identity,
      });
      if (config.backend_host?.includes("localhost")) {
        await agent.fetchRootKey();
      }
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes);
      return hash;
    },
    [identity, getConfig],
  );

  const getUrl = useCallback((fileId: string): string => {
    if (!configRef.current) {
      // Return a placeholder; will be resolved once config loads
      return "";
    }
    const { storage_gateway_url, backend_canister_id, project_id } =
      configRef.current;
    return `${storage_gateway_url}/v1/blob/?blob_hash=${encodeURIComponent(fileId)}&owner_id=${encodeURIComponent(backend_canister_id)}&project_id=${encodeURIComponent(project_id)}`;
  }, []);

  // Pre-load config eagerly
  getConfig().catch(() => {});

  return { upload, getUrl };
}
