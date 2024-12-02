import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dossier-timeline',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './dossier-timeline.component.html',
  styleUrl: './dossier-timeline.component.css'
})
export class DossierTimelineComponent {
  constructor(){

  }
  //Status
  start = 'LOD'
 processing = 'LOD'
  finish = 'LOD'


  //Função que muda as outras funções
  header(){
    //Se você quiser obrigar todos os doctypes estarem enviados para mudar as cores basta descomentar esse codigo abaixo
    /*if(forma == null || vehicle_registration == null || invoice == null || complaint_document == null){
      this.start = 'OK'
      this.processing = 'LOD'
      this.manualProcessing = 'LOD'
      this.finish = 'LOD'
      return;
    }*/
    if(this.headerDoctype('forma')){

      if(this.headerDoctype('vehicle_registration')){

        if(this.headerDoctype('invoice')){

          if(this.headerDoctype('complaint_document')){

            this.headerDoctype('ghostDoc')
          }
        }
      }
    }
  }

  //Função que recebe os doctypes presentes e verifica seu status
  headerDoctype(docType: string){
    let localDocType = localStorage.getItem(docType)
    if(localDocType) {
      let doctypeExist = JSON.parse(localDocType)
      if(doctypeExist.id){

        if((doctypeExist.step == 'VALIDATION_MANUAL' || doctypeExist.step == 'COMPLEMENTATION_MANUAL' || doctypeExist.step == 'TIPIFY_MANUAL') && doctypeExist.status == 'ERROR'){
          this.start = 'OK'
          this.processing = 'OK'
          this.finish = 'NOK'
          return false;
        } else if (doctypeExist.step == 'VALIDATION_AUTO' && doctypeExist.status == 'ERROR'){
          this.start = 'OK'
          this.processing = 'NOK'
          this.finish = 'NOK'
          return false;
        } else if(doctypeExist.status == 'ERROR'){
          this.start = 'OK'
          this.processing = 'OK'
          this.finish = 'NOK'
          return false;
        } else if(doctypeExist.status == 'FINISHED'){
          this.start = 'OK'
          this.processing = 'OK'
          this.finish = 'OK'
          return true;
        } else if (doctypeExist.status == 'IDLE'){
          this.start = 'OK'
          this.processing = 'NOK'
          this.finish = 'NOK'
          return false;
        }
      }
    }
    return true;
  }

  //função que muda os estillos das balls e das arrows
  headerStatus(type: string, status: string){
    if(type == 'ball'){
      if(status == 'start'){
        switch(this.start){
          case 'OK':
            return this.ballOK;
          case 'NOK':
            return this.ballNOK;
          case 'LOD':
            return this.ballLOD;
        }
      }
      if(status == 'processing'){
        switch(this.processing){
          case 'OK':
            return this.ballOK;
          case 'NOK':
            return this.ballNOK;
          case 'LOD':
            return this.ballLOD;
        }
      }
      if(status == 'finish'){
        switch(this.finish){
          case 'OK':
            return this.ballOK;
          case 'NOK':
            return this.ballNOK;
          case 'LOD':
            return this.ballLOD;
        }
      }
    } else if(type == 'arrow'){
      if(status == 'start'){
        switch(this.start){
          case 'OK':
            return this.arrowOK;
          case 'NOK':
            return this.arrowNOK;
          case 'LOD':
            return this.arrowLOD;
        }
      }
      if(status == 'processing'){
        switch(this.processing){
          case 'OK':
            return this.arrowOK;
          case 'NOK':
            return this.arrowNOK;
          case 'LOD':
            return this.arrowLOD;
        }
      }
      if(status == 'finish'){
        switch(this.finish){
          case 'OK':
            return this.arrowOK;
          case 'NOK':
            return this.arrowNOK;
          case 'LOD':
            return this.arrowLOD;
        }
      }
    }
    return this.ballNOK
  }

  ballNOK = {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    width: "50px",
    height: "50px",
    padding: "10px",
    borderRadius: "100%",
    border: "10px solid",
    borderColor: "rgb(217, 34, 49)",
  }
  ballOK = {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    width: "50px",
    height: "50px",
    padding: "10px",
    borderRadius: "100%",
    border: "10px solid",
    borderColor: "rgb(39, 128, 14)",
  }

  ballLOD = {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    width: "50px",
    height: "50px",
    padding: "10px",
    borderRadius: "100%",
    border: "10px solid",
    borderColor: "rgb(115, 115, 115)",
  }
  arrowNOK = {
    width: "50px",
    height: "10px",
    backgroundColor: "rgb(217, 34, 49)",
  }
  arrowOK = {
    width: "50px",
    height: "10px",
    backgroundColor: "rgb(39, 128, 14)",
  }

  arrowLOD = {
    width: "50px",
    height: "10px",
    backgroundColor: "rgb(115, 115, 115)",
  }
}
