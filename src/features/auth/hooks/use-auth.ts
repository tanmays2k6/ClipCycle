import { useAuthStore } from "@/store/auth-store";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const session = useAuthStore((s) => s.session);
  const isLoading = useAuthStore((s) => s.isLoading);

  const userDisplayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    "User";

  const userInitials = userDisplayName
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const userAvatarUrl: string | null =
    user?.user_metadata?.avatar_url ??
    user?.user_metadata?.picture ??
    null;

  const userEmail = user?.email ?? null;

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!session,
    userDisplayName,
    userInitials,
    userAvatarUrl,
    userEmail,
  };
}
