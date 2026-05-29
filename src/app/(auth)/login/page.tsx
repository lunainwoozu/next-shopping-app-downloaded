"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/schemas/auth.schema";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError("");
    const result = await signIn("credentials", { ...data, redirect: false });
    if (result?.error) {
      setError("이메일 또는 비밀번호를 확인해주세요.");
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <div className="auth">
      <h1>로그인</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            {...register("email")}
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
            {...register("password")}
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
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <p className="alt">
        계정이 없으신가요? <Link href="/register">회원가입</Link>
      </p>
    </div>
  );
}
