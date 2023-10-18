import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationState, BaseComponent, CollectionQuery, LoggerService } from '@erp-fe/core';
import { Store } from '@ngxs/store';
import { interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ComplainHandlingFacadeService } from '../../facades/complain-handling-facade.service';

@Component({
  selector: 'erp-fe-escalated',
  templateUrl: './escalated.component.html'
})
export class EscalatedComponent extends BaseComponent implements OnInit {
  @Input() complain;
  @Input() escalatedItem;
  @Input() escalatedDetailLoading;
  @Input() sender;
  @Input() receiver;
  messages$ = this.facade.messages$;
  messagesLoading$ = this.facade.messagesLoading$;
  currentRole;
  escalatedIComplainResponse$ = this.facade.complainResponse$;
  escalatedComplainResponse$ = this.facade.escalatedItemResponse$;
  escalatedComplainResponseLoading$ = this.facade.escalatedResponseDetailLoading$;
  subscription: Subscription;
  source = interval(10000);
  condition = 'live';
  constructor(
    private readonly logger: LoggerService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly facade: ComplainHandlingFacadeService,
    private readonly store: Store
  ) {
    super();
    this.subscription = this.source.pipe(takeUntil(this.ngUnsubscribe)).subscribe((val) => {
      if (this.condition === 'live') {
        this.listMessage();
      }
    });
  }

  ngOnInit(): void {
    this.store
      .select(ApplicationState.currentRole)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        this.currentRole = user.key;
        if (this.currentRole === 'head-of-procuring-entity') {
          this.sender = 'HOPE';
          this.receiver = ['Board', 'PTT', 'PUH'];
        }
      });
    this.facade.getComplainEscalatedResponse(this.complain.id);
    this.facade.getResponse(this.escalatedItem.id);
    this.listMessage();
  }
  listMessage(): void {
    const request: CollectionQuery = {
      top: 10,
      skip: 0,
      filter: [
        [
          {
            field: 'receiver',
            value: 'HOPE',
            operator: '='
          },
          {
            field: 'sender',
            value: 'HOPE',
            operator: '='
          },
          {
            field: 'receiver',
            value: 'PTT',
            operator: '='
          },
          {
            field: 'sender',
            value: 'PTT',
            operator: '='
          },
          {
            field: 'receiver',
            value: 'PUH',
            operator: '='
          },
          {
            field: 'sender',
            value: 'PUH',
            operator: '='
          }
        ]
      ]
    };
    this.facade.listMessage(this.escalatedItem.id, request);
  }
  onSend(data): void {
    this.facade.sendMessage(data);
  }
  public trackByFn(index, item): any {
    if (item && item.id) {
      return item.id;
    }

    return index;
  }
  splitStringWithNewLine(originalString:any): string {
    const splitArray = originalString.split('#');
    const formattedStrings = splitArray.map(substring =>'<pre>' + '  > ' + substring + '</pre>');
    const stringWithNewLine = formattedStrings.join('\n');
    return stringWithNewLine;
  }
}
