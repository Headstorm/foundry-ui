import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
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
