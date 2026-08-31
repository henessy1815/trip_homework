import type { ReactNode } from "react";
import AuthGuard from "@/components/commons/auth-guard";

type BoardNewLayoutProps = {
  children: ReactNode;
};

export default function BoardNewLayout({ children }: BoardNewLayoutProps) {
  // 로그인한 사람만 게시글 등록 페이지를 볼 수 있어요.
  return <AuthGuard>{children}</AuthGuard>;
}
