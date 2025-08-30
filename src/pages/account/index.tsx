import { useAtomValue } from "jotai/react"
import { userInfoAtom } from "@/stores/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Constants } from "@/lib/constants"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export default function AccountPage() {
  const userData = useAtomValue(userInfoAtom)

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Không tìm thấy thông tin người dùng</CardTitle>
            <CardDescription>
              Vui lòng đăng nhập lại để xem thông tin tài khoản.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Thông tin tài khoản</CardTitle>
            <CardDescription>
              Xem thông tin cá nhân của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={userData.full_name}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={userData.phone}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="identityNumber">Mã hội viên</Label>
                <Input
                  id="identityNumber"
                  value={userData.identity_number}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Vai trò</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="role"
                    value={Constants.roleMap[userData.role] || userData.role}
                    readOnly
                    className="bg-gray-50"
                  />
                  <Badge variant={userData.role === "admin" ? "destructive" : userData.role === "staff" ? "default" : "secondary"}>
                    {userData.role}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="status"
                    value={userData.is_active ? "Hoạt động" : "Bị khóa"}
                    readOnly
                    className="bg-gray-50"
                  />
                  <Badge variant={userData.is_active ? "default" : "destructive"}>
                    {userData.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="createdAt">Ngày tạo</Label>
                <Input
                  id="createdAt"
                  value={format(new Date(userData.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="updatedAt">Cập nhật lần cuối</Label>
                <Input
                  id="updatedAt"
                  value={format(new Date(userData.updatedAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>

            {userData.is_verified !== undefined && (
              <div className="space-y-2">
                <Label htmlFor="verified">Xác minh email</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="verified"
                    value={userData.is_verified ? "Đã xác minh" : "Chưa xác minh"}
                    readOnly
                    className="bg-gray-50"
                  />
                  <Badge variant={userData.is_verified ? "default" : "secondary"}>
                    {userData.is_verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
