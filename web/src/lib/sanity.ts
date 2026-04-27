import {createClient, type QueryParams} from '@sanity/client'

const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  // Pinned to project start date — increment when using new Sanity API features
  apiVersion: '2026-04-26',
  // JC #1: bypass CDN in dev for fresh data; enable in production builds
  useCdn: import.meta.env.PROD,
  // JC #2: undefined when not set — unauthenticated reads of published content still work
  token: import.meta.env.SANITY_API_READ_TOKEN,
})

export async function sanityFetch<T>(query: string, params?: QueryParams): Promise<T> {
  return client.fetch<T>(query, params ?? {})
}
