import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseKey) {
  console.log('No supabase key found')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('Querying teams...')
  const { data: teams } = await supabase.from('teams').select('*')
  console.log('Teams:', teams)

  console.log('Querying team_members...')
  const { data: teamMembers } = await supabase.from('team_members').select('*')
  console.log('Team Members:', teamMembers)

  console.log('Querying account_members...')
  const { data: accountMembers } = await supabase.from('account_members').select('*')
  console.log('Account Members:', accountMembers)

  console.log('Querying profiles...')
  const { data: profiles } = await supabase.from('profiles').select('*')
  console.log('Profiles:', profiles)
}

run()
