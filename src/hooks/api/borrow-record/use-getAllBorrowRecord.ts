import { useAxios } from "@/hooks/api/use-axios";
import { useState, useCallback } from "react";

export const useGetAllBorrowRecord = () => {
  const axios = useAxios(); 
  const [loading, setLoading] = useState(false);
  const [borrowRecords, setBorrowRecords] = useState<any[]>([]); 

  const fetchBorrowRecord = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("borrow-records");
      console.log("response", response);
      setBorrowRecords(response.data.data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchBorrowRecord, borrowRecords, loading };
};
