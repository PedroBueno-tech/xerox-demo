import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-result-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './result-modal.component.html',
  styleUrl: './result-modal.component.css'
})
export class ResultModalComponent implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<ResultModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  allData:any;
  attShow: string = 'Show';
  attributesUl: boolean = false;
  auditUl: boolean = false;
  logsUl: boolean = false;

  ngOnInit(): void {
    if(typeof window !== 'undefined'){
      this.allData = localStorage.getItem(this.data.message)
      console.log(this.allData)
      this.allData = JSON.parse(this.allData)
      console.log(this.allData)
    }
  }

  showAudit(){
    this.auditUl? this.auditUl = false: this.auditUl = true
  }
  showLogs(){
    this.logsUl? this.logsUl = false: this.logsUl = true
  }
  showAttributes(){
    this.attributesUl? this.attributesUl = false: this.attributesUl = true
  }

  closeModal() {
    this.dialogRef.close(); // Fecha o modal
  }


}
