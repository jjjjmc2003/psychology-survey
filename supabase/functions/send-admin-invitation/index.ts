
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminInvitationEmailRequest {
  email: string;
  invitationToken: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, invitationToken }: AdminInvitationEmailRequest = await req.json();

    console.log('Sending admin invitation email to:', email);

    // Use the app URL for the signup page
    const siteUrl = "https://survey-switcheroo-magic.lovable.app";
    const signupUrl = `${siteUrl}/admin/auth`;

    const emailResponse = await resend.emails.send({
      from: "Psychology Research <onboarding@resend.dev>",
      to: [email],
      subject: "Admin Invitation - Psychology Research Dashboard",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Admin Invitation</h1>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #495057; margin-top: 0;">You've been invited to be an admin</h2>
            <p style="color: #6c757d; line-height: 1.6;">
              You have been invited to join the Psychology Research Dashboard as an administrator.
              To accept your invitation, please follow these steps:
            </p>
            <ol style="color: #6c757d; line-height: 1.6;">
              <li>Click the link below to go to the signup page</li>
              <li>Enter your email: <strong>${email}</strong></li>
              <li>Copy and paste your invitation token (shown below)</li>
              <li>Complete the registration form</li>
            </ol>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${signupUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Go to Signup Page
              </a>
            </div>
            
            <div style="background-color: #ffffff; border: 2px solid #007bff; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <h3 style="color: #007bff; margin-top: 0;">Your Invitation Token</h3>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 18px; font-weight: bold; color: #333; letter-spacing: 1px; word-break: break-all;">
                ${invitationToken}
              </div>
              <p style="color: #6c757d; font-size: 14px; margin-bottom: 0;">
                Copy this token exactly as shown above
              </p>
            </div>
            
            <p style="color: #dc3545; font-size: 14px; margin-top: 20px;">
              ⚠️ This invitation will expire in 7 days and can only be used once.
            </p>
          </div>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; font-size: 12px;">
              If you didn't expect this invitation, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Admin invitation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-admin-invitation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
