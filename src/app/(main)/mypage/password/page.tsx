"use client";

import { useState } from "react";
import styles from "./styles.module.css";

export default function PasswordPage() {
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const isReady = password !== "" && passwordCheck !== "";

  return (
    <section className={styles.section}>
      <h2>비밀번호 변경</h2>

      <label htmlFor="password">새 비밀번호 *</label>
      <input
        id="password"
        type="password"
        placeholder="새 비밀번호를 입력해 주세요."
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <label htmlFor="password-check">새 비밀번호 확인 *</label>
      <input
        id="password-check"
        type="password"
        placeholder="새 비밀번호를 확인해 주세요."
        value={passwordCheck}
        onChange={(event) => setPasswordCheck(event.target.value)}
      />

      <button type="button" disabled={!isReady}>
        비밀번호 변경
      </button>
    </section>
  );
}
