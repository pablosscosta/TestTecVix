import { useZUserProfile } from "../stores/useZUserProfile";

export const usePermissions = () => {
  const { role } = useZUserProfile();

  return {
    isMember: role === "member",
    isManager: role === "manager",
    isAdmin: role === "admin",

    canReadVM: true,
    canEditVM: role === "manager" || role === "admin",
    canDeleteVM: role === "admin",
    canControlVM: role === "manager" || role === "admin",
    canResizeDisk: role === "manager" || role === "admin",
    canRenameVM: role === "manager" || role === "admin",
    canAccessTerminal: role === "manager" || role === "admin",
    canAccessMonitor: role === "manager" || role === "admin",
  };
};
