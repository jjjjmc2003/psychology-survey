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
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={scrollToConsent} size="lg" className="rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700 text-white" title="Scroll to consent section">
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
                  <p><strong>Title of Study:</strong> The Psychological Impact of Edited Beauty Content on Social Media.</p>
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
                  <p>There are some things that you should know about this study. The purpose of this study is to investigate whether exposure to edited versus unedited beauty content on social media affects body image perception and interest in cosmetic procedures  .

If you choose to participate in this study, you will be asked to view a series of images and then complete a survey. The study will be conducted online and will take approximately 10–15 minutes of your time. Participants will be randomly assigned to one of two conditions: one group will view unedited images of women, while the other group will view both the unedited and digitally edited versions of the same images. After viewing, all participants will answer questions about body image, societal beauty pressures, and attitudes toward cosmetic procedures. Risks are minimal. You may experience mild emotional discomfort when evaluating your body image. However, this risk is assumed to be no greater than what one might experience from regular social media exposure. There are no direct benefits to you for participating in this study .</p>
                  
                  
                  
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">Voluntary Participation</h4>
                <p className="text-gray-600">Your participation in this study is entirely voluntary. You may refuse to participate in this research. Such refusal will not have any negative consequences for you. If you begin to participate in the research, you may at any time, for any reason, discontinue your participation without any negative consequences.</p>
              </div>

              <Separator className="my-6" />
              
              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">Purpose of this Study</h4>
                <p className="text-gray-600">This study aims to understand how the sequence in which images are presented to participants influences their responses and choices. By varying the order of image presentation, we hope to gain insights into cognitive processes and potential biases that may occur during visual information processing in survey contexts.</p>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">Participants to Partake in the Study</h4>
                <p className="text-gray-600">We anticipate recruiting approximately 200 participants for this study. To participate, you must be at least 18 years old, have normal or corrected-to-normal vision, and be able to read and understand English. There are no other specific eligibility requirements for participation.</p>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">Study Procedures</h4>
                <p className="text-gray-600">This study requires one session lasting approximately 15-20 minutes and can be completed entirely online from your preferred location. During the study, you will view a series of images presented on your computer screen and answer questions about what you see. The order in which images are shown will be randomized for experimental purposes. Your responses will be collected through an online survey system. The procedures are experimental in nature, designed to test how image presentation order affects responses. No personal records will be accessed or required for this study.</p>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">Risks and Discomforts</h4>
                <div className="space-y-3 text-gray-600">
                  <p>The risks associated with this study are minimal because the procedures involve only viewing images and answering survey questions, which are similar to everyday activities such as browsing websites or social media. Potential risks include minor eye strain or fatigue from computer screen viewing. There is a minimal risk of breach of confidentiality, though this is minimized by collecting only non-identifiable response data and using secure data storage systems.</p>
                  <p>You have the right to skip any questions you do not wish to answer or to discontinue participation at any time without penalty.</p>
                  <p>Risk is considered minimal because the study procedures are no more harmful or stressful than activities encountered in daily life, such as using a computer or smartphone.</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">Benefits</h4>
                <p className="text-gray-600">There may not be any personal benefits in participating in this study. However, your participation will contribute to scientific understanding of human perception and decision-making processes, which may ultimately benefit society by improving how visual information is presented in educational, medical, and other important contexts.</p>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">Financial (or other) Considerations</h4>
                <p className="text-gray-600">There are no financial requirements or benefits in participating in this study. You will not receive any compensation for your participation, nor will you incur any costs. The researchers and Keiser University may benefit academically from the knowledge gained through this research, but there are no financial benefits to the investigators or institution from this study.</p>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">Confidentiality and Protection of Information</h4>
                <p className="text-gray-600">Your responses will be kept confidential and will be stored securely in encrypted databases. When presenting or publishing the results of this study, no personally identifying information will be included. Data collected will include only your survey responses and the time stamps of your participation. Your name and electronic signature will be stored separately from your survey responses to protect your privacy. All data will be retained for a minimum of three years as required by federal regulations and then securely destroyed.</p>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">Other considerations and Questions</h4>
                <div className="space-y-3 text-gray-600">
                  <p>Please feel free to ask any questions about anything that seems unclear to you and to consider this research and consent form carefully before you sign.</p>
                  <p>There are no alternative treatments or interventions associated with this study, as it is observational research involving survey responses only.</p>
                  <p>Should you agree to participate in this study, you are free to leave the study at any time without penalty. In addition, if after you participate you decide you do not want your information included in the study, contact the researcher(s) and your information will be deleted without consequence. However, if your information was already used in the analysis of the study, this will not be possible.</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-800 text-base">IRB Certification</h4>
                <p className="text-gray-600">I understand that this research study has been reviewed and certified by the Institutional Review Board at Keiser University. For research-related problems, or questions regarding participants' rights, I can contact the Institutional Review Board through the IRB Chairperson at (954) 318-1620.</p>
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
                <p>I understand the explanation provided to me. I have had all my questions answered to my satisfaction, and I voluntarily agree to participate in this study. I have been given a copy of this consent form. If I do not participate, there will be no penalty or loss of rights. I can stop participating at any time, even after I have started.</p>
                <p className="font-semibold text-blue-700">I agree to participate in the study. Clicking the consent button below indicates that I have received a copy of this consent form.</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button onClick={handleConsent} className="w-full py-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-xl shadow-lg">
                ✓ I Consent to Participate in This Study
              </Button>
              
              <Button variant="outline" onClick={() => window.close()} className="w-full py-4 text-gray-600 border-2 border-gray-300 hover:bg-gray-50 font-semibold">
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
              <Button onClick={handleAdminLogin} variant="outline" className="w-full py-3 bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-slate-200 hover:from-slate-100 hover:to-gray-100 hover:border-slate-300 text-slate-700 hover:text-slate-800 font-medium transition-all duration-200 shadow-sm hover:shadow-md">
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
    </div>;
};
export default ConsentPage;