import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background bg-aurora-gradient p-4">
      <SignUp
        appearance={{
          elements: {
            card: "bg-card border border-white/10 shadow-2xl",
          },
        }}
      />
    </div>
  );
}
