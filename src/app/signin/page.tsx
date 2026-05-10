import { SignIn } from "@clerk/nextjs";

export const metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <SignIn />
    </div>
  );
}
