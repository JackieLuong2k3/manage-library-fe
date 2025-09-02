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
import { ArrowLeft, Mail } from "lucide-react"
import dynamic from "next/dynamic"

const formSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
})

function ForgotPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      // TODO: Implement forgot password API call
      console.log("Forgot password for:", values.email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showSuccessToast("Email đặt lại mật khẩu đã được gửi!")
      // Redirect to verify OTP page with email as query parameter
      router.push(`/verifyotp?email=${encodeURIComponent(values.email)}`)
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

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Email đã được gửi!</CardTitle>
            <CardDescription>
              Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến địa chỉ email của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              Vui lòng kiểm tra hộp thư và làm theo hướng dẫn trong email.
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại đăng nhập
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEmailSent(false)
                  form.reset()
                }}
              >
                Gửi lại email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Quên mật khẩu</CardTitle>
          <CardDescription>
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Nhập email của bạn"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang gửi..." : "Gửi email đặt lại mật khẩu"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:underline"
            >
              <ArrowLeft className="mr-1 h-3 w-3 inline" />
              Quay lại đăng nhập
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default dynamic(() => Promise.resolve(ForgotPasswordPage), {
  ssr: false,
})
