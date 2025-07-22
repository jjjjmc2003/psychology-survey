
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UserPlus, LogIn, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SignInForm } from './auth/SignInForm';
import { SignUpForm } from './auth/SignUpForm';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [invitationToken, setInvitationToken] = useState('');
  const [activeTab, setActiveTab] = useState('signin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-0 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-between items-start mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Consent Form
            </Button>
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
              <TabsTrigger value="signin" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <SignInForm
                email={email}
                password={password}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
              />
            </TabsContent>

            <TabsContent value="signup">
              <SignUpForm
                email={email}
                password={password}
                firstName={firstName}
                lastName={lastName}
                invitationToken={invitationToken}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onFirstNameChange={setFirstName}
                onLastNameChange={setLastName}
                onInvitationTokenChange={setInvitationToken}
                onSwitchToSignIn={() => setActiveTab('signin')}
              />
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800 mb-1">Secure Access</h3>
                <p className="text-sm text-green-700">
                  Admin registration requires a valid invitation token from an existing administrator. 
                  The invitation token validates your authorization regardless of email domain.
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
