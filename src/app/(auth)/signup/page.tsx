"use client";

import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { CREATE_USER } from "@/graphql/mutations";
import styles from "../auth.module.css";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [createUser, { loading }] = useMutation(CREATE_USER);

  const onSubmitSignup = async (event: FormEvent<HTMLFormElement>) => {
    // submit 뒤에 브라우저가 새로고침되지 않도록 먼저 막아줘요.
    event.preventDefault();

    if (!email || !name || !password || !passwordCheck) {
      setErrorMessage("모든 정보를 입력해주세요.");
      return;
    }

    if (password !== passwordCheck) {
      setErrorMessage("비밀번호가 서로 달라요.");
      return;
    }

    try {
      await createUser({
        variables: {
          input: { email, name, password },
        },
      });

      // 회원가입이 성공하면 피그마처럼 축하 모달을 보여줘요.
      setIsSignupModalOpen(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "회원가입에 실패했어요.",
      );
    }
  };

  return (
    <main className={styles.main}>
      <section className={`${styles.formSide} ${styles.signupSide}`}>
        <div className={`${styles.formBox} ${styles.signupBox}`}>
          <h1>회원가입</h1>
          <p className={styles.description}>
            회원가입을 위해 아래 모든 정보를 입력해주세요.
          </p>

          <form className={styles.form} onSubmit={onSubmitSignup}>
            <label htmlFor="email">
              이메일 <span>*</span>
            </label>
            <input
              className={errorMessage ? styles.inputError : ""}
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="이메일을 입력해 주세요."
            />

            <label htmlFor="name">
              이름 <span>*</span>
            </label>
            <input
              className={errorMessage ? styles.inputError : ""}
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="이름을 입력해 주세요."
            />

            <label htmlFor="password">
              비밀번호 <span>*</span>
            </label>
            <input
              className={errorMessage ? styles.inputError : ""}
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력해 주세요."
            />

            <label htmlFor="passwordCheck">
              비밀번호 확인 <span>*</span>
            </label>
            <input
              className={errorMessage ? styles.inputError : ""}
              id="passwordCheck"
              type="password"
              value={passwordCheck}
              onChange={(event) => setPasswordCheck(event.target.value)}
              placeholder="비밀번호를 한번 더 입력해 주세요."
            />

            <p className={styles.error}>{errorMessage}</p>
            <button
              className={styles.submitButton}
              type="submit"
              disabled={loading}
            >
              {loading ? "가입 중..." : "회원가입"}
            </button>
          </form>
        </div>
      </section>
      <div className={styles.picture} aria-label="여행지 풍경" />

      {isSignupModalOpen && (
        <div className={styles.modalOverlay}>
          <div
            className={styles.successModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="signup-success-title"
          >
            <h2 id="signup-success-title">회원가입을 축하 드려요.</h2>
            <img src="/triptrip.png" alt="TripTrip" />
            <button type="button" onClick={() => router.push("/login")}>
              로그인 하기
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
