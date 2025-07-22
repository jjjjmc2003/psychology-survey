
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

const ConsentPage: React.FC = () => {
  const navigate = useNavigate();

  const handleConsent = () => {
    navigate('/survey');
  };

  const handleAdminLogin = () => {
    navigate('/admin/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <Card className="border shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <FileText className="w-12 h-12 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-800">KEISER UNIVERSITY</h1>
              <h2 className="text-xl font-semibold text-gray-700">INSTITUTIONAL REVIEW BOARD</h2>
              <h3 className="text-lg font-medium text-gray-600">INFORMED CONSENT FORM</h3>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 text-sm leading-relaxed">
            <div className="space-y-4">
              <div>
                <p><strong>Title of Study:</strong> Social Media, Body Image, and Cosmetic Surgery Attitudes</p>
                <p><strong>Principal Investigator:</strong> [Student Investigator Name]</p>
                <p><strong>Faculty Advisor:</strong> [Faculty Advisor Name]</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Invitation to Participate and Description of the Project</h4>
                <p>You are invited to participate in a research study. The information in this document will help you decide whether to join the study.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Key Information</h4>
                <p>There are some things that you should know about this study. The purpose of this study is to examine the relationship between social media exposure to edited vs. unedited images and attitudes toward body image and cosmetic surgery.</p>
                <p className="mt-2">If you choose to participate in this study, you will be asked to complete an online survey that includes demographic questions, questions about your social media usage, viewing a set of images, and answering questions about body image and cosmetic surgery attitudes. The survey will take approximately 25-30 minutes to complete.</p>
                <p className="mt-2">The risks associated with this study are minimal and are no greater than those encountered in daily life. There are no direct benefits to you for participating in this study, but your participation may contribute to our understanding of social media's impact on body image perceptions.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Voluntary Participation</h4>
                <p>Your participation in this study is entirely voluntary. You may refuse to participate in this research. Such refusal will not have any negative consequences for you. If you begin to participate in the research, you may at any time, for any reason, discontinue your participation without any negative consequences.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Purpose of this Study</h4>
                <p>This study aims to investigate how exposure to edited versus unedited images on social media may influence attitudes toward body image and cosmetic surgery procedures.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Participants to Partake in the Study</h4>
                <p>We are seeking approximately 200 participants who are 18 years of age or older and have social media accounts.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Study Procedures</h4>
                <p>The study will take approximately 25-30 minutes to complete. You will be asked to complete an online survey that includes:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Demographic questions (age, gender, race/ethnicity)</li>
                  <li>Questions about your social media usage habits</li>
                  <li>Viewing a series of images (you will be randomly assigned to view either unedited images only, or both unedited and edited versions)</li>
                  <li>Questions about your current feelings about your body image</li>
                  <li>Questions about your attitudes toward cosmetic surgery</li>
                </ul>
                <p className="mt-2">All procedures are standard questionnaires used in psychological research.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Risks and Discomforts</h4>
                <p>The risks associated with this study are minimal. Some participants may experience mild discomfort when viewing images or answering questions about body image. You have the right to skip any questions you do not want to answer or discontinue participation at any time without penalty. Information about counseling resources will be provided at the end of the survey if needed.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Benefits</h4>
                <p>There may not be any personal benefits in participating in this study. However, your participation may contribute to scientific understanding of how social media content affects body image perceptions and attitudes toward cosmetic surgery.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Financial Considerations</h4>
                <p>There are no financial requirements or benefits in participating in this study.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Confidentiality and Protection of Information</h4>
                <p>Your responses will be completely anonymous. No identifying information will be collected, and your responses cannot be linked back to you. All data will be stored securely and used only for research purposes. When presenting or publishing the results of the study, only aggregate data will be reported.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Other Considerations and Questions</h4>
                <p>Please feel free to ask any questions about anything that seems unclear to you and to consider this research and consent form carefully before you participate.</p>
                <p className="mt-2">Should you agree to participate in this study, you are free to leave the study at any time without penalty. In addition, if after you participate you decide you do not want your information included in the study, contact the researcher(s) and your information will be deleted without consequence. However, if your information was already used in the analysis of the study, this will not be possible.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">IRB Certification</h4>
                <p>I understand that this research study has been reviewed and certified by the Institutional Review Board at Keiser University. For research-related problems, or questions regarding participants' rights, I can contact the Institutional Review Board through the IRB Chairperson at (954) 318-1620.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Authorization</h4>
                <p>I understand the explanation provided to me. I have had all my questions answered to my satisfaction, and I voluntarily agree to participate in this study. I have been given a copy of this consent form. If I do not participate, there will be no penalty or loss of rights. I can stop participating at any time, even after I have started.</p>
                <p className="mt-2">I agree to participate in the study. By clicking "I Consent to Participate" below, I indicate that I have received a copy of this consent form.</p>
              </div>
            </div>

            <div className="flex flex-col space-y-3 pt-6 border-t">
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
