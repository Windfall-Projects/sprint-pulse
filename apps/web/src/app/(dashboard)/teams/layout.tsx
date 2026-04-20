import { TeamsNav } from './TeamsNav'

export const metadata = {
  title: 'Teams & Directory | Sprint Pulse',
}

export default function TeamsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Teams & Directory</h1>
        <p className="text-muted-foreground mt-1">Manage your agile teams and directory members.</p>
      </div>

      <TeamsNav />

      {children}
    </div>
  )
}
