import { Endpoints } from "@/lib/endpoints"
import { axiosFetcher } from "@/lib/utils"
import useSWR from "swr"




export interface Review {
  _id: string
  user_id: string
  book_id: string
  rating: number
  comment: string
  created_at: string
  __v: number
}

const useGetReviews = (id: string) => {
  const { data, error, isLoading } = useSWR<Review[]>(
    Endpoints.Review.GET_ALL(id),
    axiosFetcher,
  )
  console.log(data);
  return { data, error, isLoading }
}

export default useGetReviews
