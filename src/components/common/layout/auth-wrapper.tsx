import { useRouter } from "next/router";
import { useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { Constants } from "@/lib/constants";
import AppShell from "@/components/common/layout/sidebar/dashboard";
import { useAtomValue } from "jotai/react";
import { userInfoAtom } from "@/stores/auth";
import { logout } from "@/lib/utils";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const router = useRouter();
  const userData = useAtomValue(userInfoAtom);
  const { pathname, replace } = router;

  useEffect(() => {
    const token = localStorage.getItem(Constants.API_TOKEN_KEY);
    const isLoginPage = pathname === "/login";
    const isRegisterPage = pathname === "/register";
    const isVerifyEmailPage = pathname === "/auth/verify-email";
    if (!token) {
      if (!isLoginPage && !isRegisterPage && !isVerifyEmailPage) {
        replace("/login");
      }
      return;
    }

    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem(Constants.API_TOKEN_KEY);
        if (!isLoginPage && !isRegisterPage && !isVerifyEmailPage) {
          replace("/login");
        }
      } else {
        if (isLoginPage || isRegisterPage) {
          replace("/dashboard");
        }
      }
    } catch {
      logout();
    }
  }, [pathname, replace]);

  return (
    <>
      {userData ? (
        <>
          <AppShell>{children}</AppShell>
        </>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default AuthWrapper;
