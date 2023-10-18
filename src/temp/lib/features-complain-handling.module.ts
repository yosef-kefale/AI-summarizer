import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from '@erp-fe/ng-zorro-antd';
import { SharedModule } from '@erp-fe/shared';
import { EntityModule } from '@erp-fe/ui/entity';
import { NgxsModule } from '@ngxs/store';
import { QuillModule } from 'ngx-quill';
import { ComplianHandlingApiService } from './api/complain-handling-api.service';
import { ComplainResponseFormComponent } from './components/complain-response-form/complain-response-form.component';
import { ModalFileViewerComponent } from './components/modal-file-viewer/modal-file-viewer.component';
import { ModalRemarkComponent } from './components/modal-remark/modal-remark.component';
import { MessageFormComponent } from './container/message-form/message-form.component';
import { ComplainHandlingFacadeService } from './facades/complain-handling-facade.service';
import { ComplainHandlingRoutingModule } from './features-complain-handling.routing';
import { ComplainBoardDetailComponent } from './pages/complain-board-detail/complain-board-detail.component';
import { ComplainBoardComponent } from './pages/complain-board/complain-board.component';
import { ComplainDetailComponent } from './pages/complain-detail/complain-detail.component';
import { ComplainListComponent } from './pages/complain-list/complain-list.component';
import { EscalatedComponent } from './pages/escalated/escalated.component';
import { ComplainHandlingState } from './store/states/complain-handling.state';
import { InvestigatorAssignmentFormComponent } from './components/investigator-assignment-form/investigator-assignment-form.component';
import { ModalInvestigatorAssignmentComponent } from './components/modal-investigator-assignment/modal-investigator-assignment.component';
import { CollectionSelectorModule } from '@erp-fe/features/collection-selector';
import { ValidationFormComponent } from './components/validation-form/validation-form.component';
import { RecommendationSummaryFormComponent } from './components/recommendation-summary-form/recommendation-summary-form.component';
import { ModalClarificationFormComponent } from './components/modal-clarification-form/modal-clarification-form.component';
import { LetterFormComponent } from './components/letter-form/letter-form.component';

@NgModule({
  imports: [
    CollectionSelectorModule,
    CommonModule,
    NgZorroAntdModule,
    NgxsModule.forFeature([ComplainHandlingState]),
    FormsModule,
    SharedModule,
    QuillModule,
    ReactiveFormsModule,
    CommonModule,
    EntityModule,
    ComplainHandlingRoutingModule
  ],
  exports: [
    ComplainListComponent,
    ComplainResponseFormComponent,
    ModalFileViewerComponent,

    ComplainDetailComponent,
    MessageFormComponent,
    EscalatedComponent,
    ComplainBoardComponent
  ],
  declarations: [
    ComplainListComponent,
    ModalRemarkComponent,
    ComplainResponseFormComponent,
    ModalFileViewerComponent,
    ComplainDetailComponent,
    MessageFormComponent,
    EscalatedComponent,
    ComplainBoardComponent,
    ComplainBoardDetailComponent,
    InvestigatorAssignmentFormComponent,
    ModalInvestigatorAssignmentComponent,
    ValidationFormComponent,
    RecommendationSummaryFormComponent,
    ModalClarificationFormComponent,
    LetterFormComponent
  ],
  providers: [ComplianHandlingApiService, ComplainHandlingFacadeService],
  entryComponents: [ModalFileViewerComponent]
})
export class FeaturesComplainHandlingModule {}
