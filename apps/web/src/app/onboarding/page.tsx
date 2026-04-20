import OnboardingForm from "./OnboardingForm"

export const metadata = {
  title: 'Welcome | Set Up Your Workspace',
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-muted/30">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-ring/20 via-background to-background" />
      <div className="z-10 w-full max-w-md">
        <div className="mb-8 text-center text-foreground">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome to Sprint Pulse</h1>
          <p className="text-muted-foreground">Let's get your first workspace set up</p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  )
}
