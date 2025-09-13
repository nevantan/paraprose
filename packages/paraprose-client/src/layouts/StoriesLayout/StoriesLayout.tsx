// Libraries
import { authClient, useSession } from '@/lib/auth'
import { faHome, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import React from 'react'

interface StoriesLayoutProps {
  children: React.ReactNode
  title: string | React.ReactNode
}

export const StoriesLayout: React.FC<StoriesLayoutProps> = ({
  children,
  title,
}) => {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  const { mutate: signOut, isPending: isSigningOut } = useMutation({
    mutationFn: async () => authClient.signOut(),
  })

  if (!isPending && !session) {
    router.navigate({ to: '/auth' })
  }

  return (
    <div className="flex">
      <div className="flex flex-col p-4 text-steel">
        <FontAwesomeIcon size="lg" icon={faHome} />
      </div>

      <div className="flex flex-1 flex-col items-center">
        <div className="flex flex-col w-full max-w-4xl px-2 min-h-screen">
          <header className="py-4 flex justify-between items-center">
            <h1>{title}</h1>

            <div className="flex items-center gap-4">
              {session && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {session.user?.email}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center text-royal gap-2 px-3 py-1 text-xs hover:bg-gray-100 cursor-pointer rounded"
                    disabled={isSigningOut}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    {isSigningOut ? 'Signing out...' : 'Sign Out'}
                  </button>
                </div>
              )}
            </div>
          </header>

          {children}
        </div>
      </div>

      <div className="w-[57px]"></div>
    </div>
  )
}
