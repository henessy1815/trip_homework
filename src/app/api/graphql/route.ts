import { NextRequest, NextResponse } from "next/server";

const GRAPHQL_API = "https://main-practice.codebootcamp.co.kr/graphql";

export async function POST(request: NextRequest) {
  // Apollo가 보낸 Query를 과제용 API로 그대로 전달해요.
  const query = await request.text();
  const authorization = request.headers.get("authorization");
  const cookie = request.headers.get("cookie");

  const headers = new Headers({
    "content-type": "application/json",
    // 로그인 API의 Origin 오류를 방지하기 위해 반드시 보내요.
    origin: request.headers.get("origin") ?? request.nextUrl.origin,
  });

  if (authorization) headers.set("authorization", authorization);
  if (cookie) headers.set("cookie", cookie);

  try {
    const apiResponse = await fetch(GRAPHQL_API, {
      method: "POST",
      headers,
      body: query,
      cache: "no-store",
    });

    const result = new NextResponse(await apiResponse.text(), {
      status: apiResponse.status,
      headers: { "content-type": "application/json" },
    });

    // 로그인 API가 보낸 refresh token 쿠키도 브라우저에 전달해요.
    const setCookie = apiResponse.headers.get("set-cookie");
    if (setCookie) result.headers.set("set-cookie", setCookie);

    return result;
  } catch {
    return NextResponse.json(
      { errors: [{ message: "과제용 API에 연결할 수 없어요." }] },
      { status: 502 },
    );
  }
}
