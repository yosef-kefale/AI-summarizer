import { Locale } from '@erp-fe/core';

export interface ComplainResponse {
  id?: string;
  compliantId?: string;
  title: string;
  response: string;
  responderId?: string;
  responderFullName?: Locale;
  status?: string;
  timestamp?: Date;
  attachment?: Attachment[];
  isSaveAndSubmit?: boolean;
}

export interface Attachment {
  id: string;
  complaintResponseId: string;
  fileName: string;
  fileType: string;
  path: string;
  timestamp: string;
}
