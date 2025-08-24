import { useAxios } from "@/hooks/api/use-axios";
import { userInfoAtom } from "@/stores/auth";
import { useAtomValue } from "jotai/react";
import { useState } from "react";
import { Endpoints } from "@/lib/endpoints";
import { Constants } from "@/lib/constants";

export const useGetAllBorrowRequestByUserId = () => {
  const axios = useAxios(); 
  const [loading, setLoading] = useState(false);
  const [borrowRequests, setBorrowRequests] = useState<any[]>([]); 
 const user = useAtomValue(userInfoAtom);
  const fetchBorrowRequestByUserId = async () => {
    if (!user?._id) {
      console.error("User ID not found");
      return;
    }

    try {
      setLoading(true);
      // Sử dụng endpoint từ Endpoints class với auth header
      const response = await axios.get(Endpoints.BorrowRequest.GET_MY_REQUESTS, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(Constants.API_TOKEN_KEY)}`,
          'Content-Type': 'application/json'
        }
      }); 
      console.log("API response:", response);
      setBorrowRequests(response.data.data || response.data); 
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { fetchBorrowRequestByUserId, borrowRequests, loading };
};
