import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { ArrowLeft, Key, Mail } from "lucide-react"
import dynamic from "next/dynamic"

const formSchema = z.object({
  otp: z.string().min(6, "Mã OTP phải có 6 ký tự").max(6, "Mã OTP phải có 6 ký tự"),
})

function VerifyOTPPage() {
  const router = useRouter()
  const { email } = router.query
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      // TODO: Implement verify OTP API call
      console.log("Verify OTP:", values.otp, "for email:", email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showSuccessToast("Xác thực OTP thành công!")
      // Redirect to reset password page
      router.push(`/reset-password?email=${encodeURIComponent(email as string)}&otp=${values.otp}`)
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
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Xác thực OTP</CardTitle>
            <CardDescription>
              Nhập mã OTP đã được gửi đến email của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Mã OTP</Label>
                <Input placeholder="Nhập mã OTP 6 số" disabled />
              </div>
              <Button className="w-full" disabled>
                Xác thực OTP
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Lỗi</CardTitle>
            <CardDescription>
              Không tìm thấy thông tin email. Vui lòng thử lại.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/forgotpass">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại trang quên mật khẩu
              </Link>
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
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Key className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Xác thực OTP</CardTitle>
          <CardDescription>
            Nhập mã OTP đã được gửi đến email của bạn
          </CardDescription>
          <div className="mt-2 text-sm text-muted-foreground">
            <Mail className="inline mr-1 h-3 w-3" />
            {email}
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã OTP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập mã OTP 6 số"
                        maxLength={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang xác thực..." : "Xác thực OTP"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 space-y-2">
            <div className="text-center text-sm text-muted-foreground">
              Không nhận được mã OTP?
            </div>
            <Button variant="outline" className="w-full" onClick={() => {
              // TODO: Implement resend OTP
              showSuccessToast("Đã gửi lại mã OTP!")
            }}>
              Gửi lại mã OTP
            </Button>
            <div className="text-center">
              <Link
                href="/forgotpass"
                className="text-sm text-muted-foreground hover:underline"
              >
                <ArrowLeft className="mr-1 h-3 w-3 inline" />
                Quay lại trang quên mật khẩu
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default dynamic(() => Promise.resolve(VerifyOTPPage), {
  ssr: false,
})