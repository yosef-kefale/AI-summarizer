import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormConfig, RxwebValidators } from '@rxweb/reactive-form-validators';
import { Observable } from 'rxjs';
import { LocalePipe } from '@erp-fe/shared';
import { T, Validation } from '@erp-fe/core';
import { Letter } from '../../models/letter';
import { LetterActionEnum } from '../../models/letterActionEnum';

@Component({
  selector: 'erp-fe-letter-form',
  templateUrl: './letter-form.component.html'
})
export class LetterFormComponent implements OnInit {
  @Input() clarificationResponse$: Observable<any>;
  @Input() currentRole: string;
  @Input() letterDetail: any;
  @Output() readonly letterFormValues = new EventEmitter<any>();
  // @Output() readonly letterFormValues = new EventEmitter<{ data: any; isLetterDataExist: boolean }>();
  @Output() readonly onLetterResponseSubmit = new EventEmitter<any>();

  letter: any;
  isCreateEditMode = true;
  isEditMode = false;
  isAdjustMode = false;
  remark = '';
  radioValue = '';
  isLetterDataExistValue: boolean;
  letterActionTaken: string;

  letterForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  ngOnChanges(): void {
    this.letter = this.letterDetail?.items[0];
  }

  createForm(): void {
    ReactiveFormConfig.set({
      validationMessage: {
        required: T('This field is required'),
        minLength: T('minimum length is {{1}} ')
      }
    });

    this.letterForm = this.fb.group({
      title: [undefined, [RxwebValidators.required()]],
      contentBody: [undefined, [RxwebValidators.required()]]
    });
  }

  letterDataEmit(letterActionTakenPassed: string) {
    const data: Letter = {
      title: this.letterForm.value.title,
      description: this.letterForm.value.contentBody
    };
    const values = {
      data,
      letterActionTakenPassed
    };
    // this.letterFormValues.emit(data);
    this.letterFormValues.emit(values);
    console.log('passed status', letterActionTakenPassed);
    this.letterForm.reset();
  }
  // letterDataEmit(status: any, isLetterDataExist: boolean) {
  //   const objectString = JSON.stringify(status);
  //   const extractedString = objectString.substring(1, objectString.length - 1);
  //   const keyValueArray = extractedString.split(':');
  //   const key = keyValueArray[0].trim();
  //   const modifiedKey = key.substring(1, key.length - 1);
  //   const value = keyValueArray[1].trim();
  //   const boolValue = JSON.parse(value.toLowerCase());
  //   const data: Letter = {
  //     title: this.letterForm.value.title,
  //     description: this.letterForm.value.contentBody
  //   };
  //   data[modifiedKey] = boolValue;
  //   const values = {
  //     data,
  //     isLetterDataExist
  //   };
  //   // this.letterFormValues.emit(data);
  //   this.letterFormValues.emit(values);
  //   console.log('values', values);
  //   this.letterForm.reset();
  // }
  // letterDataEmit(saveAndSubmitVlue: boolean, isLetterDataExist: boolean) {
  //   const data: Letter = {
  //     title: this.letterForm.value.title,
  //     description: this.letterForm.value.contentBody,
  //     isSaveAndSubmit: saveAndSubmitVlue
  //   };
  //   const values = {
  //     data,
  //     isLetterDataExist
  //   };
  //   // this.letterFormValues.emit(data);
  //   this.letterFormValues.emit(values);
  //   console.log('letter Data for create:', data);
  //   this.letterForm.reset();
  // }

  // test(status){
  //   const obj = {
  //     ...this.letterDataEmit,
  //     ...this.createForm.value,
  //     status: status
  //   }

  //   const creat = {
  //     ...this.createForm.value.
  //     status: status
  //   }
  // }

  // onDraftCreate() {
  //   let status = {};
  //   if (this.letterForm.valid) {
  //     if (this.letterDetail?.total === 0) {
  //       this.isLetterDataExistValue = false;
  //       status = {
  //         isSaveAndSubmit: false
  //       };
  //       this.letterDataEmit(status, this.isLetterDataExistValue);
  //     }
  //   } else {
  //     Validation.validateAll(this.letterForm);
  //   }
  //   this.isEditMode = false;
  //   this.isAdjustMode = false;
  // }
  onDraftCreate() {
    if (this.letterForm.valid) {
      this.letterActionTaken = LetterActionEnum[0].toString();
      this.letterDataEmit(this.letterActionTaken);
    } else {
      Validation.validateAll(this.letterForm);
    }
    this.isEditMode = false;
    this.isAdjustMode = false;
  }
  onDraftUpdate() {
    if (this.letterForm.valid) {
      this.letterActionTaken = LetterActionEnum[1].toString();
      this.letterDataEmit(this.letterActionTaken);
    } else {
      Validation.validateAll(this.letterForm);
    }
    this.isEditMode = false;
    this.isAdjustMode = false;
  }

  // onSubmitCreate() {
  //   let status = {};
  //   if (this.letterForm.valid) {
  //     if (this.letterDetail?.total === 0) {
  //       this.isLetterDataExistValue = false;
  //       status = {
  //         isSaveAndSubmit: true
  //       };
  //       this.letterDataEmit(status, this.isLetterDataExistValue);
  //     } else {
  //       this.isLetterDataExistValue = true;
  //       status = {
  //         isApproved: false
  //       };
  //       this.letterDataEmit(status, this.isLetterDataExistValue);
  //     }
  //   } else {
  //     Validation.validateAll(this.letterForm);
  //   }
  //   this.isEditMode = false;
  //   this.isAdjustMode = false;
  // }
  onSubmitCreate() {
    if (this.letterForm.valid) {
      this.letterActionTaken = LetterActionEnum[2].toString();
      this.letterDataEmit(this.letterActionTaken);
    } else {
      Validation.validateAll(this.letterForm);
    }
    this.isEditMode = false;
    this.isAdjustMode = false;
  }
  onSubmitUpdate() {
    if (this.letterForm.valid) {
      this.letterActionTaken = LetterActionEnum[3].toString();
      this.letterDataEmit(this.letterActionTaken);
    } else {
      Validation.validateAll(this.letterForm);
    }
    this.isEditMode = false;
    this.isAdjustMode = false;
  }
  // onCreate(buttonValue: string) {
  //   if (this.currentRole === 'complaint-investigator') {
  //     if (this.letterForm.valid) {
  //       if (buttonValue === 'Draft') {
  //         if (this.letterDetail?.total === 0) {
  //           this.letterDataEmit(false);
  //           this.isExistingLetterValues.emit(false);
  //         } else {
  //           this.letterDataEmit(false);
  //           this.isExistingLetterValues.emit(true);
  //         }
  //       } else {
  //         if (this.letterDetail?.total === 0) {
  //           this.letterDataEmit(true);
  //           this.isExistingLetterValues.emit(false);
  //         } else {
  //           this.letterDataEmit(true);
  //           this.isExistingLetterValues.emit(true);
  //         }
  //       }
  //     } else {
  //       Validation.validateAll(this.letterForm);
  //     }
  //   } else {
  //     if (this.letterForm.valid) {
  //       const data: Letter = {
  //         title: this.letterForm.value.title,
  //         remark: this.letterForm.value.remark,
  //         isApproved: false
  //       };
  //       this.letterFormValues.emit(data);
  //       this.letterForm.reset();
  //     } else {
  //       Validation.validateAll(this.letterForm);
  //     }
  //   }
  // }
  letterStatusDataEmit(letterActionTakenPassed: string) {
    const data: Letter = {
      id:this.letterDetail?.items[0].id,
      complaintId:this.letterDetail?.items[0].complaintId,
      remark: this.remark
    };
    const values = {
      data,
      letterActionTakenPassed
    };

    this.onLetterResponseSubmit.emit(values);
  }
  // onLetterStatusUpdate() {
  //   let data: Letter;
  //   this.letterActionTaken = LetterActionEnum[3].toString();
  //   // data = {
  //   //   ...this.letterDetail?.items[0],
  //   //   remark: this.remark
  //   // };
  //   data = {
  //     id:this.letterDetail?.items[0].id,
  //     complaintId:this.letterDetail?.items[0].complaintId,
  //     remark: this.remark
  //   };
  //   this.onLetterResponseSubmit.emit({ data });
  // }
  onLetterAdjustStatusUpdate(){
    this.letterActionTaken = LetterActionEnum[4].toString();
    this.letterStatusDataEmit( this.letterActionTaken);
  }
  onLetterApproveStatusUpdate(){
    this.letterActionTaken = LetterActionEnum[5].toString();
    this.letterStatusDataEmit( this.letterActionTaken);
  }
  onLetterApproveClick(approveType: string) {
    this.onLetterResponseSubmit.emit({ status: approveType, remark: this.remark });
  }

  onLetterAdjustment(isAdjust: boolean) {
    this.isAdjustMode = isAdjust;
    this.letterForm.patchValue({
      title: this.letterDetail?.items[0].title,
      contentBody: this.letterDetail?.items[0].description
    });
  }
  onLetterEdit(isEdit: boolean) {
    this.isEditMode = isEdit;
    this.letterForm.patchValue({
      title: this.letterDetail?.items[0].title,
      contentBody: this.letterDetail?.items[0].description
    });
  }

  saveButtonDisabled() {
    //   let isSaveButtonDisabled = true;
    //   if (this.radioValue === 'Adjust') {
    //     if (this.remark.length > 0) {
    //       isSaveButtonDisabled = false;
    //     } else {
    //       isSaveButtonDisabled = true;
    //     }
    //   } else if (this.radioValue === 'Approve') {
    //     isSaveButtonDisabled = false;
    //   } else {
    //     isSaveButtonDisabled = true;
    //   }
    //   return isSaveButtonDisabled;
    // }
    let isSaveButtonDisabled = true;

    if (this.remark.length > 0) {
      isSaveButtonDisabled = false;
    } else {
      isSaveButtonDisabled = true;
    }
    return isSaveButtonDisabled;
  }
}
