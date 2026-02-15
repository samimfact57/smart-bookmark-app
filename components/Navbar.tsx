'use client'

import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'
import { Moon, Sun, User as UserIcon, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar'

export function Navbar() {
    const { user, signOut } = useAuth()
    const { theme, setTheme } = useTheme()

    return (
        <nav className="border-b border-border bg-background/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
                <Link href="/" className="font-semibold text-lg hover:opacity-80 transition-opacity">
                    Bookmark
                </Link>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.user_metadata.avatar_url} alt={user.email || ''} />
                                        <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <div className="flex items-center justify-start gap-2 p-2">
                                    <div className="flex flex-col space-y-1 leading-none">
                                        {user.user_metadata.full_name && (
                                            <p className="font-medium">{user.user_metadata.full_name}</p>
                                        )}
                                        {user.email && (
                                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                                                {user.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        null // Login button should be on the login page, but maybe we want one here too? The task says Login Page is separate.
                    )}
                </div>
            </div>
        </nav>
    )
}
