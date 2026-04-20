import { SettingsNav } from './SettingsNav'

export const metadata = {
  title: 'Settings | Sprint Pulse',
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <SettingsNav />
        </aside>

        <div className="lg:col-span-3 space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
}
