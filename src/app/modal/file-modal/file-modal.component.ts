import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-file-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './file-modal.component.html',
  styleUrl: './file-modal.component.css'
})
export class FileModalComponent {
  constructor(
    public dialogRef: MatDialogRef<FileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  base64String: string | null = null; // Para armazenar o resultado em Base64
  inputFileName: string =  '';
  fileToStore:any = []

  closeModal() {
    this.dialogRef.close(); // Fecha o modal
  }
  setFile(){
    localStorage.setItem(this.data.doctype, JSON.stringify(this.fileToStore))
    this.closeModal()
  }



  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      console.error("Nenhum arquivo selecionado");
      return;
    }

    const file = input.files[0]; // O primeiro arquivo selecionado
    this.inputFileName = file.name
    console.log(file.name)
    const reader = new FileReader();

    // Evento de sucesso quando o arquivo for carregado
    reader.onload = () => {
      const base64WithPrefix = reader.result as string;
      const base64WithoutPrefix = base64WithPrefix.replace(/^data:.*;base64,/, ''); // Remove qualquer prefixo
      this.base64String = base64WithoutPrefix; // Armazena a string Base64

      this.fileToStore.push({
        key: this.inputFileName,
        base64: this.base64String
      });
    };

    // Evento de erro
    reader.onerror = (error) => {
      console.error("Erro ao ler o arquivo:", error);
    };

    // Inicia a leitura do arquivo como Base64
    reader.readAsDataURL(file);

  }
}
