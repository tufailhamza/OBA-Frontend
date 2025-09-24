import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { LogOut, User } from 'lucide-react'

export function UserProfile() {
  const { user, logout } = useAuth()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Success",
        description: "Successfully signed out!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!user) return null

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold">User Profile</CardTitle>
        <CardDescription>
          Your account information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
            <AvatarFallback>
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center space-y-1">
            <h3 className="font-semibold text-lg">{user.displayName || 'User'}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Email Verified:</span>
            <span className={user.emailVerified ? 'text-green-600' : 'text-red-600'}>
              {user.emailVerified ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Provider:</span>
            <span>Google</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Sign In:</span>
            <span>{user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>

        <Button 
          onClick={handleLogout} 
          variant="outline" 
          className="w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </CardContent>
    </Card>
  )
}


