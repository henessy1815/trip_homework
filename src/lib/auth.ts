const ACCESS_TOKEN_KEY = "accessToken";

// JWT 안에는 토큰이 끝나는 시간(exp)이 들어 있어요.
// 서버에 요청하기 전에 만료 여부를 먼저 확인해요.
function isExpired(token: string) {
  try {
    // JWT의 가운데 부분에는 로그인 정보와 만료 시간이 들어 있어요.
    const payloadBase64 = token
      .split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const paddedPayload = payloadBase64.padEnd(
      Math.ceil(payloadBase64.length / 4) * 4,
      "=",
    );
    const payloadText = atob(paddedPayload);
    const payload = JSON.parse(payloadText) as { exp?: number };

    if (!payload.exp) return false;

    return payload.exp * 1000 < Date.now();
  } catch {
    // JWT 모양이 아니면 서버가 한 번 더 확인하도록 그대로 사용해요.
    return false;
  }
}

export function getAccessToken() {
  if (typeof window === "undefined") return "";

  // 이전 수업 버전의 localStorage 토큰은 더 이상 사용하지 않아요.
  localStorage.removeItem(ACCESS_TOKEN_KEY);

  const token = sessionStorage.getItem(ACCESS_TOKEN_KEY) ?? "";

  if (token && isExpired(token)) {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    return "";
  }

  return token;
}

export function saveAccessToken(token: string) {
  // 탭을 닫으면 사라지는 sessionStorage에 토큰을 저장해요.
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function removeAccessToken() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}
