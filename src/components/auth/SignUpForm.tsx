
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Key, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SignUpFormProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  invitationToken: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onFirstNameChange: (firstName: string) => void;
  onLastNameChange: (lastName: string) => void;
  onInvitationTokenChange: (token: string) => void;
  onSwitchToSignIn: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  email,
  password,
  firstName,
  lastName,
  invitationToken,
  onEmailChange,
  onPasswordChange,
  onFirstNameChange,
  onLastNameChange,
  onInvitationTokenChange,
  onSwitchToSignIn
}) => {
  const [loading, setLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const { toast } = useToast();

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
      const { data: isValid, error: validationError } = await supabase
        .rpc('validate_admin_signup', {
          p_email: email,
          p_invitation_token: invitationToken
        });

      if (validationError) {
        console.error('Validation error:', validationError);
        toast({
          title: "Validation failed",
          description: "Failed to validate invitation token. Please try again.",
          variant: "destructive",
        });
        return;
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
          emailRedirectTo: `${window.location.origin}/admin`,
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
          onSwitchToSignIn();
        } else {
          throw error;
        }
      } else {
        setShowEmailVerification(true);
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
        });
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

  if (showEmailVerification) {
    return (
      <div className="space-y-4">
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Registration Successful!</strong>
            <br />
            We've sent a verification email to <strong>{email}</strong>. 
            Please check your inbox and click the verification link to complete your account setup.
            <br /><br />
            <em>Note: The email may take a few minutes to arrive. Don't forget to check your spam folder!</em>
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowEmailVerification(false)}
            className="flex-1"
          >
            Back to Registration
          </Button>
          <Button 
            onClick={onSwitchToSignIn}
            className="flex-1 bg-slate-600 hover:bg-slate-700"
          >
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
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
            onChange={(e) => onFirstNameChange(e.target.value)}
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
            onChange={(e) => onLastNameChange(e.target.value)}
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
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Enter your admin email"
          required
        />
        <p className="text-xs text-gray-500">
          Must have a valid invitation token
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
          onChange={(e) => onPasswordChange(e.target.value)}
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
          onChange={(e) => onInvitationTokenChange(e.target.value)}
          placeholder="Paste your invitation token here"
          required
        />
        <p className="text-xs text-gray-500">
          Copy and paste the token from your invitation email
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
  );
};
