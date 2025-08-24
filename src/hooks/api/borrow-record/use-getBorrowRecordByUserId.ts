import { useAxios } from "@/hooks/api/use-axios";
import { userInfoAtom } from "@/stores/auth";
import { useAtomValue } from "jotai/react";
import { useState } from "react";
import { Endpoints } from "@/lib/endpoints";
import { Constants } from "@/lib/constants";

export const useGetBorrowRecordByUserId = () => {
    const user = useAtomValue(userInfoAtom);
  const axios = useAxios(); 
  const [loading, setLoading] = useState(false);
  const [borrowRecords, setBorrowRecords] = useState<any[]>([]); 

  const fetchBorrowRecordByUserId = async () => {
    if (!user?._id) {
      console.error("User ID not found");
      return;
    }

    try {
      setLoading(true);
      // Sử dụng endpoint từ Endpoints class với auth header
      const response = await axios.get(Endpoints.BorrowRecord.GET_MY_RECORDS, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(Constants.API_TOKEN_KEY)}`,
          'Content-Type': 'application/json'
        }
      }); 
      console.log("Borrow Records API response:", response);
      setBorrowRecords(response.data.data || response.data); 
    } catch (error) {
      console.error("Borrow Records API Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { fetchBorrowRecordByUserId, borrowRecords, loading };
};
