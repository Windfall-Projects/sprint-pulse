import SignupForm from "./SignupForm"

export const metadata = {
  title: 'Create Account | Sprint Pulse',
  description: 'Sign up for a new Sprint Pulse account.',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-muted/30">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Join Sprint Pulse</h1>
          <p className="text-muted-foreground">Start tracking performance delightfully</p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
