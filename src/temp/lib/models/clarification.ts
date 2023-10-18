import { Attachment } from "./complains";

export interface ClarificationRequest {
  compliantId?: string;
  title?: string;
  caseReferenceNumber?: string;
  requestedTo?: string;
  attachments?: Attachment[];
  description?: Locale;
}
export interface ClarificationResponse {
  compliantId?: string;
  title: string;
  caseReferenceNumber?: string;
  attachments?: Attachment[];
  description?: Locale;
  claimRemedies?:string;
  // requestedTo?: string;
}
