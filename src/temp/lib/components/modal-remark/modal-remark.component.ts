import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LoggerService } from '@erp-fe/core';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'erp-fe-compliant-modal-remark',
  templateUrl: './modal-remark.component.html',
  styleUrls: ['./modal-remark.component.scss']
})
export class ModalRemarkComponent implements OnInit {
  data;
  constructor(private readonly logger: LoggerService, private readonly _sanitizer: DomSanitizer, private readonly modalRef: NzModalRef) {}

  ngOnInit(): void {}

  onDestroy(): void {
    this.modalRef.destroy();
  }
}
