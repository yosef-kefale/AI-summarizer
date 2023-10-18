import { Locale } from '@erp-fe/core';

export interface Complain {
  id?: string;
  name?: Locale;
  title: Locale;
  description?: Locale;
  objectId?: string;
  objectType?: string;
  requesterId?: string;
  requesterFullName?: Locale;
  contentBody?: any;
  status?: string;
  isSaveAndSubmit?: boolean;
  timestamp?: Date;
  attachments?: Attachment[];
  investigator?: any[];
  trackers?: any;
  escalations?: any;
  escalationStatus?: any;
  parentComplaintId?: string;
  compliantResponseConsents: [];
  claim?: string;
}

export interface Attachment {
  id: string;
  complaintId: string;
  file_name: string;
  file_type: string;
  path: string;
  timestamp: string;
  file_path: string;
}
