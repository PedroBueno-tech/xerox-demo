import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FileModalComponent } from './modal/file-modal/file-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  private apiUrl = 'https://www-portal.dev.alphaxerox.com.br/';

  data: any;

  username: string = "sergio.almagro";
  password: string = "Xerox123";
  accessToken: string = ''
  loginData:any= {username: "sergio.almagro", password: "Xerox123"}

  //status
  statusFormAB: string = 'PENDING';
  statusVehicleRegs: string = 'PENDING';
  statusInvoice: string = 'PENDING';
  statusComplaintDoc: string = 'PENDING';



  ngOnInit(): void {
    this.login(this.loginData)

  }
  //abrir modal do file
  openModal(name: String, doctype:String) {
    this.dialog.open(FileModalComponent, {
      width: '400px', // Configuração do tamanho do modal
      data: { message: name, doctype: doctype} // Dados opcionais para passar para o modal

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
    const headers = new HttpHeaders({
      'x-tenant': 'xerox',
      'Authorization': "Bearer " + this.accessToken,
    });
    let dossierList: any
    let foundDossierId: number;
    let foundedDossier: any;
    this.http.get(this.apiUrl + "doctype-service/v1/jobdossiers?size=200", {headers}).subscribe({
      next: (response: any) => {
        dossierList = response

        if (Array.isArray(dossierList._embedded.JobDossiers)) {
          dossierList._embedded.JobDossiers.forEach((item: any) => {

            if(item.dossier == this.dossierText){
              foundDossierId = item.id;

              this.http.get(this.apiUrl + "doctype-service/v1/jobdossiers/" + foundDossierId, {headers}).subscribe(
                (response: any) => {
                  foundedDossier = response
                  if (Array.isArray(foundedDossier.documentTypes)) {
                    foundedDossier.documentTypes.forEach((item: any) =>{
                      console.log(item)

                      if(item.step == "COMPLEMENTATION_MANUAL" && item.status == "ERROR"){
                        item.status = "REJECTED"
                      } else if(item.step == "TIPIFY_MANUAL" && item.status == "ERROR"){
                        item.status = 'REJECTED'
                      } else if(item.status == "ERROR"){
                        item.status = 'PROCESSING'
                      } else if (item.status == "FINISHED"){
                        item.status = 'APPROVED'
                      }

                      if(item.code == 'forma' || item.code=='formb') {
                        this.statusFormAB = item.status;
                      }
                      if(item.code == 'invoice'){
                        this.statusInvoice = item.status;
                      }
                      if(item.code == 'vehicle_registration'){
                        this.statusVehicleRegs = item.status;
                      }
                      if(item.code == 'complaint_document'){
                        this.statusComplaintDoc = item.status;
                      }
                    });
                  }
                }
              )
            }
          });
        }
      }
    });
  }
  sendInfo(){
    if(this.dossierText == null || this.dossierText == undefined || this.dossierText == ''){
      alert('Empty dossier')
      return
    }
    let forma = localStorage.getItem('forma')

    let vehicle_registration = localStorage.getItem('vehicle_registration')
    let invoice = localStorage.getItem('invoice')
    let complaint_document = localStorage.getItem('complaint_document')
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
    this.http.post('https://www-portal.dev.alphaxerox.com.br/dip-service/insertPackage', JSONtoSend, {headers}).subscribe((response) => {
      console.log(response)
    })
    console.log(JSONtoSend)
  }

}
