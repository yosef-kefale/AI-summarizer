import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'erp-fe-validation-form',
  templateUrl: './validation-form.component.html',
  styleUrls: ['./validation-form.component.scss']
})
export class ValidationFormComponent implements OnInit {
  radioValue = 'Accept';
  rejectionReasons = [
    { label: 'Complaint lodged against Public Enterprise.', value: 'Complaint lodged against Public Enterprise.' },
    {
      label: 'Complaint lodged against procurement proceedings which have already been approved by the World Bank.',
      value: 'Complaint lodged against procurement proceedings which have already been approved by the World Bank.'
    },
    {
      label: 'Complaint lodged against Regional States and Addis Ababa and Dire Dawa city administrations.',
      value: 'Complaint lodged against Regional States and Addis Ababa and Dire Dawa city administrations.'
    },
    { label: 'Others... ', value: 'Other Reasons' }
  ];
  selctedRejectionReasons: string[] = [];
  otherReasonsChecked = false;
  inputValue?: string;
  enableSaveButton = true;
  rejectionReasonFinal?:string;

  @Output() readonly validationFormValues = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}
  checkboxSelected(value: string[]): void {
    this.otherReasonsChecked = value.includes('Other Reasons');
    this.selctedRejectionReasons = [];
    Array.prototype.push.apply(this.selctedRejectionReasons, value);
    this.selctedRejectionReasons = value;
    console.log(this.selctedRejectionReasons);
    console.log(value);
    console.log(this.otherReasonsChecked);
  }
  radioSelected(event: any) {
    if (event === 'Accept') {
      this.otherReasonsChecked = false;
      this.selctedRejectionReasons = [];
    }
  }
  validateForm() {
      if (this.selctedRejectionReasons?.length > 0) {
        if (this.otherReasonsChecked) {
          if (this.inputValue?.length > 0){
            this.enableSaveButton = true;
          } else{
            this.enableSaveButton = false;
          }
        }else{
          this.enableSaveButton = true;
        }
      } else {
        this.enableSaveButton = false;
      }

    return !this.enableSaveButton;
  }

  onSubmit() {
    console.log(this.selctedRejectionReasons);
    const data={
      reason: null,
      status:''
    }

    let index = this.selctedRejectionReasons.indexOf('Other Reasons');
    if (index !== -1) {
      this.selctedRejectionReasons[index] = this.inputValue;
    }
    this.rejectionReasonFinal=this.selctedRejectionReasons.join("#");
    console.log(this.rejectionReasonFinal);

    data.status ="Rejected";
    data.reason = this.rejectionReasonFinal;
    this.validationFormValues.emit(data);

    // if (this.radioValue === 'Accept') {
    //   //Update complaint status to underReview
    //   data.status="Accepted";
    //   this.validationFormValues.emit(data);
    // }else{
    //   //Post complaint response (concat rejection reason as contentBody and status rejected)
    //   data.status ="Rejected";
    //   data.reason = this.rejectionReasonFinal;
    //   this.validationFormValues.emit(data);
    // }
  }

}
