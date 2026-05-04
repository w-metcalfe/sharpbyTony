import type {APIRoute} from 'astro'
import {validatePreviewUrl} from '@sanity/preview-url-secret'
import {perspectiveCookieName} from '@sanity/preview-url-secret/constants'
import {sanityClient} from 'sanity:client'

export const GET: APIRoute = async ({request, cookies, redirect}) => {
  const token = import.meta.env.SANITY_API_READ_TOKEN

  if (!token) {
    return new Response('Server misconfigured: missing SANITY_API_READ_TOKEN', {status: 500})
  }

  const clientWithToken = sanityClient.withConfig({token})
  const {
    isValid,
    redirectTo = '/',
    studioPreviewPerspective,
  } = await validatePreviewUrl(clientWithToken, request.url)

  if (!isValid) {
    return new Response('Invalid preview secret', {status: 401})
  }

  const isLocalhost = new URL(request.url).hostname === 'localhost'

  cookies.set(perspectiveCookieName, studioPreviewPerspective ?? 'drafts', {
    httpOnly: false,
    sameSite: isLocalhost ? 'lax' : 'none',
    secure: !isLocalhost,
    path: '/',
  })

  return redirect(redirectTo, 307)
}
