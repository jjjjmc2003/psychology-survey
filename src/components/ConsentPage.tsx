
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
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold mb-2">KEISER UNIVERSITY</h1>
          <h2 className="text-lg font-bold mb-2">INSTITUTIONAL REVIEW BOARD</h2>
          <h3 className="text-lg font-bold">INFORMED CONSENT FORM</h3>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
          <div>
            <p><strong>Title of Study:</strong> [Insert Title]</p>
            <p><strong>Principal Investigator:</strong> [Name, credentials, institutional affiliation; students must identify as student investigators]</p>
            <p><strong>Co-Investigator(s) or Faculty Advisor:</strong> [Name, credentials, institutional affiliation] [Place N/A if there are none] [Faculty advisor is the faculty overseeing a student investigator]</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Invitation to Participate and Description of the Project</h4>
            <p>You are invited to participate in a research study. The information in this document will help you decide whether to join the study.</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Key Information</h4>
            <p>There are some things that you should know about this study. The purpose of this study is to [insert a concise focused, simple, description of the research project].</p>
            <p className="mt-2">If you choose to participate in this study, you will be asked to [List and describe concisely all procedures here including what, when, where, how and for what duration].</p>
            <p className="mt-2">[Briefly describe, foreseeable risks and discomforts. If risk is minimal, a statement as why this is assumed should be included.]</p>
            <p className="mt-2">[Briefly describe all direct benefits here or state that there are no direct benefits.]</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Voluntary Participation</h4>
            <p>Your participation in this study is entirely voluntary. You may refuse to participate in this research. Such refusal will not have any negative consequences for you. If you begin to participate in the research, you may at any time, for any reason, discontinue your participation without any negative consequences.</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Purpose of this Study</h4>
            <p>[In one brief paragraph, in simple terms without technical jargon, explain the scientific reason for this study.]</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Participants to Partake in the Study</h4>
            <p>[Describe here the number of anticipated participants (this is optional) and who can take part in this study (required). Include all eligibility criteria but do not describe the protocol here.]</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Study Procedures</h4>
            <p>[Begin with the expected duration of the study. This should include the amount of time, number of visits. Describe here in simple language, in order of events, exactly what will happen to the participants during this study. Include the location of events, description of interactions or activities, how data will be collected (survey, interview, etc.), explicitly state if procedures are standard or experimental, if applicable state if the procedures will be randomized and if they will include personal records and what those records are.]</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Risks and Discomforts</h4>
            <p>[Describe any foreseeable risks including physical, psychological, legal or information. A statement on informational risk (breach of confidentiality) must be included if identifiable information is included. A statement on how the risks will be minimized should be included (for example an offer of counseling services or if they become ill because of the study what is in place to address this).</p>
            <p className="mt-2">For surveys or interviews a statement concerning the ability to skip items, or not answer any questions they do not want to, must be included.</p>
            <p className="mt-2">If risk is minimal, a statement as why this is should be included.]</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Benefits</h4>
            <p>There may not be any personal benefits in participating in this study. However, [Describe what the benefits may be to others from this knowledge or any possible direct benefits.]</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Financial (or other) Considerations</h4>
            <p>[Describe, if any, financial considerations including risks, compensation or incentives. If none include: There are no financial requirements or benefits in participating in this study. Include here if anyone may benefit financially or otherwise from the information gained in this study. Disclosure of benefit to the researcher or the affiliation of the researcher to a place of benefit must be included here.]</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Confidentiality and Protection of Information</h4>
            <p>[Describe confidentiality arrangements. If applicable: note confidentiality when presenting or publishing the results of the study. Describe how the information collected will be protected and disclose any data that will be linked to personal identifiable information.]</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Other considerations and Questions</h4>
            <p>Please feel free to ask any questions about anything that seems unclear to you and to consider this research and consent form carefully before you sign.</p>
            <p className="mt-2">[Research projects that include treatment or an intervention must include here a statement explaining what alternative plan or options there is if they should not want to participate in the study.]</p>
            <p className="mt-2">Should you agree to participate in this study, you are free to leave the study at any time without penalty. In addition, if after you participate you decide you do not want your information included in the study, contact the researcher(s) and your information will be deleted without consequence. However, if your information was already used in the analysis of the study, this will not be possible.</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">IRB Certification</h4>
            <p>I understand that this research study has been reviewed and certified by the Institutional Review Board at Keiser University. For research-related problems, or questions regarding participants' rights, I can contact the Institutional Review Board through the IRB Chairperson at (954) 318-1620.</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Authorization</h4>
            <p>I understand the explanation provided to me. I have had all my questions answered to my satisfaction, and I voluntarily agree to participate in this study. I have been given a copy of this consent form. If I do not participate, there will be no penalty or loss of rights. I can stop participating at any time, even after I have started.</p>
            <p className="mt-4">I agree to participate in the study. My signature below also indicates that I have received a copy of this consent form.</p>
            <p className="mt-4">Participant's signature____________________________________</p>
            <p className="mt-2">Name (please print)______________________________________</p>
            <p className="mt-4">Date________</p>
            <p className="mt-4">(Change to electronic) [If applicable include the following signature line- if not delete: Signature of Person Obtaining Consent:______________________________]</p>
            <p className="mt-4">If you have further questions about this research project, please contact the principal investigator, [name], at [(xxx) xxx-yyyy], e-mail: [insert email] or the research supervisor, [name], at [(xxx) xxx-yyyy], e-mail: [insert email]. If you have questions about your rights as a research participant or if you have a research related complaint, please contact The IRB Chairperson at: (954) 318-1620.</p>
            <p className="mt-4">The participant will be given one copy of this consent form. One copy of this form is to be kept by the investigator for the duration of the study.</p>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-gray-300">
            <div className="flex flex-col space-y-4">
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

            <div className="pt-4 border-t border-gray-200 mt-4">
              <Button 
                variant="ghost" 
                onClick={handleAdminLogin}
                className="w-full text-xs text-gray-500 hover:text-gray-700"
              >
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentPage;
