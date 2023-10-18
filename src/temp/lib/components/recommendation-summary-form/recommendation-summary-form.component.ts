import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent, Environment, LoggerService, MessagingService, T, Validation } from '@erp-fe/core';
import { LocalePipe } from '@erp-fe/shared';
import { ReactiveFormConfig, RxwebValidators } from '@rxweb/reactive-form-validators';
import { NzModalRef, NzModalService, environment } from 'ng-zorro-antd';
import { Recommendation } from '../../models/recommendation';
import { Observable } from 'rxjs';
import { Complain } from '../../models/complains';
import { RecommendationActionEnum } from '../../models/recommendationActionEnum';
import { AnyKindOfDictionary, forEach, result } from 'lodash';
import { ModalFileViewerComponent } from '../modal-file-viewer/modal-file-viewer.component';

@Component({
  selector: 'erp-fe-recommendation-summary-form',
  templateUrl: './recommendation-summary-form.component.html'
})
export class RecommendationSummaryFormComponent extends BaseComponent implements OnInit, OnChanges {
  @Output() readonly recommendationFormValues = new EventEmitter<any>();
  @Output() readonly onRecommendationResponseSubmit = new EventEmitter<any>();
  @Input() currentRole: string;
  @Input() secretaryRecommendationSummary$: Observable<any>;
  @Input() selectedSummary$: Observable<any>;
  @Input() complaint: Complain;
  // @Input() letterDetail: any;

  summaryForm: FormGroup;
  summaryAdjustApproveForm: FormGroup;

  blobFile;
  fileList = [];
  objectId;
  objectType;
  adjustOrApprove;
  radioValue = '';
  remark = '';
  recommendationActionTaken: string;
  isEditMode = false;
  isCreateEditMode = true;
  attachmentEndPoint;
  recommendation: any;

  constructor(
    private readonly logger: LoggerService,
    private readonly fb: FormBuilder,
    private readonly modalService: NzModalService,
    private readonly localePipe: LocalePipe,
    private readonly cd: ChangeDetectorRef,
    private readonly notification: MessagingService,
    private readonly http: HttpClient,
    @Inject('environment') private readonly environment: Environment // private readonly modalRef: NzModalRef
  ) {
    super();
    this.attachmentEndPoint = `${environment.urls.api}/complaint/api/recommendations/get-attachment`;
  }

  ngOnInit(): void {
    // this.logger.log('bbbb..', this.objectId);
    this.createForm();
    this.createSummaryAdjustApproveForm();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.selectedSummary$.subscribe((res) => {
      this.recommendation = res;
    });
  }

  createForm(): void {
    ReactiveFormConfig.set({
      validationMessage: {
        required: T('This field is required'),
        minLength: T('minimum length is {{1}} ')
      }
    });

    this.summaryForm = this.fb.group({
      caseReferenceNumber: [undefined, [RxwebValidators.required()]],
      title: [undefined, [RxwebValidators.required()]],
      caseSummary: [undefined, [RxwebValidators.required()]],
      recommendation: [undefined, [RxwebValidators.required()]]
    });
  }
  createSummaryAdjustApproveForm(): void {
    ReactiveFormConfig.set({
      validationMessage: {
        required: T('This field is required'),
        minLength: T('minimum length is {{1}} ')
      }
    });

    this.summaryAdjustApproveForm = this.fb.group({
      remark: [undefined, [RxwebValidators.required()]]
    });
  }

  // onDestroy(): void {
  //   this.modalRef.destroy();
  // }

  onCreate(): void {
    if (this.summaryForm.valid) {
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

      formData.append('caseReferenceNumber', this.summaryForm.value.caseReferenceNumber);
      formData.append('title', this.summaryForm.value.title);
      formData.append('caseSummary', this.summaryForm.value.caseSummary);
      formData.append('recommendationSummary', this.summaryForm.value.recommendation);
      formData.append('complaintId', this.complaint.id);

      formData.forEach((value, key) => {
        console.log(key + ' ' + value);
      });

      const data = {
        form: formData
      };

      // this.recommendationFormValues.emit(data);
      this.summaryForm.reset();
    } else {
      Validation.validateAll(this.summaryForm);
    }
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

  onRecommendationApprove() {
    this.onRecommendationResponseSubmit.emit({ status: this.radioValue, remark: this.remark });
  }

  adustRecommendation() {}
  
  recommendationDataEmit(recommendationActionTakenPassed: string) {
    console.log('enter to data emit', this.complaint.id);
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

    formData.append('caseReferenceNumber', this.summaryForm.value.caseReferenceNumber);
    formData.append('title', this.summaryForm.value.title);
    formData.append('caseSummary', this.summaryForm.value.caseSummary);
    formData.append('recommendationSummary', this.summaryForm.value.recommendation);
    formData.append('complaintId', this.complaint.id);
    formData.forEach((value, key) => {
      console.log(key + ' ' + value);
    });
    const data = {
      form: formData
    };

    const values = {
      data,
      recommendationActionTakenPassed
    };
    this.recommendationFormValues.emit(values);
    this.summaryForm.reset();
    this.isEditMode = false;
  }

  onDraftCreate() {
    if (this.summaryForm.valid) {
      this.recommendationActionTaken = RecommendationActionEnum[0].toString();
      this.recommendationDataEmit(this.recommendationActionTaken);
    } else {
      Validation.validateAll(this.summaryForm);
    }
    this.isEditMode = false;
    // this.isAdjustMode = false;
  }
  onDraftUpdate() {
    if (this.summaryForm.valid) {
      this.recommendationActionTaken = RecommendationActionEnum[1].toString();
      this.recommendationDataEmit(this.recommendationActionTaken);
    } else {
      Validation.validateAll(this.summaryForm);
    }
    this.isEditMode = false;
    // this.isAdjustMode = false;
  }

  onSubmitCreate() {
    if (this.summaryForm.valid) {
      this.recommendationActionTaken = RecommendationActionEnum[2].toString();
      this.recommendationDataEmit(this.recommendationActionTaken);
    } else {
      Validation.validateAll(this.summaryForm);
    }
    this.isEditMode = false;
    // this.isAdjustMode = false;
  }
  onSubmitUpdate() {
    if (this.summaryForm.valid) {
      this.recommendationActionTaken = RecommendationActionEnum[3].toString();
      this.recommendationDataEmit(this.recommendationActionTaken);
    } else {
      Validation.validateAll(this.summaryForm);
    }
    this.isEditMode = false;
    // this.isAdjustMode = false;
  }

  onRecommendationEdit(isEdit: boolean) {
    this.isEditMode = isEdit;

    this.summaryForm.patchValue({
      caseReferenceNumber: this.recommendation.caseReferenceNumber,
      title: this.recommendation.title,
      caseSummary: this.recommendation.caseSummary,
      recommendation: this.recommendation.recommendationSummary
    });
    console.log(`Item at index : ${this.recommendation.attachments}`);
    //extract all attachement for patching
    this.recommendation.attachments.forEach((attachment, index) => {
      console.log(`Item at index ${index}: ${attachment?.file_name}`);
      //this.fileList.push(attachment);
    });
  }

  recommendationStatusDataEmit(recommendationActionTakenPassed: string) {
    // this.selectedSummary$.subscribe((res) => {
    //   this.recommendation = res;
    // });
    const formData = new FormData();
    formData.append('remark', this.summaryAdjustApproveForm.value.remark);
    formData.append('complaintId', this.complaint.id);

    const data = {
      form: formData
    };

    const values = {
      data,
      recommendationActionTakenPassed
    };

    this.onRecommendationResponseSubmit.emit(values);
  }
  onSecretaryRecommendationAdjustStatusUpdate() {
    this.recommendationActionTaken = RecommendationActionEnum[5].toString();
    this.recommendationStatusDataEmit(this.recommendationActionTaken);
  }
  onRecommendationApproveStatusUpdate() {
    this.recommendationActionTaken = RecommendationActionEnum[6].toString();
    this.recommendationStatusDataEmit(this.recommendationActionTaken);
  }

  openFile(file): void {
    this.http.get(`${this.attachmentEndPoint}/${file?.file_path}`, { responseType: 'blob' }).subscribe(
      (data) => {
        this.blobFile = data;

        this.modalService.create({
          nzWidth: '60%',
          nzTitle: file.file_name,
          nzClosable: false,
          nzOkDisabled: true,
          nzMaskClosable: false,
          nzContent: ModalFileViewerComponent,
          nzComponentParams: {
            // tslint:disable-next-line: object-literal-shorthand
            file: this.blobFile,
            fileType: file.file_type
          }
        });
      },
      (error) => {
        this.logger.log(error);
      }
    );
  }
}
