import type { ReactNode } from "react";
import AuthGuard from "@/components/commons/auth-guard";

type TravelProductNewLayoutProps = {
  children: ReactNode;
};

export default function TravelProductNewLayout({
  children,
}: TravelProductNewLayoutProps) {
  // 로그인한 사람만 숙박권 판매 등록 페이지를 볼 수 있어요.
  return <AuthGuard>{children}</AuthGuard>;
}
