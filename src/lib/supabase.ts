import { createClient } from '@supabase/supabase-js'

// Construct the admin client lazily at call time. Never create a client at
// module scope — that runs during Next's build "collect page data" step and
// throws "supabaseUrl is required" if env vars aren't present at build time.
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error('Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.')
  }
  // Force no-store so Next.js never serves stale order/customer data from its
  // fetch Data Cache — admin and order-tracking reads must always be live.
  return createClient(url, serviceKey, {
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, { ...init, cache: 'no-store' }),
    },
  })
}
