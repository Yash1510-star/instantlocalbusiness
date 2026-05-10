import { SignUp } from "@clerk/nextjs";

export const metadata = { title: "Create Account" };

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <SignUp />
    </div>
  );
}
