import { createClient } from '@/utils/supabase/server'
import { IntegrationClient } from './client'

export default async function IntegrationsPage() {
    const supabase = await createClient()

    // Fetch tenant's integrations
    const { data: integrations } = await supabase
        .from('integrations')
        .select('*, integration_mappings(*)')
    
    // Fetch Teams directly using Supabase client to allow mapping
    const { data: teams } = await supabase.from('teams').select('id, name')

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Integrations (One-way Sync)</h3>
                <p className="text-sm text-muted-foreground">
                    Connect external tools like GitHub to automatically sync issues with your Sprint Pulse backlogs.
                </p>
            </div>
            
            <IntegrationClient 
                initialIntegrations={integrations || []} 
                teams={teams || []} 
            />
        </div>
    )
}
