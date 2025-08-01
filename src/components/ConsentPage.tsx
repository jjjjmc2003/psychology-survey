import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronDown, Shield, Lock } from 'lucide-react';
import keiserLogo from '@/assets/keiser-logo.png';

const ConsentPage: React.FC = () => {
  const navigate = useNavigate();
  const consentRef = useRef<HTMLDivElement>(null);

  const handleConsent = () => {
    navigate('/survey');
  };

  const scrollToConsent = () => {
    consentRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  const handleAdminLogin = () => {
    navigate('/admin/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={scrollToConsent} 
          size="lg" 
          className="rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700 text-white" 
          title="Scroll to consent section"
        >
          <ChevronDown className="w-6 h-6" />
        </Button>
      </div>

      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        {/* Header Card */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-8">
            <div className="text-center">
              <img src={keiserLogo} alt="Keiser University Logo" className="w-24 h-24 mx-auto mb-6" />
              <h1 className="text-2xl font-bold mb-2 text-gray-800">KEISER UNIVERSITY</h1>
              <h2 className="text-xl font-bold mb-2 text-gray-700">INSTITUTIONAL REVIEW BOARD</h2>
              <h3 className="text-lg font-bold text-blue-600">INFORMED CONSENT FORM</h3>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Card */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="space-y-8 text-sm leading-relaxed text-gray-700">
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-800 text-base mb-3">Study Information</h4>
                <div className="space-y-2">
                  <p className="font-bold text-slate-950"><strong>Title of Study:</strong> The Impact of Edited Beauty-Related Content on Body Image Satisfaction and Acceptance of Cosmetic Procedures.</p>
                  <p><strong>Principal Investigator:</strong> Martha Castillo, B.A., Student Investigator, Keiser University</p>
                  <p><strong>Co-Investigator(s) or Faculty Advisor:</strong> Dr. Lori Daniels, Ph.D., Keiser University (Faculty Advisor) Dr. Jennifer Danilowski, Ph.D., Keiser University (Committee Member) Dr. Steven Whitaker, Ph.D., Keiser University (Committee Member)</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">Invitation to Participate and Description of the Project</h4>
                <p className="text-gray-600">You are invited to participate in a research study. The information in this document will help you decide whether to join the study.</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <h4 className="font-bold mb-3 text-green-800 text-base">Key Information</h4>
                <div className="space-y-3 text-gray-700">
                  <p>There are some things that you should know about this study. The purpose of this study is to investigate whether exposure to edited versus unedited beauty content impacts body image perception and interest in cosmetic procedures.

If you choose to participate in this study, you will be asked to view a series of images and then complete a survey. The study will be conducted online and will take approximately 22 minutes of your time. You will view images of women and then answer questions about body image, societal beauty pressures, and attitudes toward cosmetic procedures.

Risks are minimal. You may experience mild emotional discomfort when evaluating your body image. However, this risk is assumed to be no greater than what one might experience from regular social media exposure. There are no direct benefits to you for participating in this study.</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">Voluntary Participation</h4>
                <p className="text-gray-600 text-base">Your participation in this study is entirely voluntary. You may refuse to participate in this research. Such refusal will not have any negative consequences for you. If you begin to participate in the research, you may at any time, for any reason, discontinue your participation without any negative consequences.</p>
              </div>

              <Separator className="my-6" />
              
              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">Purpose of this Study</h4>
                <p className="text-gray-600">This study aims to examine how beauty-related content may influence body image satisfaction and an individual's openness to cosmetic enhancement procedures. By examining reactions to images, the research hopes to better understand how social comparison may shape personal attitudes and behaviors.</p>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">Participants to Partake in the Study</h4>
                <p className="text-gray-600">Participants must be 18 years of age or older. Those who meet this eligibility criterion are welcome to participate.</p>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">Study Procedures</h4>
                <p className="text-gray-600">The total duration of participation is 22 minutes. Participants will provide consent, answer demographic questions, view pictures of women, and complete survey questions regarding body image satisfaction and acceptance of cosmetic procedures. All procedures will take place online in a single session and are experimental in nature. No personal medical or academic records will be accessed.</p>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">Risks and Discomforts</h4>
                <div className="space-y-3 text-gray-600">
                  <p>This study poses minimal risk to participants. Viewing images of other
individuals may cause mild discomfort or negative self-reflection. These
reactions are similar to what is experienced when browsing social media
platforms. You may skip any questions you are uncomfortable answering or
discontinue participation at any time.
All data will be collected anonymously, reducing risk to your personal
information. No identifying information will be stored or linked to your
responses.</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">Benefits</h4>
                <p className="text-gray-600">There may not be any personal benefits in participating in this study. However,
this research may contribute to a better understanding of how social media and
image editing influence women's body image and decision-making about beauty standards and cosmetic procedures.</p>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">Financial (or other) Considerations</h4>
                <p className="text-gray-600">There are no financial requirements or benefits in participating in this study.</p>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">Confidentiality and Protection of Information</h4>
                <p className="text-gray-600">All responses will be collected anonymously through an online survey tool. No
names, emails, or identifying data will be linked to survey responses. The
findings may be published or presented but will never contain any information
that could identify individual participants. All data will be stored on a secure,
password-protected computer accessible only by the research team.</p>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">IRB Certification</h4>
                <p className="text-gray-600">I understand that this research study has been reviewed and certified by the
Institutional Review Board at Keiser University. For research-related problems,
or questions regarding participants' rights, I can contact the Institutional
Review Board through the IRB Chairperson at (954) 318-1620.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consent Section */}
        <Card ref={consentRef} className="mt-8 shadow-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl font-bold text-blue-800 flex items-center justify-center gap-2">
              <FileText className="w-6 h-6" />
              Authorization & Consent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-blue-100">
              <h4 className="font-bold mb-4 text-gray-800 text-base">Authorization</h4>
              <div className="space-y-3 text-gray-600 text-sm">
                <p>I understand the explanation provided to me. I have had all my questions
answered to my satisfaction, and I voluntarily agree to participate in this study.
I have been given a copy of this consent form. If I do not participate, there will
be no penalty or loss of rights. I can stop participating at any time, even after I
have started.</p>
                <p className="font-semibold text-blue-700">I agree to participate in the study. Clicking the consent button below indicates that I have received a copy of this consent form.</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handleConsent} 
                className="w-full py-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-xl shadow-lg"
              >
                ✓ I Consent to Participate in This Study
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.close()} 
                className="w-full py-4 text-gray-600 border-2 border-gray-300 hover:bg-gray-50 font-semibold"
              >
                I Do Not Wish to Participate
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="text-xs text-gray-500 space-y-2">
              <p className="text-sm">If you have further questions about this research project, please contact the principal investigator, Martha Castillo , at
(305) 975-9801 , e-mail: m.castillo35@student.keiseruniversity.edu or the research supervisor, Dr. Lori Daniels , at
(561) 478-5500 , e-mail: ldaniels@keiseruniversity.edu . If you have questions about your rights as a research participant or if you have a research related complaint, please contact The IRB Chairperson at: (954) 318-1620.

The participant will be given one copy of this consent form. One copy of this form is to be kept by the investigator for the duration of the study.</p>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <Button 
                onClick={handleAdminLogin} 
                variant="outline" 
                className="w-full py-3 bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-slate-200 hover:from-slate-100 hover:to-gray-100 hover:border-slate-300 text-slate-700 hover:text-slate-800 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Administrator Access</span>
                  <Lock className="w-3 h-3 opacity-60" />
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsentPage;