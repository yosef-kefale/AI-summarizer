import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoggerService, MessagingService, T, Validation } from '@erp-fe/core';
import { LocalePipe } from '@erp-fe/shared';
import { ReactiveFormConfig, RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'erp-fe-message-form',
  templateUrl: './message-form.component.html'
})
export class MessageFormComponent implements OnInit {
  @Input() complainId;
  @Input() receiver;
  @Input() sender;
  @Input() selectedMessage;
  messageForm: FormGroup;
  blobFile;
  fileList = [];
  receivers;
  defaultReceiver = undefined;
  @Output() readonly send = new EventEmitter<any>();
  constructor(
    private readonly logger: LoggerService,
    private readonly fb: FormBuilder,
    private readonly localePipe: LocalePipe,
    private readonly cd: ChangeDetectorRef,
    private readonly http: HttpClient,
    private readonly notification: MessagingService
  ) {}

  ngOnInit(): void {
    this.receiver.length > 1 ? (this.defaultReceiver = undefined) : (this.defaultReceiver = this.receiver[0]);
    this.createForm();
  }

  createForm(): void {
    ReactiveFormConfig.set({
      validationMessage: {
        required: T('This field is required'),
        minLength: T('minimum length is {{1}} ')
      }
    });

    this.messageForm = this.fb.group({
      content: [undefined, [RxwebValidators.required()]],
      receiver: [this.defaultReceiver, [RxwebValidators.required()]]
    });
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

  onCreate(): void {
    if (this.messageForm.valid) {
      const formData = new FormData();
      this.fileList.forEach((file: any) => {
        formData.append(`file`, file);
      });
      if (this.fileList.length === 0) {
        // tslint:disable-next-line:no-null-keyword
        formData.append(`file`, undefined);
      }
      formData.append('content', this.messageForm.value.content);
      formData.append('complaintId', this.complainId);
      formData.append('sender', this.sender);
      formData.append('receiver', this.messageForm.value.receiver);
      if (this.selectedMessage !== undefined) {
        formData.append('messageId', this.selectedMessage.id);
      }
      this.send.emit(formData);
      this.messageForm.reset();
    } else {
      Validation.validateAll(this.messageForm);
    }
  }
  provinceChange(data): void {
    this.receivers = data;
  }
  public trackByFn(index, item): any {
    if (item && item.id) {
      return item.id;
    }

    return index;
  }
}
