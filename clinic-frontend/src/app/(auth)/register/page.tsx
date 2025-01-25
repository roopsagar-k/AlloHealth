import Layout from "@/components/auth/layout"
import RegistrationForm from "@/components/auth/RegistrationForm"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <RegistrationForm />
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </Layout>
  )
}

