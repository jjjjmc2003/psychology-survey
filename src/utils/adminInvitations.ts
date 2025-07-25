
import { supabase } from '@/integrations/supabase/client';

export interface AdminInvitation {
  id: string;
  email: string;
  invitation_token: string;
  created_by: string | null;
  created_at: string;
  expires_at: string;
  used_at: string | null;
  is_used: boolean;
}

// Create a new admin invitation
export const createAdminInvitation = async (email: string): Promise<{ success: boolean; invitation?: AdminInvitation; error?: string }> => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Invalid email format' };
    }

    // Check if invitation already exists for this email
    const { data: existingInvitation, error: checkError } = await supabase
      .from('admin_invitations')
      .select('*')
      .eq('email', email)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
      throw checkError;
    }

    if (existingInvitation) {
      return { success: false, error: 'Active invitation already exists for this email' };
    }

    // Create new invitation
    const { data, error } = await supabase
      .from('admin_invitations')
      .insert({
        email,
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Send invitation email automatically
    try {
      const { error: emailError } = await supabase.functions.invoke('send-admin-invitation', {
        body: {
          email,
          invitationToken: data.invitation_token
        }
      });

      if (emailError) {
        console.error('Failed to send invitation email:', emailError);
        // Don't fail the invitation creation if email fails, just log it
      } else {
        console.log('Invitation email sent successfully to:', email);
      }
    } catch (emailError) {
      console.error('Error sending invitation email:', emailError);
      // Don't fail the invitation creation if email fails
    }


    return { success: true, invitation: data };
  } catch (error: any) {
    console.error('Error creating admin invitation:', error);
    return { success: false, error: error.message || 'Failed to create invitation' };
  }
};

// Get all admin invitations (for admin management)
export const getAdminInvitations = async (): Promise<AdminInvitation[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_invitations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching admin invitations:', error);
    return [];
  }
};

// Revoke an admin invitation
export const revokeAdminInvitation = async (invitationId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('admin_invitations')
      .update({ 
        is_used: true, 
        used_at: new Date().toISOString() 
      })
      .eq('id', invitationId);

    if (error) {
      throw error;
    }


    return { success: true };
  } catch (error: any) {
    console.error('Error revoking admin invitation:', error);
    return { success: false, error: error.message || 'Failed to revoke invitation' };
  }
};

// Check if user has admin privileges
export const checkAdminPrivileges = async (): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role, is_verified_admin')
      .eq('id', user.user.id)
      .single();

    if (error) {
      console.error('Error checking admin privileges:', error);
      return false;
    }

    return profile?.role === 'admin' && profile?.is_verified_admin && true;
  } catch (error) {
    console.error('Error checking admin privileges:', error);
    return false;
  }
};
