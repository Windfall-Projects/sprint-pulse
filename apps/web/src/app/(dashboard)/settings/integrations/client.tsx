'use client'

import { useState, useEffect, useTransition } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { getGitHubRepositories, createIntegrationMapping } from './_actions/github'

export function IntegrationClient({ initialIntegrations, teams }: { initialIntegrations: any[], teams: any[] }) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [integrations, setIntegrations] = useState(initialIntegrations)
    const [isPending, startTransition] = useTransition()
    
    // Mapping state
    const isMappingSetup = searchParams.get('mapping_setup') === 'true'
    const githubIntegration = integrations.find(i => i.provider === 'github')
    
    const [repos, setRepos] = useState<any[]>([])
    const [loadingRepos, setLoadingRepos] = useState(false)
    const [selectedRepo, setSelectedRepo] = useState('')
    const [selectedTeam, setSelectedTeam] = useState('')
    const [mappingError, setMappingError] = useState('')

    useEffect(() => {
        if (githubIntegration && isMappingSetup) {
            setLoadingRepos(true)
            getGitHubRepositories(githubIntegration.id)
                .then(res => {
                    if (res.error) setMappingError(res.error)
                    else setRepos(res.repos || [])
                })
                .finally(() => setLoadingRepos(false))
        }
    }, [githubIntegration, isMappingSetup])

    const handleConnectGithub = () => {
        const appName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME
        if (!appName) {
            alert('NEXT_PUBLIC_GITHUB_APP_NAME not configured in UI environment variables.')
            return
        }
        window.location.href = `https://github.com/apps/${appName}/installations/new`
    }

    const handleCreateMapping = () => {
        if (!selectedRepo || !selectedTeam || !githubIntegration) return

        startTransition(async () => {
            const res = await createIntegrationMapping({
                integrationId: githubIntegration.id,
                externalRepoId: selectedRepo,
                teamId: selectedTeam
            })

            if (res.error) {
                setMappingError(res.error)
            } else {
                router.replace('/settings/integrations')
            }
        })
    }

    return (
        <div className="rounded-xl border p-6 space-y-6 bg-surface shadow-sm">
            <div className="flex items-center justify-between border-b pb-4 border-border">
                <div>
                    <h4 className="font-semibold text-base text-foreground">GitHub App</h4>
                    <p className="text-sm text-muted-foreground mt-1 text-balance">
                       Install the official Sprint Pulse GitHub App to pull your external issues directly into your team&apos;s backlog. Webhooks will maintain live status syncing.
                    </p>
                </div>
                {!githubIntegration ? (
                    <Button onClick={handleConnectGithub}>Connect GitHub</Button>
                ) : (
                    <button 
                        className="px-4 py-2 bg-transparent text-foreground border border-border rounded-md text-sm hover:bg-surface-hover transition-colors"
                        onClick={() => router.push('/settings/integrations?mapping_setup=true')}
                    >
                        Add Mapping
                    </button>
                )}
            </div>

            {isMappingSetup && githubIntegration && (
                <div className="p-5 border border-border/50 rounded-lg bg-surface/30 space-y-4">
                    <h5 className="font-semibold text-sm">Add New Mapping</h5>
                    {mappingError && <p className="text-red-500 text-xs bg-red-500/10 p-2 rounded">{mappingError}</p>}
                    
                    {loadingRepos ? (
                        <p className="text-sm text-muted-foreground animate-pulse">Loading authorized repositories securely...</p>
                    ) : (
                        <div className="space-y-4 max-w-md">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Select Repository</label>
                                <select 
                                    className="w-full text-sm p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
                                    value={selectedRepo}
                                    onChange={e => setSelectedRepo(e.target.value)}
                                >
                                    <option value="">-- Choose Repo --</option>
                                    {repos.map(r => (
                                        <option key={r.id} value={r.full_name}>{r.full_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Map to Team Backlog</label>
                                <select 
                                    className="w-full text-sm p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
                                    value={selectedTeam}
                                    onChange={e => setSelectedTeam(e.target.value)}
                                >
                                    <option value="">-- Choose Team --</option>
                                    {teams.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-3">
                                <Button 
                                    disabled={!selectedRepo || !selectedTeam || isPending} 
                                    onClick={handleCreateMapping}
                                >
                                    {isPending ? 'Authorizing & Saving...' : 'Save Mapping'}
                                </Button>
                                <button 
                                    className="text-sm text-muted-foreground hover:text-foreground px-2"
                                    onClick={() => router.replace('/settings/integrations')}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {integrations.length > 0 && !isMappingSetup && (
                <div className="space-y-4">
                    <h5 className="font-medium text-sm text-foreground">Active Mappings</h5>
                    {integrations.flatMap((int: any) => 
                        int.integration_mappings?.map((mapping: any) => (
                            <div key={mapping.id} className="p-4 bg-background rounded-lg border border-border text-sm flex justify-between items-center shadow-sm">
                                <span className="font-medium text-foreground">{mapping.external_repo_id}</span>
                                <span className="text-muted-foreground">
                                    → Team: {teams.find((t: any) => t.id === mapping.team_id)?.name || mapping.team_id}
                                    {mapping.project_id && ` / Project`}
                                </span>
                            </div>
                        ))
                    )}
                    {integrations.flatMap(i => i.integration_mappings).filter(Boolean).length === 0 && (
                        <p className="text-sm text-muted-foreground italic">No active mappings found. Click 'Add Mapping' to connect a repository.</p>
                    )}
                </div>
            )}
        </div>
    )
}
