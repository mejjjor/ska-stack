import { useMatchesData } from "~/hooks/useMatchesData";
import type { TokenData } from "~/services/auth.server";

function isTokenData(tokenData: any): tokenData is TokenData {
  return (
    tokenData &&
    typeof tokenData === "object" &&
    typeof tokenData.email === "string" &&
    typeof tokenData.userId === "string" &&
    typeof tokenData.token === "string"
  );
}

export function useOptionalUser(): TokenData | undefined {
  const data = useMatchesData("root");
  if (!data || !isTokenData(data.tokenData)) {
    return undefined;
  }
  return data.tokenData;
}

export function useUser(): TokenData {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}
