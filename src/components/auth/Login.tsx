import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { EmailLogin } from './EmailLogin'
import { EmailSignUp } from './EmailSignUp'
import { PasswordReset } from './PasswordReset'

export function Login() {
  const { signInWithGoogle } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [currentView, setCurrentView] = useState<'signin' | 'signup' | 'reset'>('signin')

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
      toast({
        title: "Success",
        description: "Successfully signed in with Google!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Procurement Intelligence</h1>
          <p className="text-muted-foreground">
            Sign in to access the procurement dashboard
          </p>
        </div>

        {/* Google Sign In */}
        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={handleGoogleSignIn} 
              disabled={isLoading}
              className="w-full"
              size="lg"
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email Authentication */}
        {currentView === 'signin' && (
          <EmailLogin 
            onSwitchToSignUp={() => setCurrentView('signup')}
            onSwitchToReset={() => setCurrentView('reset')}
          />
        )}
        
        {currentView === 'signup' && (
          <EmailSignUp onSwitchToSignIn={() => setCurrentView('signin')} />
        )}

        {currentView === 'reset' && (
          <PasswordReset onBack={() => setCurrentView('signin')} />
        )}
        
        <div className="text-center text-sm text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  )
}
