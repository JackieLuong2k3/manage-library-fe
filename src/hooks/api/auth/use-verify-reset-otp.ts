import { useAxios } from "@/hooks/api/use-axios";
import { Endpoints } from "@/lib/endpoints";
import { useState } from "react";

export const useVerifyResetOtp = () => {
  const axios = useAxios();
  const [loading, setLoading] = useState(false);

  const verifyResetOtp = async (email: string, otp: string) => {
    try {
      setLoading(true);
      const response = await axios.post(Endpoints.Auth.VERIFY_OTP, { email, otp });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { verifyResetOtp, loading };
};


