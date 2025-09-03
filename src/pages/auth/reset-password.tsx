import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { showErrorToast, showSuccessToast } from "@/components/common/toast/toast"
import { useRouter } from "next/router"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useResetPassword } from "@/hooks/api/auth/use-reset-password"

const formSchema = z
  .object({
    newPassword: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
    confirmPassword: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  })

function ResetPasswordPage() {
  const router = useRouter()
  const { email, otp } = router.query
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resetPassword } = useResetPassword()

  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      await resetPassword(String(email), String(otp), values.newPassword)
      showSuccessToast("Đặt lại mật khẩu thành công!")
        router.push("/auth/login")
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Có lỗi xảy ra, vui lòng thử lại sau"
      )
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  if (!email || !otp) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Lỗi</CardTitle>
            <CardDescription>
              Không tìm thấy thông tin xác thực. Vui lòng thử lại.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/auth/forgotpass">Quay lại quên mật khẩu</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Tạo mật khẩu mới</CardTitle>
          <CardDescription>
            Nhập mật khẩu mới cho tài khoản {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Nhập mật khẩu mới" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Nhập lại mật khẩu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default dynamic(() => Promise.resolve(ResetPasswordPage), {
  ssr: false,
})


