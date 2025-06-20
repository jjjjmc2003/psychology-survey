
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileText, Shield, Users, AlertCircle } from 'lucide-react';

const ConsentPage: React.FC = () => {
  const navigate = useNavigate();

  const handleConsent = () => {
    navigate('/survey');
  };

  const handleAdminLogin = () => {
    navigate('/admin/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-6">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
              Psychology Research Survey
            </CardTitle>
            <p className="text-gray-600 text-lg">
              Anonymous Research Participation
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-3 text-lg">Research Consent & Information</h3>
                  <div className="space-y-3 text-sm text-blue-700">
                    <p>
                      <strong>Purpose:</strong> This survey is part of a psychology research study investigating human behavior and decision-making patterns.
                    </p>
                    <p>
                      <strong>Participation:</strong> Your participation is completely voluntary and anonymous. No personal identifying information will be collected.
                    </p>
                    <p>
                      <strong>Duration:</strong> The survey takes approximately 25-30 minutes to complete with 33 questions total.
                    </p>
                    <p>
                      <strong>Data Usage:</strong> All responses will be used solely for academic research purposes and will be stored securely and anonymously.
                    </p>
                    <p>
                      <strong>Withdrawal:</strong> You may withdraw from the study at any time without penalty by simply closing your browser.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-green-800 mb-1">Anonymous</h4>
                <p className="text-xs text-green-700">No personal data collected</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-purple-800 mb-1">Voluntary</h4>
                <p className="text-xs text-purple-700">Participate by choice</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-semibold text-orange-800 mb-1">Research</h4>
                <p className="text-xs text-orange-700">Academic purposes only</p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>By clicking "I Consent to Participate" below, you acknowledge that:</strong>
              </p>
              <ul className="text-xs text-yellow-700 mt-2 space-y-1 ml-4">
                <li>• You have read and understood the research information</li>
                <li>• You voluntarily agree to participate in this study</li>
                <li>• You understand your responses will be used for research purposes</li>
                <li>• You are at least 18 years of age</li>
              </ul>
            </div>

            <div className="flex flex-col space-y-3">
              <Button 
                onClick={handleConsent}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg"
              >
                I Consent to Participate
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.close()}
                className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                I Do Not Wish to Participate
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button 
                variant="ghost" 
                onClick={handleAdminLogin}
                className="w-full text-xs text-gray-500 hover:text-gray-700"
              >
                Admin Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsentPage;
