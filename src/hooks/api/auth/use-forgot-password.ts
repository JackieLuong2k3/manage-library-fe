import { useAxios } from "@/hooks/api/use-axios";
import { Endpoints } from "@/lib/endpoints";
import { useState } from "react";

export const useForgotPassword = () => {
  const axios = useAxios();
  const [loading, setLoading] = useState(false);

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      const response = await axios.post(Endpoints.Auth.FORGOT_PASSWORD, { email });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword, loading };
};


