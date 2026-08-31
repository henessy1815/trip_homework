"use client";

import { useMutation } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { LOGIN_USER } from "@/graphql/mutations";
import { saveAccessToken } from "@/lib/auth";
import styles from "../auth.module.css";

type LoginResult = {
  loginUser: {
    accessToken: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loginUser, { loading }] = useMutation<LoginResult>(LOGIN_USER);

  const onSubmitLogin = async (event: FormEvent<HTMLFormElement>) => {
    // form의 기본 새로고침을 막고 아래에서 직접 로그인 API를 실행해요.
    event.preventDefault();

    if (email === "" || password === "") {
      setErrorMessage("아이디 또는 비밀번호를 확인해 주세요.");
      return;
    }

    try {
      const result = await loginUser({ variables: { email, password } });
      const accessToken = result.data?.loginUser.accessToken;

      if (!accessToken) return;

      // 토큰은 현재 탭을 닫으면 사라지는 sessionStorage에 저장해요.
      // 실제 서비스에서는 이후 refresh token으로 로그인을 연장할 수 있어요.
      saveAccessToken(accessToken);
      router.replace("/");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "로그인에 실패했어요.",
      );
    }
  };

  return (
    <main className={styles.main}>
      <section className={`${styles.formSide} ${styles.loginSide}`}>
        <div className={`${styles.formBox} ${styles.loginBox}`}>
          <Link className={styles.logo} href="/">
            <img src="/triptrip.png" alt="TripTrip" />
          </Link>

          <h1>트립트립에 오신걸 환영합니다.</h1>
          <p className={styles.description}>트립트립에 로그인 하세요.</p>

          <form className={styles.form} onSubmit={onSubmitLogin}>
            {/* 입력값은 각각 email, password state에 저장돼요. */}
            <label className={styles.hiddenLabel} htmlFor="email">
              이메일
            </label>
            <input
              className={errorMessage ? styles.inputError : ""}
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="이메일을 입력해 주세요."
            />

            <label className={styles.hiddenLabel} htmlFor="password">
              비밀번호
            </label>
            <input
              className={errorMessage ? styles.inputError : ""}
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력해 주세요."
            />

            <p className={styles.error}>{errorMessage}</p>
            <button
              className={styles.submitButton}
              type="submit"
              disabled={loading}
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <Link className={styles.moveLink} href="/signup">
            회원가입
          </Link>
        </div>
      </section>
      <div className={styles.picture} aria-label="여행지 풍경" />
    </main>
  );
}
