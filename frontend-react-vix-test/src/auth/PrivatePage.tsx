/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useZResetAllStates } from "../stores/useZResetAllStates";
import { useZUserProfile } from "../stores/useZUserProfile";
import { FullPage } from "../components/Skeletons/FullPage";
import { useEffect, useState } from "react";

interface IProps {
  children: React.ReactNode;
  onlyManagerOrAdmin?: boolean;
  onlyAdmin?: boolean;
  skeleton?: boolean;
}

export const PrivatePage = ({
  children,
  onlyAdmin = false,
  onlyManagerOrAdmin = false,
}: IProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const { resetAllStates } = useZResetAllStates();
  const { idUser, role } = useZUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    switch (true) {
      case !idUser:
        navigate("/login");
        break;
      case onlyAdmin && role !== "admin":
        navigate(-1);
        break;
      case onlyManagerOrAdmin && role !== "admin" && role !== "manager":
        navigate(-1);
        break;
      default:
        setIsChecking(false);
        break;
    }
  }, [idUser, role, onlyAdmin, onlyManagerOrAdmin, navigate]);

  if (!idUser) {
    return <FullPage />;
  }

  if (isChecking) {
    return <FullPage />;
  }

  return <>{children}</>;
};
