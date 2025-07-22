
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import keiserLogo from '@/assets/keiser-logo.png';

const ConsentPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [participantName, setParticipantName] = useState('');
  const [participantSignature, setParticipantSignature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConsent = async () => {
    if (!participantName.trim() || !participantSignature.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both your name and signature before consenting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('consent_records')
        .insert({
          participant_name: participantName.trim(),
          participant_signature: participantSignature.trim(),
          ip_address: null, // Will be set by the database
          user_agent: navigator.userAgent,
        });

      if (error) {
        console.error('Error saving consent:', error);
        toast({
          title: "Error",
          description: "There was an error saving your consent. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Consent Recorded",
        description: "Your consent has been successfully recorded.",
      });

      navigate('/survey');
    } catch (error) {
      console.error('Error saving consent:', error);
      toast({
        title: "Error",
        description: "There was an error saving your consent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogin = () => {
    navigate('/admin/auth');
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <img 
            src={keiserLogo} 
            alt="Keiser University Logo" 
            className="w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-xl font-bold mb-2">KEISER UNIVERSITY</h1>
          <h2 className="text-lg font-bold mb-2">INSTITUTIONAL REVIEW BOARD</h2>
          <h3 className="text-lg font-bold">INFORMED CONSENT FORM</h3>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
          <div>
            <p><strong>Title of Study:</strong> Investigating the Impact of Image Presentation Order on Survey Response Patterns</p>
            <p><strong>Student Investigator:</strong> Martha Castillo, Psychology Student, Keiser University</p>
            <p><strong>Faculty Advisor:</strong> Dr. Lowry Daniels, Associate Professor of Psychology, Keiser University</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Invitation to Participate and Description of the Project</h4>
            <p>You are invited to participate in a research study. The information in this document will help you decide whether to join the study.</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Key Information</h4>
            <p>There are some things that you should know about this study. The purpose of this study is to examine how the order of image presentation affects participants' responses and decision-making patterns in survey environments.</p>
            <p className="mt-2">If you choose to participate in this study, you will be asked to complete an online survey that includes viewing images and answering related questions. The survey will take approximately 15-20 minutes to complete and can be done from any location with internet access.</p>
            <p className="mt-2">The risks associated with this study are minimal and are no greater than those encountered in daily life. You may experience minor fatigue from viewing images and answering questions on a computer screen.</p>
            <p className="mt-2">There are no direct personal benefits to participating in this study. However, the results may contribute to our understanding of human perception and decision-making processes in digital environments.</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Voluntary Participation</h4>
            <p>Your participation in this study is entirely voluntary. You may refuse to participate in this research. Such refusal will not have any negative consequences for you. If you begin to participate in the research, you may at any time, for any reason, discontinue your participation without any negative consequences.</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Purpose of this Study</h4>
            <p>This study aims to understand how the sequence in which images are presented to participants influences their responses and choices. By varying the order of image presentation, we hope to gain insights into cognitive processes and potential biases that may occur during visual information processing in survey contexts.</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Participants to Partake in the Study</h4>
            <p>We anticipate recruiting approximately 200 participants for this study. To participate, you must be at least 18 years old, have normal or corrected-to-normal vision, and be able to read and understand English. There are no other specific eligibility requirements for participation.</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Study Procedures</h4>
            <p>This study requires one session lasting approximately 15-20 minutes and can be completed entirely online from your preferred location. During the study, you will view a series of images presented on your computer screen and answer questions about what you see. The order in which images are shown will be randomized for experimental purposes. Your responses will be collected through an online survey system. The procedures are experimental in nature, designed to test how image presentation order affects responses. No personal records will be accessed or required for this study.</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Risks and Discomforts</h4>
            <p>The risks associated with this study are minimal because the procedures involve only viewing images and answering survey questions, which are similar to everyday activities such as browsing websites or social media. Potential risks include minor eye strain or fatigue from computer screen viewing. There is a minimal risk of breach of confidentiality, though this is minimized by collecting only non-identifiable response data and using secure data storage systems.</p>
            <p className="mt-2">You have the right to skip any questions you do not wish to answer or to discontinue participation at any time without penalty.</p>
            <p className="mt-2">Risk is considered minimal because the study procedures are no more harmful or stressful than activities encountered in daily life, such as using a computer or smartphone.</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Benefits</h4>
            <p>There may not be any personal benefits in participating in this study. However, your participation will contribute to scientific understanding of human perception and decision-making processes, which may ultimately benefit society by improving how visual information is presented in educational, medical, and other important contexts.</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Financial (or other) Considerations</h4>
            <p>There are no financial requirements or benefits in participating in this study. You will not receive any compensation for your participation, nor will you incur any costs. The researchers and Keiser University may benefit academically from the knowledge gained through this research, but there are no financial benefits to the investigators or institution from this study.</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Confidentiality and Protection of Information</h4>
            <p>Your responses will be kept confidential and will be stored securely in encrypted databases. When presenting or publishing the results of this study, no personally identifying information will be included. Data collected will include only your survey responses and the time stamps of your participation. Your name and electronic signature will be stored separately from your survey responses to protect your privacy. All data will be retained for a minimum of three years as required by federal regulations and then securely destroyed.</p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Other considerations and Questions</h4>
            <p>Please feel free to ask any questions about anything that seems unclear to you and to consider this research and consent form carefully before you sign.</p>
            <p className="mt-2">There are no alternative treatments or interventions associated with this study, as it is observational research involving survey responses only.</p>
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
            
            <div className="mt-6 space-y-4 max-w-md">
              <div>
                <Label htmlFor="participantName" className="font-bold">
                  Name (please print):
                </Label>
                <Input
                  id="participantName"
                  type="text"
                  placeholder="Enter your full name"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="participantSignature" className="font-bold">
                  Electronic Signature:
                </Label>
                <Input
                  id="participantSignature"
                  type="text"
                  placeholder="Type your full name as electronic signature"
                  value={participantSignature}
                  onChange={(e) => setParticipantSignature(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label className="font-bold">Date:</Label>
                <p className="text-sm text-gray-600 mt-1">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <p className="mt-6">If you have further questions about this research project, please contact the student investigator, Martha Castillo, at mcastillo@keiseru.edu or the faculty advisor, Dr. Lowry Daniels, at ldaniels@keiseru.edu. If you have questions about your rights as a research participant or if you have a research related complaint, please contact The IRB Chairperson at: (954) 318-1620.</p>
            <p className="mt-4">The participant will be given one copy of this consent form. One copy of this form is to be kept by the investigator for the duration of the study.</p>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-gray-300">
            <div className="flex flex-col space-y-4">
              <Button 
                onClick={handleConsent}
                disabled={isSubmitting || !participantName.trim() || !participantSignature.trim()}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Recording Consent...' : 'I Consent to Participate'}
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
