import { useAxios } from "@/hooks/api/use-axios";
import { Endpoints } from "@/lib/endpoints";
import { useState } from "react";

export const useResetPassword = () => {
  const axios = useAxios();
  const [loading, setLoading] = useState(false);

  const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string,
  ) => {
    try {
      setLoading(true);
      const response = await axios.post(Endpoints.Auth.RESET_PASSWORD, {
        email,
        otp,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading };
};


