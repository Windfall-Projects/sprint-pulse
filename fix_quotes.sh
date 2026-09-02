#!/bin/bash
supabase start
supabase status -o env | grep -E 'API_URL|SERVICE_ROLE_KEY|ANON_KEY' | sed 's/"//g' >> $GITHUB_ENV
