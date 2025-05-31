import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-preview-invoice',
  templateUrl: './preview-invoice.component.html',
  styleUrls: ['./preview-invoice.component.scss']
})
export class PreviewInvoiceComponent {
  loading = false;
  id: any = '0';
  type = 'invoice';
  mainList: any = {};

  constructor(
    private route: ActivatedRoute,
    private apiService: APIService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const typeParam = this.route.snapshot.paramMap.get('type');
    if (idParam) {
      this.id = atob(idParam!);
      this.type = atob(typeParam!);
      this.fetchData(this.id);
    }
  }

  fetchData(id: string) {
    const req = { p_id: id, p_type: this.type };
    this.loading = true;
    this.apiService.GetPreview(req).subscribe((data: any) => {
      if (data.length > 0) {
        this.mainList.main = data[0][0];
        this.mainList.detail = data[1];
      }
      this.loading = false;
    });
  }

  numberToWordsCurrency(num: any, currency: any) {
    return this.commonService.numberToWordsCurrency(num, currency);
  }

printInvoice() {
  const printContents = document.querySelector('.print-area')?.innerHTML;
  const originalContents = document.body.innerHTML;

  if (printContents) {
    setTimeout(() => {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }, 500); // Allow rendering time
  }
}


  downloadPDF() {
  const DATA: any = document.querySelector('.print-area');
  if (!DATA) return;

  this.loading = true; // optional loading state during PDF creation

  html2canvas(DATA, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');

    // Create jsPDF instance with landscape A4 size (adjust as needed)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate image dimensions to maintain aspect ratio
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    // If image height is more than page height, add pages accordingly
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`${this.type}_${this.mainList.main?.ref_no || 'invoice'}.pdf`);
    this.loading = false;
  }).catch(error => {
    console.error('Error generating PDF:', error);
    this.loading = false;
  });
}

}
