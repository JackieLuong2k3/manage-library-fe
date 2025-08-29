import { useAxios } from "@/hooks/api/use-axios"
import { Endpoints } from "@/lib/endpoints"
import { useState } from "react"

export const useVerifyEmail = () => {
  const axios = useAxios()
  const [loading, setLoading] = useState(false)

  const verify = async (token: string) => {
    try {
      setLoading(true)
      const response = await axios.get(Endpoints.Auth.VERIFY_EMAIL(token))
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { verify, loading }
}


