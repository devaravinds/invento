import { Injectable } from "@nestjs/common";
import { OrganizationResponseDto } from "src/organization/organization.dto";
import { SingleTransactionResponseDto } from "src/transaction/transaction.dto";
import * as PDFDocument from 'pdfkit';
import { PartnerResponseDto } from "src/partner/partner.dto";
import Decimal from "decimal.js";
import { ToWords } from "to-words";

@Injectable()

export class PdfService {
    async generateTransactionPdf(transactionData: SingleTransactionResponseDto, organization: OrganizationResponseDto, partner: PartnerResponseDto): Promise<Buffer> {
        const doc = new PDFDocument({ margin: 40 });

        const { name } = organization;
        const { amount } = transactionData;

        doc.rect(0, 0, doc.page.width, doc.page.height)
            .fill('#9370DB'); // Use any color you want

        // doc.fillColor('black')
        //     .fontSize(25)
        //     .text('Hello PDFKit!', 100, 100);
        doc.fillColor('black').fontSize(10).text('GST no: 12345', { align: 'right' });
        doc.fontSize(23).text(name, { align: 'center' });
        doc.fontSize(12)
            .text('Old Sabeena Road, Alamkode, CHANGARAMKULAM', { align: 'center' })
            .text('P.O. Alamkode, Malappuram Dt., Pin: 679585', { align: 'center' })
            .moveDown();

        const igst = (amount * 5) / 100;
        const totalAfterTax = new Decimal(amount).plus(igst).toNumber();

        const columnWidths = [60, 60, 60, 60, 60, 60, 60, 60]; // 8 columns
        const tableWidth = columnWidths.reduce((sum, w) => sum + w, 0);
        const pageWidth = doc.page.width;
        const x = (pageWidth - tableWidth) / 2;

        doc.table({
            position: { x: x, y: doc.y },
            data: [
                [
                    { text: 'GST Invoice', colSpan: 8, align: 'center', font: { size: 18 } }
                ],
                [
                    { text: `Invoice No : ${"123"}`, colSpan: 4 },
                    { text: `Transport Mode : ${"Road"}`, colSpan: 4 }
                ],
                [
                    { text: `Invoice Date : ${"01/01/2025"}`, colSpan: 4 },
                    { text: `Vehicle Number : ${"KL-10-AB-1234"}`, colSpan: 4 }
                ],
                [
                    { colSpan: 8 }
                ],
                [
                    { text: "Bill to Party", colSpan: 4 },
                    { text: "Ship to Party", colSpan: 4 }
                ],
                [
                    { text: `Name: ${partner.name}`, colSpan: 4 },
                    { text: `Name: ${partner.name}`, colSpan: 4 }
                ],
                [
                    { text: `Address: ${"sample address"}`, colSpan: 4 },
                    { text: `Address: ${"sample address"}`, colSpan: 4 }
                ],
                [
                    { text: `GSTIN: ${"sample gstin"}`, colSpan: 4 },
                    { text: `GSTIN: ${"sample gstin"}`, colSpan: 4 }
                ],
                [
                    { text: `State: ${"sample state"}`, colSpan: 2 },
                    { text: `PIN: ${"sample PIN"}`, colSpan: 2 },
                    { text: `State: ${"sample state"}`, colSpan: 2 },
                    { text: `PIN: ${"sample PIN"}`, colSpan: 2 }
                ],
                [
                    { colSpan: 8 }
                ],
                [
                    { text: "Product Description", rowSpan: 2 },
                    { text: "Quantity", rowSpan: 2 },
                    { text: "Unit", rowSpan: 2 },
                    { text: "Rate", rowSpan: 2 },
                    { text: "IGST", colSpan: 2 },
                    { text: "Total", colSpan: 2 }
                ],
                [
                    { text: "Rate" },
                    { text: "Amount" },
                    { text: "Before Tax"},
                    { text: "After Tax" }
                ],
                [
                    { text: "Arecanut" },
                    { text: transactionData.quantity.count.toString() },
                    { text: "Kilogram" },
                    { text: transactionData.rate.toString() },
                    { text: "5%" },
                    { text: igst.toString() },
                    { text: amount.toString() },
                    { text: totalAfterTax.toString() }
                ],
                [
                    { text: "Total", colSpan: 6 },
                    { text: amount.toString() },
                    { text: totalAfterTax.toString() },
                ]
            ],
            columnStyles: (columnIndex: number) => {
                let style: { width?: number; fontSize?: number; font?: string } = {};

                switch (columnIndex) {
                    case 1:
                        style.width = 60;
                        style.fontSize = 12;
                        style.font = 'Helvetica-Bold';
                        break;
                    default:
                        style.width = 60;
                        style.fontSize = 10;
                        style.font = undefined;
                        break;
                }

                return style;
            },
            defaultStyle: {
                align: 'center',
                            
            }
            // rowStyles: (rowIndex: number) => {
            //     let style: { height?: number } = {};
            //     style.height = 25;
            //     return style;
            // }
        });

        // Totals
        doc.moveDown();
        doc.text(`Total Before Tax: ₹${amount}`, { align: 'right' });
        doc.text(`IGST: ₹${igst}`, { align: 'right' });
        doc.text(`Total After Tax: ₹${totalAfterTax}`, { align: 'right' });
        doc.moveDown();

        const toWords = new ToWords();
        doc.text(`Amount in words: ${toWords.convert(totalAfterTax)}`, { align: 'left' });
        doc.moveDown(2);

        // Footer
        doc.text(name, { align: 'right' });
        doc.text('(Authorised Signatory)', { align: 'right' });

        doc.end();
        return new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', (err) => reject(err));
        });
    }
}