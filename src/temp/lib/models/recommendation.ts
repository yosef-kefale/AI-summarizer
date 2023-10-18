import { Attachment } from "./complains";

export interface Recommendation {
  id?:string;
  ComplaintId?: string;
  caseReferenceNumber?: string;
  title: string;
  caseSummary?: Locale;
  recommendation?: Locale;
  attachments?: Attachment[];
  status?: string;
  remark?: string;
}
