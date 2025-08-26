import { Endpoints } from "@/lib/endpoints"
import { axiosFetcher } from "@/lib/utils"
import useSWR from "swr"

export interface Book {
  _id: string;
  title: string;
  author: string;
  category_id: string;
  quantity_total: number;
  quantity_available: number;
  status: "available" | "borrowed" | "damaged" | "lost" | "out_of_stock";
  qr_code?: string;
  description?: string;
  image_url?: string;
  is_hidden: boolean;
  createdAt: string;
  updatedAt: string;
}

const useGetBooks = () => {
  const { data, error, isLoading } = useSWR<any>(
    Endpoints.Books.GET_ALL,
    axiosFetcher,
  )
  const books: Book[] = data?.books ?? data ?? []
  return { data: books, error, isLoading }
}

export default useGetBooks 