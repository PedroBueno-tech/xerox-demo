import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FileModalComponent } from './modal/file-modal/file-modal.component';
import { FormsModule } from '@angular/forms';
import { ResultModalComponent } from './modal/result-modal/result-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HttpClientModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {



  constructor(private dialog: MatDialog, private http: HttpClient) {}

  private apiUrl = 'https://www-portal.dev.alphaxerox.com.br/';

  data: any;

  username: string = "xcorp";
  password: string = "Xerox123";
  accessToken: string = ''
  loginData:any= {username: "xcorp", password: "Xerox123"}

  //status
  statusFormAB: string = 'PENDING';
  statusVehicleRegs: string = 'PENDING';
  statusInvoice: string = 'PENDING';
  statusComplaintDoc: string = 'PENDING';

  //If it was sended
  sendStatusFormAB: boolean = false;
  sendStatusVehicleRegs: boolean = false;
  sendStatusInvoice: boolean = false;
  sendStatusComplaintDoc: boolean = false;

  //If modal is open

  ngOnInit(): void {
    this.login(this.loginData)

    if(typeof window !== 'undefined'){
      let last: any = ''
      last = localStorage.getItem('lastDossier')
      this.dossierText = last
      localStorage.clear()
    }
  }
  //abrir modal do file - e função que o modal roda ao enviar arquivos
  openModalFile(name: String, doctype:String) {
    const dialogRef = this.dialog.open(FileModalComponent, {
      width: '405px', // Configuração do tamanho do modal
      panelClass: 'modal-file',
      data: { message: name, doctype: doctype} // Dados opcionais para passar para o modal
    });
    dialogRef.afterClosed().subscribe(result => {
      this.wasFileSend()
    })
  }
  wasFileSend(){
    localStorage.getItem('forma')                ? this.sendStatusFormAB = true       : this.sendStatusFormAB = false;
    localStorage.getItem('vehicle_registration') ? this.sendStatusVehicleRegs = true  : this.sendStatusVehicleRegs = false;
    localStorage.getItem('invoice')              ? this.sendStatusInvoice = true      : this.sendStatusInvoice = false;
    localStorage.getItem('complaint_document')   ? this.sendStatusComplaintDoc = true : this.sendStatusComplaintDoc = false;
  }

  openModalResult(name: String) {
    this.dialog.open(ResultModalComponent, {
      width: '600px', // Configuração do tamanho do modal
      panelClass: 'modal-result',
      data: { message: name} // Dados opcionais para passar para o modal

    });
  }


  login(credentials: { username: string; password: string }) {
    const headers = new HttpHeaders({
      'x-tenant': 'xerox',
    });

    return this.http.post<{ accessToken: string }>(this.apiUrl + "auth-service/login", credentials, {headers}).subscribe((response) => {
      this.accessToken = response.accessToken;
    })
  }

  dossierText: string = '';

  findDossier(){
    this.statusFormAB = 'PENDING';
    this.statusVehicleRegs = 'PENDING';
    this.statusInvoice = 'PENDING';
    this.statusComplaintDoc = 'PENDING';
    localStorage.clear()
    const headers = new HttpHeaders({
      'x-tenant': 'xerox',
      'Authorization': "Bearer " + this.accessToken,
    });
    let dossierList: any
    let foundDossierId: number;
    let foundedDossier: any;
    if(this.dossierText == null){
      alert('Dossier field empty')
      return;
    }
    alert('searching')
    this.http.get(this.apiUrl + "doctype-service/v1/jobdossiers?size=200", {headers}).subscribe({
      next: (response: any) => {
        dossierList = response

        if (Array.isArray(dossierList._embedded.JobDossiers)) {
          dossierList._embedded.JobDossiers.forEach((item: any) => {

            if(item.dossier == this.dossierText){

              foundDossierId = item.id;
            }
          });
        }
        if(!foundDossierId){
          this.wasFileSend()
          alert('No dossier found')
          return;
        }

        this.http.get(this.apiUrl + "doctype-service/v1/jobdossiers/" + foundDossierId, {headers}).subscribe(
          (response: any) => {
            foundedDossier = response
            if (Array.isArray(foundedDossier.documentTypes)) {
              foundedDossier.documentTypes.forEach((item: any) =>{
                console.log(item)
                let tempStatus = item.status;

                if(item.step == "COMPLEMENTATION_MANUAL" && item.status == "ERROR"){
                  item.status = "REJECTED"

                } else if(item.step == "TIPIFY_MANUAL" && item.status == "ERROR"){
                  item.status = 'REJECTED'

                } else if(item.step == "VALIDATION_MANUAL" && item.status == "ERROR"){
                  item.status = 'REJECTED'

                } else if(item.step == "VALIDATION_AUTO" && item.status == "ERROR"){
                  item.status = 'REJECTED'

                } else if(item.status == "ERROR"){
                  item.status = 'PROCESSING'

                } else if (item.status == "FINISHED"){
                  item.status = 'APPROVED'
                }

                if(item.code == 'forma' || item.code=='formb') {
                  this.statusFormAB = item.status;
                  item.status = tempStatus;
                  localStorage.setItem('forma', JSON.stringify(item))
                }
                if(item.code == 'invoice'){
                  this.statusInvoice = item.status;
                  item.status = tempStatus;
                  localStorage.setItem('invoice', JSON.stringify(item))
                }
                if(item.code == 'vehicle_registration'){
                  this.statusVehicleRegs = item.status;
                  item.status = tempStatus;
                  localStorage.setItem('vehicle_registration', JSON.stringify(item))
                }
                if(item.code == 'complaint_document'){
                  this.statusComplaintDoc = item.status;
                  item.status = tempStatus;
                  localStorage.setItem('complaint_document', JSON.stringify(item))
                }
              });
            }
            this.wasFileSend()
            alert('Searching completed')
          }
        )
        localStorage.setItem('lastDossier', this.dossierText)
      }
    });
  }

  sendInfo(){
    if(this.dossierText == null || this.dossierText == undefined || this.dossierText == ''){
      alert('Empty dossier')
      return
    }
    alert('submit started')
    let forma = localStorage.getItem('forma')
    let vehicle_registration = localStorage.getItem('vehicle_registration')
    let invoice = localStorage.getItem('invoice')
    let complaint_document = localStorage.getItem('complaint_document')
    console.log(forma)
    let JSONtoSend = {
      dossier: this.dossierText,
      files: [] as any[]
    }
    if(forma){
      JSONtoSend.files = JSONtoSend.files.concat(JSON.parse(forma))
    }
    if(vehicle_registration){
      JSONtoSend.files = JSONtoSend.files.concat(JSON.parse(vehicle_registration))
    }
    if(invoice){
      JSONtoSend.files = JSONtoSend.files.concat(JSON.parse(invoice))
    }
    if(complaint_document){
      JSONtoSend.files = JSONtoSend.files.concat(JSON.parse(complaint_document))
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-tenant': 'xerox',
      'Authorization': "Bearer " + this.accessToken,

    });
    if(forma == null && vehicle_registration == null && invoice == null && complaint_document == null){
      alert('No Document to send')
      return;
    }
    this.http.post('https://www-portal.dev.alphaxerox.com.br/dip-service/insertPackage', JSONtoSend, {headers}).subscribe((response) => {
      localStorage.clear()
      localStorage.setItem('lastDossier', this.dossierText)
      location.reload()
      alert('Submit completed')
    })

  }

}
