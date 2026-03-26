import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-stack',
    templateUrl: './stack.component.html',
    styleUrls: ['./stack.component.scss'],
    standalone: false
})
export class StackComponent {
    @Input() stack!: string[];
}
