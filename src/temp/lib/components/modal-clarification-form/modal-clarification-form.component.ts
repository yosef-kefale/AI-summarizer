import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent, LoggerService, MessagingService, T, Validation } from '@erp-fe/core';
import { LocalePipe } from '@erp-fe/shared';
import { ReactiveFormConfig, RxwebValidators } from '@rxweb/reactive-form-validators';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Complain } from '../../models/complains';

@Component({
  selector: 'erp-fe-modal-clarification-form',
  templateUrl: './modal-clarification-form.component.html'
})
export class ModalClarificationFormComponent extends BaseComponent implements OnInit {
  claims = [
    { label: 'Dismissal of the Complaint for Review', value: 'Dismissal of the Complaint for Review' },
    { label: 'Any other action', value: 'Other Claim' }
  ];
  selctedClaims: string[] = [];
  otherClaimChecked = false;
  inputValue = '';
  claimFinal?: string;

  currentRole: string;
  compliant: Complain;
  clarificationId: string;

  receiver = [{name:'Supplier', value: 'supplier'}, {name: 'HOPE', value: 'hope'}];

  clarificationForm: FormGroup;
  blobFile;
  fileList = [];
  objectId;
  objectType;
  constructor(
    private readonly logger: LoggerService,
    private readonly fb: FormBuilder,
    private readonly modalService: NzModalService,
    private readonly localePipe: LocalePipe,
    private readonly cd: ChangeDetectorRef,
    private readonly notification: MessagingService,
    private readonly http: HttpClient,
    private readonly modalRef: NzModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.logger.log('bbbb..', this.objectId);
    this.createForm();
    console.log(this.compliant)
  }

  createForm(): void {
    ReactiveFormConfig.set({
      validationMessage: {
        required: T('This field is required'),
        minLength: T('minimum length is {{1}} ')
      }
    });

    this.clarificationForm = this.fb.group({
      caseReferenceNumber: [undefined, [RxwebValidators.required()]],
      title: [undefined, [RxwebValidators.required()]],
      contentBody: [undefined, [RxwebValidators.required()]],
      id: '',
      requestedTo: [undefined, [RxwebValidators.required()]]
    });

    if (this.currentRole !== 'complaint-investigator') {
      this.clarificationForm.controls['requestedTo'].clearValidators();
      this.clarificationForm.updateValueAndValidity();
    }
  }

  onDestroy(): void {
    this.modalRef.destroy();
  }

  onCreate(): void {
    if (this.selctedClaims?.length !== 0) {
      let index = this.selctedClaims.indexOf('Other Claim');
      if (index !== -1) {
        this.selctedClaims[index] = this.inputValue;
      }
      this.claimFinal = this.selctedClaims.join('#');
    }
    if (this.clarificationForm.valid) {
      const formData = new FormData();

      let i = 0;
      this.fileList.forEach((file: any) => {
        formData.append(`files`, file);

        i = i + 1;
      });

      if (this.fileList.length === 0) {
        // tslint:disable-next-line:no-null-keyword
        formData.append(`files`, undefined);
      }

      if (this.currentRole === 'complaint-investigator') {
        formData.append('requestedTo', this.clarificationForm.value.requestedTo);
        formData.append('compliantId', this.compliant.id);
        formData.append('description', this.clarificationForm.value.contentBody);
      } else {
        formData.append('clarificationId', this.clarificationId);
        formData.append('responseDescription', this.clarificationForm.value.contentBody);
      }

      formData.append('title', this.clarificationForm.value.title);
      if(this.claimFinal){
        formData.append('claimRemedies', this.claimFinal);
      }
      formData.append('caseReferenceNumber', this.clarificationForm.value.caseReferenceNumber);
      const data = {
        form: formData
      };
      this.modalRef.destroy(data);
    } else {
      Validation.validateAll(this.clarificationForm);
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.clarificationForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
}

  beforeUpload = (file): boolean => {
    if (
      file.type === 'application/pdf' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === '	image/bmp' ||
      file.type === '	image / gif'
    ) {
      this.fileList = this.fileList.concat(file);
    } else {
      this.notification.error(T('Only Image and PDF files are allowed'));
    }

    return false;
  };

  public trackByFn(index, item): any {
    if (item && item.id) {
      return item.id;
    }

    return index;
  }
  checkboxSelected(value: string[]): void {
    this.otherClaimChecked = value.includes('Other Claim');
    this.selctedClaims = [];
    Array.prototype.push.apply(this.selctedClaims, value);
  }
  checkOtherClaimValidation() {
    let disableSaveButton = true;
    let index = this.selctedClaims.indexOf('Other Claim');
    if (this.clarificationForm.valid) {
      if (index !== -1) {
        if (this.inputValue?.length === 0) {
          disableSaveButton = true;
        } else {
          disableSaveButton = false;
        }
      } else {
        disableSaveButton = false;
      }
    }
    return disableSaveButton;
  }
}
