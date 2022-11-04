import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TodoService } from './../services/todo.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public addForm: FormGroup;

  public todo: any[] = [];

  public loading = false;

  constructor(
    private fb: FormBuilder,
    private _todoService: TodoService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.addForm = this.fb.group({
      name: [null, [Validators.required]],
    });

    this.getTodo();
  }

  getTodo() {
    this._todoService.item$.subscribe(res => this.todo = res);
  }

  async submit() {
    if (!this.isFormValid()) return;

    this.loading = true;
    
    const data = {
      name: this.addForm.value.name,
    }

    try {
      const result = await this._todoService.update(data);
      this.toastr.success('Task Created', 'Congratulation!!!');
      this.addForm.reset();
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.toastr.error('Something went wrong', 'OOPS!!!');
    }
    
  }

  isFormValid() {
    this.addForm.markAllAsTouched();

    return this.addForm.valid;
  }

  async presentToast(message: string, color: string) {
   
  }

  exportExcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, 'skugal.xlsx');
  }

  exportPdf() {
    let PDF = new jsPDF('p', 'mm', 'a4');
    PDF.table(0, 0, this.todo, [], {printHeaders: true, fontSize: 24, headerBackgroundColor: '#eeeeee'});
    PDF.save('skugal.pdf');
  }

  ngOnDestroy(): void {
  }

}
