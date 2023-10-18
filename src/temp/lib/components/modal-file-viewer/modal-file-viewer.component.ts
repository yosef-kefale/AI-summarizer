import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LoggerService } from '@erp-fe/core';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'erp-fe-compliant-modal-file-viewer',
  templateUrl: './modal-file-viewer.component.html',
  styleUrls: ['./modal-file-viewer.component.scss']
})
export class ModalFileViewerComponent implements OnInit {
  @Input() file;
  @Input() fileType = '';
  convertedBase64File: any = undefined;
  sanitizedBase64File: any = undefined;

  constructor(private readonly logger: LoggerService, private readonly _sanitizer: DomSanitizer, private readonly modalRef: NzModalRef) {}

  ngOnInit(): void {
    const reader = new FileReader();

    reader.readAsDataURL(this.file);
    reader.onloadend = () => {
      const base64data = reader.result;

      // convert the file to base 64
      this.convertedBase64File = base64data;

      // sanitize the file URL in order for the browser to mark it as "Safe source"
      this.sanitizedBase64File = this._sanitizer.bypassSecurityTrustResourceUrl(this.convertedBase64File);
    };
  }

  onDestroy(): void {
    this.modalRef.destroy();
  }
}
