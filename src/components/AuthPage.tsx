
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, LogIn, Mail, Lock, User, AlertCircle, Shield, Key } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AUTH_CONFIG = {
  ADMIN_EMAIL_DOMAINS: ['@psychology.research', '@admin.research'],
  ADMIN_EMAILS: ['admin@lovable.dev', 'research@admin.com'],
};

const AuthPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [invitationToken, setInvitationToken] = useState('');
  const [activeTab, setActiveTab] = useState('signin');
  const [hasInvitation, setHasInvitation] = useState(false);
  const { toast } = useToast();

  // Check for invitation token and email in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const emailFromUrl = urlParams.get('email');
    
    if (tokenFromUrl && emailFromUrl) {
      setInvitationToken(tokenFromUrl);
      setEmail(decodeURIComponent(emailFromUrl));
      setActiveTab('signup');
      setHasInvitation(true);
      toast({
        title: "Invitation found",
        description: "Please complete your registration using the invitation details.",
      });
      
      // Clear URL parameters to clean up the address bar
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [toast]);

  const isAdminEmail = (email: string): boolean => {
    const lowerEmail = email.toLowerCase();
    return AUTH_CONFIG.ADMIN_EMAIL_DOMAINS.some(domain => lowerEmail.includes(domain)) ||
           AUTH_CONFIG.ADMIN_EMAILS.some(adminEmail => lowerEmail === adminEmail.toLowerCase());
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both first and last name.",
        variant: "destructive",
      });
      return;
    }

    if (!isAdminEmail(email)) {
      toast({
        title: "Invalid email domain",
        description: "Admin registration is restricted to authorized email domains.",
        variant: "destructive",
      });
      return;
    }

    if (!invitationToken.trim()) {
      toast({
        title: "Invitation token required",
        description: "Please enter your invitation token to register as an admin.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Validate invitation token before creating account
      const { data: isValid, error: validationError } = await supabase
        .rpc('validate_admin_signup', {
          p_email: email,
          p_invitation_token: invitationToken
        });

      if (validationError) {
        throw new Error('Failed to validate invitation token');
      }

      if (!isValid) {
        toast({
          title: "Invalid invitation",
          description: "The invitation token is invalid, expired, or already used.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim()
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
          setActiveTab('signin');
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Registration successful",
          description: "Your admin account has been created. You can now sign in.",
        });
        // Clear form and switch to sign in
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setInvitationToken('');
        setHasInvitation(false);
        setActiveTab('signin');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check rate limiting before attempting login
      const { data: canAttempt, error: rateLimitError } = await supabase
        .rpc('check_rate_limit', {
          p_identifier: email,
          p_action_type: 'login_attempt',
          p_max_attempts: 5,
          p_window_minutes: 15
        });

      if (rateLimitError) {
        console.warn('Rate limit check failed:', rateLimitError);
      }

      if (canAttempt === false) {
        toast({
          title: "Too many attempts",
          description: "Please wait before trying to sign in again.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Sign in failed",
            description: "Invalid email or password. Please check your credentials.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-0 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-slate-100 p-3 rounded-full">
              <Shield className="w-8 h-8 text-slate-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
            Admin Dashboard Access
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Secure access for research administrators
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin" className="flex items-center gap-2" disabled={hasInvitation}>
                <LogIn className="w-4 h-4" />
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Register
              </TabsTrigger>
            </TabsList>

            {hasInvitation && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">Invitation Detected</h3>
                    <p className="text-sm text-blue-700">
                      Complete the registration form below to accept your admin invitation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your admin email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-slate-600 hover:bg-slate-700"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In to Dashboard'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      First Name
                    </Label>
                    <Input
                      id="first-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Last Name
                    </Label>
                    <Input
                      id="last-name"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Admin Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your admin email"
                    disabled={hasInvitation}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Must be from an authorized domain
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min 6 characters)"
                    minLength={6}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invitation-token" className="flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Invitation Token
                  </Label>
                  <Input
                    id="invitation-token"
                    type="text"
                    value={invitationToken}
                    onChange={(e) => setInvitationToken(e.target.value)}
                    placeholder="Enter your invitation token"
                    disabled={hasInvitation}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    {hasInvitation ? "Token automatically filled from invitation" : "Contact your research administrator for an invitation token"}
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-slate-600 hover:bg-slate-700"
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Register Admin Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800 mb-1">Secure Access</h3>
                <p className="text-sm text-green-700">
                  Admin registration now requires a valid invitation token from an existing administrator. 
                  This ensures only authorized personnel can access the research dashboard.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
