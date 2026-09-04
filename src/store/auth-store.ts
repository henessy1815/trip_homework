import { create } from "zustand";

type AuthStore = {
  accessToken: string;
  setAccessToken: (token: string) => void;
  isAuthReady: boolean;
  finishAuth: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  // 처음에는 빈 토큰과 인증준비중(false) 상태로 시작
  accessToken: "",
  isAuthReady: false,

  // 로그인 성공 시 새 accessToken 저장
  setAccessToken: (token: string) =>
    set({
      accessToken: token,
    }),

  // 새로고침 후 토큰 복구 시도가 끝나면 인증 준비완료 처리
  finishAuth: () => set({ isAuthReady: true }),

  // 로그아웃 시 토큰 초기화
  logout: () => set({ accessToken: "", isAuthReady: true }),
}));
