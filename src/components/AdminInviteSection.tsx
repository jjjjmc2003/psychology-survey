
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserPlus, Copy, Trash2, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createAdminInvitation, getAdminInvitations, revokeAdminInvitation, AdminInvitation } from '@/utils/adminInvitations';

const AdminInviteSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [invitations, setInvitations] = useState<AdminInvitation[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      setLoadingInvitations(true);
      const data = await getAdminInvitations();
      setInvitations(data);
    } catch (error) {
      console.error('Error loading invitations:', error);
      toast({
        title: "Error",
        description: "Failed to load invitations.",
        variant: "destructive",
      });
    } finally {
      setLoadingInvitations(false);
    }
  };

  const handleInviteAdmin = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await createAdminInvitation(email.trim());
      
      if (result.success && result.invitation) {
        toast({
          title: "Invitation Sent",
          description: `Admin invitation created for ${email}`,
        });
        setEmail('');
        await loadInvitations(); // Refresh the list
        
        // Copy invitation token to clipboard
        const inviteUrl = `${window.location.origin}/admin/auth?token=${result.invitation.invitation_token}&email=${encodeURIComponent(email)}`;
        navigator.clipboard.writeText(inviteUrl);
        toast({
          title: "Invite URL Copied",
          description: "The invitation URL has been copied to your clipboard.",
        });
      } else {
        toast({
          title: "Invitation Failed",
          description: result.error || "Failed to create invitation.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating invitation:', error);
      toast({
        title: "Error",
        description: "Failed to create admin invitation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyInviteUrl = (invitation: AdminInvitation) => {
    const inviteUrl = `${window.location.origin}/admin/auth?token=${invitation.invitation_token}&email=${encodeURIComponent(invitation.email)}`;
    navigator.clipboard.writeText(inviteUrl);
    toast({
      title: "Invite URL Copied",
      description: "The invitation URL has been copied to your clipboard.",
    });
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    try {
      const result = await revokeAdminInvitation(invitationId);
      if (result.success) {
        toast({
          title: "Invitation Revoked",
          description: "The invitation has been revoked successfully.",
        });
        await loadInvitations(); // Refresh the list
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to revoke invitation.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error revoking invitation:', error);
      toast({
        title: "Error",
        description: "Failed to revoke invitation.",
        variant: "destructive",
      });
    }
  };

  const getInvitationStatus = (invitation: AdminInvitation) => {
    if (invitation.is_used) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Used</Badge>;
    }
    if (new Date(invitation.expires_at) < new Date()) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Invite New Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email Address
              </label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@psychology.research"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInviteAdmin()}
                disabled={isLoading}
              />
            </div>
            <Button 
              onClick={handleInviteAdmin} 
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? 'Creating...' : 'Create Invitation'}
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Invitations expire after 7 days and can only be used once.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Invitations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingInvitations ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading invitations...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">{invitation.email}</TableCell>
                    <TableCell>{getInvitationStatus(invitation)}</TableCell>
                    <TableCell>{new Date(invitation.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(invitation.expires_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!invitation.is_used && new Date(invitation.expires_at) > new Date() && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyInviteUrl(invitation)}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy URL
                          </Button>
                        )}
                        {!invitation.is_used && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Revoke
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Revoke Invitation</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to revoke this invitation? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRevokeInvitation(invitation.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Revoke
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!loadingInvitations && invitations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No admin invitations yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInviteSection;
