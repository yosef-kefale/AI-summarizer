export interface Letter {
  id?:string;
  complaintId?: string;
  title?: string;
  description?: Locale;
  remark?: string;
  status?: string;
}
