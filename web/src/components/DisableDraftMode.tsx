import {useIsPresentationTool} from '@sanity/visual-editing/react'

export default function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool()

  // Only show when viewed outside the Presentation Tool iframe
  if (isPresentationTool !== false) return null

  return (
    <a
      href="/api/draft-mode/disable"
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 50,
        padding: '0.5rem 1rem',
        borderRadius: '9999px',
        backgroundColor: '#101112',
        color: '#fff',
        textDecoration: 'none',
        fontSize: '0.875rem',
        fontWeight: 600,
      }}
    >
      Disable Draft Mode
    </a>
  )
}
