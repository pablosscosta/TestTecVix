import { useEffect, useState } from "react";
import { api } from "../services/api";
import { IListAll } from "../types/ListAllTypes";
import { toast } from "react-toastify";
import { useLogin } from "./useLogin";
import { useAuth } from "./useAuth";
import { useZGlobalVar } from "../stores/useZGlobalVar";
import { useZUserProfile } from "../stores/useZUserProfile";
import { IVMCreatedResponse } from "../types/VMTypes";

export const useListVms = () => {
  const [vmList, setVmList] = useState<IVMCreatedResponse[]>([]);
  const [vmTotalCount, setVmTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const {
    setCurrentIdVM,
    currentIdVM,
    setCurrentVMName,
    setTotalCountVMs,
    setCurrentVMOS,
  } = useZGlobalVar();
  const { idBrand } = useZUserProfile();
  const { goLogout } = useLogin();
  const { getAuth } = useAuth();

  const fetchListVms = async (
    params: {
      status?: string;
      page?: number;
      limit?: number;
      search?: string;
      idBrandMaster?: number;
    } = {},
  ) => {
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.get<IListAll<IVMCreatedResponse>>({
      url: "/vm",
      auth,
      params: {
        ...params,
        //status: "PAUSED", // "RUNNING", "STOPPED", "PAUSED", "null", undefined
      },
    });

    setIsLoading(false);
    if (response.error) {
      const message = response.message?.toLowerCase() || "";

      // 👉 Somente erros de sessão derrubam login
      if (
        message.includes("expired") ||
        message.includes("invalid token") ||
        message.includes("unauthorized")
      ) {
        toast.error("Sessão expirada. Faça login novamente.");
        goLogout();
        return;
      }

      // 👉 Erro funcional / permissão
      toast.error(response.message || "Erro ao carregar VMs");
      setVmList([]);
      setVmTotalCount(0);
      setTotalCountVMs(0);
      return;
    }


    setVmList(response.data?.result);
    setVmTotalCount(response.data?.totalCount);
    setTotalCountVMs(response.data?.totalCount);

    if (!currentIdVM && response.data?.result.length) {
      setCurrentIdVM(response.data?.result[0].idVM);
      setCurrentVMName(response.data?.result[0].vmName);
      setCurrentVMOS(response.data?.result[0].os);
    }
  };

  useEffect(() => {
    fetchListVms({ idBrandMaster: idBrand, limit: 20 });
  }, []);

  return { vmList, vmTotalCount, isLoading, fetchListVms };
};