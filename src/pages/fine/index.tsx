import React from "react"

import { useAtomValue } from "jotai/react"
import { userInfoAtom } from "@/stores/auth"
import FineAdmin from "./fineAdmin"
import FineMember from "./fineMember"


const FineMePage = () => {
  const user = useAtomValue(userInfoAtom);
  return (
    <>
    {
      user?.role === "admin" ? (
        <FineAdmin />
      ) : (
        <FineMember />
      )
    }
    </>

  )
}

export default FineMePage
