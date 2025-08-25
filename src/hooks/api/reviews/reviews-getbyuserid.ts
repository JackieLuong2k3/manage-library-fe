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

const useGetReviewsByUserId = (book_id: string) => {
  const { data, error, isLoading } = useSWR<Review[]>(
    Endpoints.Review.GET_BY_USER_BY_BOOK_ID(book_id),
    axiosFetcher,
  )
  return { data, error, isLoading }
}

export default useGetReviewsByUserId
