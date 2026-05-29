"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/schemas/auth.schema";
import { register } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterInput) => {
    setError("");
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("name", data.name);

    const result = await register(formData);
    if (result?.error) {
      setError(result.error);
      return;
    }

    router.push("/login");
  };

  return (
    <div className="auth">
      <h1>회원가입</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label htmlFor="name">이름</label>
          <input
            id="name"
            {...formRegister("name")}
            placeholder="홍길동"
          />
          {errors.name && (
            <span className="text-xs text-destructive">
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            {...formRegister("email")}
            type="email"
            placeholder="hello@example.com"
          />
          {errors.email && (
            <span className="text-xs text-destructive">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            {...formRegister("password")}
            type="password"
            placeholder="••••••••"
          />
          {errors.password && (
            <span className="text-xs text-destructive">
              {errors.password.message}
            </span>
          )}
        </div>

        {error && (
          <p className="text-xs text-destructive mb-5">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn--primary btn--block"
        >
          {isSubmitting ? "처리 중..." : "회원가입"}
        </button>
      </form>

      <p className="alt">
        이미 계정이 있으신가요? <Link href="/login">로그인</Link>
      </p>
    </div>
  );
}
