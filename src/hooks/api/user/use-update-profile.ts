import { useAxios } from "@/hooks/api/use-axios"
import { Endpoints } from "@/lib/endpoints"
import { useState } from "react"

interface UpdateProfileData {
  full_name: string
  email: string
  phone: string
}

export const useUpdateProfile = () => {
  const axios = useAxios()
  const [loading, setLoading] = useState(false)

  const updateProfile = async (userId: string, data: UpdateProfileData) => {
    try {
      setLoading(true)
      const response = await axios.put(Endpoints.Users.UPDATE(userId), data)
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { updateProfile, loading }
}
