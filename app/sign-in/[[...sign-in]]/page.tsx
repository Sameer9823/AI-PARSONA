import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background bg-aurora-gradient p-4">
      <SignIn
        appearance={{
          elements: {
            card: "bg-card border border-white/10 shadow-2xl",
          },
        }}
      />
    </div>
  );
}
