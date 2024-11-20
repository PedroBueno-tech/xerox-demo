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
  showAttributes: any;
  attDiv: boolean = false

  ngOnInit(): void {
    if(typeof window !== 'undefined'){
      this.allData = localStorage.getItem(this.data.message)
      console.log(this.allData)
      this.allData = JSON.parse(this.allData)
      console.log(this.allData)
    }
  }

  attShowDiv(){
    this.attShow == 'Show'? this.attShow = 'Hide': this.attShow = 'Show';
    if(this.attShow == 'Show'){
      this.attDiv = true;
    } else {
      this.attDiv = false;
    }
  }

  closeModal() {
    this.dialogRef.close(); // Fecha o modal
  }


}
