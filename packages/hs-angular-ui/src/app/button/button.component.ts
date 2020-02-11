import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})

export class ButtonComponent {
  @Output()
  onClick: CallableFunction;

  @Input()
  text: string;

  @Input()
  type: string;
}
