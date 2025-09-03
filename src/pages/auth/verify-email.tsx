import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useVerifyEmail } from "@/hooks/api/auth/use-verify-email"
import Link from "next/link"

export default function VerifyEmailPage() {
  const router = useRouter()
  const { token } = router.query
  const { verify, loading } = useVerifyEmail()
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    if (!token || typeof token !== "string") return
    verify(token)
      .then((res) => {
        if (res?.success) {
          setStatus("success")
          setMessage(res?.message || "Xác minh email thành công.")
        } else {
          setStatus("error")
          setMessage(res?.message || "Xác minh email thất bại.")
        }
      })
      .catch((err) => {
        setStatus("error")
        setMessage(
          err?.response?.data?.message || err?.message || "Có lỗi xảy ra khi xác minh."
        )
      })
  }, [token])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Xác minh email</CardTitle>
          <CardDescription>
            {loading && "Đang xác minh, vui lòng chờ..."}
            {!loading && status === "idle" && "Đang chuẩn bị xác minh..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!loading && status === "success" && (
            <div className="space-y-4">
              <p className="text-green-600">{message}</p>
              <Button asChild>
                <Link href="/auth/login">Đăng nhập</Link>
              </Button>
            </div>
          )}
          {!loading && status === "error" && (
            <div className="space-y-4">
              <p className="text-red-600">{message}</p>
              <Button variant="outline" asChild>
                <Link href="/">Về trang chủ</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


