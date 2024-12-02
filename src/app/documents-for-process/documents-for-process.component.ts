import { Component } from '@angular/core';
import { DocumentsForProcessService } from './documents-for-process.service';

@Component({
  selector: 'documents-for-process',
  standalone: true,
  imports: [],
  providers: [DocumentsForProcessService],
  templateUrl: './documents-for-process.component.html',
  styleUrl: './documents-for-process.component.css'
})
export class DocumentsForProcessComponent {

}
