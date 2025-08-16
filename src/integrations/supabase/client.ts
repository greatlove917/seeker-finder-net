
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rlsyyvuelmrdlldwzxgn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsc3l5dnVlbG1yZGxsZHd6eGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODkyMDgsImV4cCI6MjA3MDU2NTIwOH0.qO3dhV6DHGwWl0H857UhOXufmB0qKXzCwcBeJOCQyjI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
