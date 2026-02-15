'use client'

import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'
import { Button } from '@openai/apps-sdk-ui/components/Button'
import { Avatar } from '@openai/apps-sdk-ui/components/Avatar'
import { Menu } from '@openai/apps-sdk-ui/components/Menu'
import { Sun, Moon, ExitLogout } from '@openai/apps-sdk-ui/components/Icon'
import { useState, useEffect } from 'react'

export function Navbar() {
    const { user, signOut } = useAuth()
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('theme')
        if (saved === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark')
            setIsDark(true)
        }
    }, [])

    const toggleTheme = () => {
        const next = isDark ? 'light' : 'dark'
        document.documentElement.setAttribute('data-theme', next)
        localStorage.setItem('theme', next)
        setIsDark(!isDark)
    }

    return (
        <nav className="border-b border-default bg-surface/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
                <Link href="/" className="heading-sm hover:opacity-80 transition-opacity">
                    Bookmark
                </Link>

                <div className="flex items-center gap-2">
                    <Button
                        color="secondary"
                        variant="ghost"
                        size="sm"
                        uniform
                        onClick={toggleTheme}
                    >
                        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                    </Button>

                    {user ? (
                        <Menu>
                            <Menu.Trigger>
                                <Avatar
                                    size={32}
                                    imageUrl={user.user_metadata.avatar_url}
                                    name={user.user_metadata.full_name || user.email || ''}
                                />
                            </Menu.Trigger>
                            <Menu.Content align="end" minWidth={220}>
                                <div className="px-3 py-2.5 border-b border-subtle">
                                    {user.user_metadata.full_name && (
                                        <p className="text-sm font-medium text-default">{user.user_metadata.full_name}</p>
                                    )}
                                    {user.email && (
                                        <p className="text-xs text-tertiary truncate max-w-[200px]">
                                            {user.email}
                                        </p>
                                    )}
                                </div>
                                <Menu.Item onSelect={() => signOut()}>
                                    <ExitLogout className="size-4 text-danger" />
                                    <span className="text-danger">Log out</span>
                                </Menu.Item>
                            </Menu.Content>
                        </Menu>
                    ) : null}
                </div>
            </div>
        </nav>
    )
}
