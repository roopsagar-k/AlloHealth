import Layout from "@/components/auth/layout"
import LoginForm from "@/components/auth/LoginForm"
import Link from "next/link"

export default function LoginPage() {
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <LoginForm />
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </Layout>
  )
}

