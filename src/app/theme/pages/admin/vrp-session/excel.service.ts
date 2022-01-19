import { data } from 'jquery';
import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as logoFile from './tmlogo';
import { DatePipe } from '@angular/common';
import { IBVars } from './vrp-session-vars';
import { POST_Service } from '../../../api/post.service';
@Injectable()
export class ExcelService {

  constructor(private datePipe: DatePipe, private _POST_api_Service: POST_Service) {

  }
  data2: any = {};
  getVrpListByDate = IBVars.getVrpListByDate;
  
  async generateExcel(data,fname) {


    // const ExcelJS = await import('exceljs');
   //console.log(this.data2);
    const data3 = data;
    // const Workbook: any = {};

  // Excel Title, Header, Data
    const title = 'CESSATION OF EMPLOYEMENT';
    const subTitle = 'Form Update Data';
    const header = ['Bil', 'LOB', 'Pernr', 'Name', 'New IC/Passport', 'Employee Subgroup','Sub Area', 'Action', 'Action Reason', 'Effective Date','Hold Income (Yes / No)', 'Effective Month (Hold Income)', 'Offer Letter Ref No'];

    // Create workbook and worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Cessation & Retirement');


// Add Row and formatting
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);

    const subTitleRow = worksheet.addRow(['','','','','','','',subTitle,'','','','','']);
    subTitleRow.font = { name: 'Calibri', size: 12, underline: 'single', bold: false };
    const titleRow = worksheet.addRow(['','','','','','','',title,'','','','','']);
    titleRow.font = { name: 'Calibri', size: 12, underline: 'single', bold: true };

    worksheet.addRow([]);
    //const subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')]);
    

// Add Image
    const logo = workbook.addImage({
  base64: logoFile.logoBase64,
  extension: 'png',
});


    //worksheet.mergeCells('A1:D2');


// Blank Row
    worksheet.addRow([]);

// Add Header Row
    const headerRow = worksheet.addRow(header);


// Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF16365C' },
    bgColor: { argb: 'FF0000FF' }
  };
  cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

  cell.font = {color: {argb: "FFFFFFFF"}, name: 'Calibri', size: 9, bold: true};
});

// Add Data and Conditional Formatting
  data3.forEach(d => {

  const row = worksheet.addRow([d.count,d.lob, d.pernr,d.name, d.newIC, d.empsgroup, d.sub_area, d.action, 
    d.action_reason, this.reformatDate(this.datePipe.transform(d.effective_date, 'yyyy-MM-dd')), d.hold_income, d.effective_month,d.ref_no]);

  console.log(d);
    row.eachCell((cell, number) => {

      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    
      cell.font = {color: {argb: "FF000000"}, name: 'Calibri', size: 9, bold: false};
    });

  });


    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 15;
    //worksheet.getColumn(7).width = 20;
    //worksheet.getColumn(8).width = 20;
    //worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 15;
    worksheet.getColumn(12).width = 15;
    worksheet.getColumn(13).width = 30;
    worksheet.addRow([]);

    worksheet.addImage(logo, 'G2:I5');

// Footer Row
    // const footerRow = worksheet.addRow(['This is system generated excel sheet.']);
//     footerRow.getCell(1).fill = {
//   type: 'pattern',
//   pattern: 'solid',
//   fgColor: { argb: 'FFCCFFE5' }
// };
//     footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

// Merge Cells
    // worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);


// Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data: any) => {
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  fs.saveAs(blob, fname);
});
   
}

  reformatDate(dateStr)
{
  let dArr = dateStr.split("-");  // ex input "2010-01-18"
  return dArr[2]+ "." +dArr[1]+ "." +dArr[0].substring(2); //ex out: "18/01/10"
}

}
