import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-stack',
    templateUrl: './stack.component.html',
    styleUrls: ['./stack.component.scss'],
})
export class StackComponent {
    @Input() stack!: string[];
}
