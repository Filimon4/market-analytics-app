export interface EmailProvider {
  sendInvitation(data: InvitationEmailData): Promise<void>;
}

export interface InvitationEmailData {
  to: string;
  inviterName: string;
  projectName: string;
  inviteLink: string;
  message?: string;
}
