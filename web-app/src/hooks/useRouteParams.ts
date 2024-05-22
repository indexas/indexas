import { DiscoveryType } from "@/types";
import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";

export const useRouteParams = () => {
  const params = useParams();
  const path = usePathname();

  const id = params.id ? decodeURIComponent(params.id as string) : undefined;

  const isLanding = useMemo(() => path === "/", [path]);

  const discoveryType = useMemo(() => {
    return id
      ? id.includes("did:")
        ? DiscoveryType.DID
        : DiscoveryType.INDEX
      : undefined;
  }, [id]);

  const isDID = useMemo(
    () => discoveryType === DiscoveryType.DID,
    [discoveryType],
  );
  const isIndex = useMemo(
    () => discoveryType === DiscoveryType.INDEX,
    [discoveryType],
  );

  return {
    id,
    isLanding,
    discoveryType,
    isDID,
    isIndex,
  };
};
