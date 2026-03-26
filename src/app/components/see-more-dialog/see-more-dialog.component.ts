import { Component, Input } from '@angular/core';
import { IDetailsDialog } from 'src/app/interfaces/DetailsDialog.interface';

@Component({
    selector: 'app-see-more-dialog',
    templateUrl: './see-more-dialog.component.html',
    styleUrls: ['./see-more-dialog.component.scss'],
    standalone: false
})
export class SeeMoreDialogComponent {
    @Input() content!: IDetailsDialog;
    @Input() buttonLabel: string = 'En savoir plus +';
}
