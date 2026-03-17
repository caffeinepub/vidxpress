import { useInternetIdentity } from "./useInternetIdentity";

export function useAuth() {
  const { login, clear, identity, loginStatus } = useInternetIdentity();

  const principal = identity?.getPrincipal();
  const isAuthenticated =
    loginStatus === "success" || (!!principal && !principal.isAnonymous());

  return {
    isAuthenticated,
    login,
    logout: clear,
    principal: isAuthenticated ? principal : null,
  };
}
