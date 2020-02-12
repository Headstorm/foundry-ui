import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button
      class="button-container {{type}}"
      (click)="onClick()"
    >
      <span>{{text}}</span>
    </button>
  `,
  styleUrls: ['./button.component.scss']
})

export class ButtonComponent {
  @Input()
  onClick: CallableFunction;

  @Input()
  text: string;

  @Input()
  type: string;
}
