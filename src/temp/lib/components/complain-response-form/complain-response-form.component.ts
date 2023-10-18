import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ApplicationState,
  BaseComponent,
  editMode,
  Environment,
  FormLocale,
  LoggerService,
  MessagingService,
  T,
  Validation
} from '@erp-fe/core';
import { Store } from '@ngxs/store';
import { ReactiveFormConfig, RxwebValidators } from '@rxweb/reactive-form-validators';
import { NzModalService, NzUploadFile } from 'ng-zorro-antd';
import { takeUntil } from 'rxjs/operators';
import { ModalFileViewerComponent } from '../../components/modal-file-viewer/modal-file-viewer.component';

@Component({
  selector: 'erp-fe-complain-response-form',
  templateUrl: './complain-response-form.component.html',
  styleUrls: ['./complain-response-form.component.scss']
})
export class ComplainResponseFormComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() locale;
  @Input() members;
  @Input() languages;
  @Input() editMode: editMode = 'detail';
  fileList: NzUploadFile[] = [];
  @Input() compliantResponse;
  @Input() compliant;
  currentRole;
  @Input() updating = false;
  @Output() readonly createResponse = new EventEmitter<any>();
  @Output() readonly updateResponse = new EventEmitter<any>();
  compliantResponseForm: FormGroup;
  hasRequiredLocale = false;
  hasOptionalLocale = false;
  showOptionalLocale = false;
  isCollapsed = false;
  compliantHandlingRootEndpoint;
  attachmentEndPoint;
  blobFile;
  constructor(
    @Inject('environment') public readonly environment: Environment,
    private readonly logger: LoggerService,
    private readonly fb: FormBuilder,
    private readonly modalService: NzModalService,
    private readonly notification: MessagingService,
    private readonly http: HttpClient,
    private readonly store: Store
  ) {
    super();
    this.compliantHandlingRootEndpoint = {
      getAttachment: `${environment.urls.api}/complaint-response/api/get-attachment`,
      getComplainAttachment: `${environment.urls.api}/complaint/api/get-attachment`
    };
    this.attachmentEndPoint = this.compliantHandlingRootEndpoint.getAttachment;
  }

  ngOnInit(): void {
    this.createForm();
    this.store
      .select(ApplicationState.currentRole)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        this.currentRole = user.key;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.createForm();
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    if (changes.locale) {
      // call the form builder function

      this.hasRequiredLocale = FormLocale.hasRequired(this.locale);
      this.hasOptionalLocale = FormLocale.hasOptional(this.locale);
    }

    /**
     * If the user is in detail mode and previous data is available, patch it into the form
     */
    this.compliantResponseForm.reset();
    if (this.compliantResponse && this.compliantResponse.id) {
      this.compliantResponseForm.patchValue(this.compliantResponse);
    }
  }

  createForm(): void {
    ReactiveFormConfig.set({
      validationMessage: {
        required: T('This field is required'),
        minLength: T('minimum length is {{1}} ')
      }
    });

    /**
     * Create the form
     */
    this.compliantResponseForm = this.fb.group({
      response: [undefined, [RxwebValidators.required()]],
      title: [undefined, [RxwebValidators.required()]]
    });
  }
  onCreate(status: boolean): void {
    if (this.compliantResponseForm.valid) {
      const formData = new FormData();
      let i = 0;

      this.fileList.forEach((file: any) => {
        formData.append(`file`, file);

        i = i + 1;
      });

      if (this.fileList.length === 0) {
        // tslint:disable-next-line:no-null-keyword
        formData.append(`file`, undefined);
      }

      formData.append('response', this.compliantResponseForm.value.response);
      formData.append('title', this.compliantResponseForm.value.title);
      formData.append('isSaveAndSubmit', status.toString());
      formData.append('compliantId', this.compliant.id);
      const data = {
        form: formData,
        members: this.members
      };

      this.createResponse.emit(data);
      this.fileList = [];
    }
    // else, validate all and show the errors
    else {
      Validation.validateAll(this.compliantResponseForm);
    }
  }
  onUpdate(status: boolean): void {
    if (this.compliantResponseForm.valid) {
      const formData = new FormData();
      let i = 0;

      // tslint:disable-next-line: no-identical-functions
      this.fileList.forEach((file: any) => {
        formData.append(`file`, file);

        i = i + 1;
      });

      if (this.fileList.length === 0) {
        // tslint:disable-next-line:no-null-keyword
        formData.append(`file`, undefined);
      }

      formData.append('response', this.compliantResponseForm.value.response);
      formData.append('title', this.compliantResponseForm.value.title);
      formData.append('isSaveAndSubmit', status.toString());
      formData.append('compliantId', this.compliant.id);
      console.log(formData)
      const data = {
        type: status.toString(),
        form: formData,
        members: this.members
      };
      this.updateResponse.emit(data);
      this.fileList = [];
    }
    // else, validate all and show the errors
    else {
      Validation.validateAll(this.compliantResponseForm);
    }
  }

  beforeUpload = (file: NzUploadFile): boolean => {
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

  openFile(file): void {
    this.http.get(`${this.attachmentEndPoint}/${file.path}`, { responseType: 'blob' }).subscribe(
      (data) => {
        this.blobFile = data;

        this.modalService.create({
          nzWidth: '60%',
          nzTitle: file.fileName,
          nzClosable: false,
          nzOkDisabled: true,
          nzContent: ModalFileViewerComponent,
          nzComponentParams: {
            file: data,
            fileType: file.fileType
          }
        });
      },
      (error) => {
        this.logger.log(error);
      }
    );
  }

  public trackByFn(index, item): any {
    if (item && item.id) {
      return item.id;
    }

    return index;
  }
}
