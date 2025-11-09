import { Injectable } from "@nestjs/common";
import { OrganizationResponseDto } from "src/organization/organization.dto";
import { SingleTransactionResponseDto } from "src/transaction/transaction.dto";
import * as PDFDocument from 'pdfkit';
import { PartnerResponseDto } from "src/partner/partner.dto";
import Decimal from "decimal.js";
import { ToWords } from "to-words";
import { TransactionType } from "src/transaction/transaction.enum";

@Injectable()

export class PdfService {
    async generateTransactionPdf(transactionData: SingleTransactionResponseDto, organization: OrganizationResponseDto, partner: PartnerResponseDto): Promise<Buffer> {
        const doc = new PDFDocument({ margin: 40, font: 'Times-Roman' });

        const { name, address, gstNumber, bankDetails } = organization;
        const organizationAddressString1 = `${address.line1}, ${address.line2 || ""}`;
        const organizationAddressString2 = `${address.city}, ${address.state} - PIN: ${address.pin}`;
        const partnerAddressString1 = `${partner.address.line1}, ${partner.address.line2 || ""}, ${partner.address.city}`;

        const { amount } = transactionData;

        let billToPartnerDetailsHeader, shipToPartnerDetailsHeader;
        if (transactionData.transactionType === TransactionType.PURCHASE) {
            billToPartnerDetailsHeader = 'Details of Reciever / Billed to';
            shipToPartnerDetailsHeader = 'Details of Consignee Shipped to';
        } else {
            billToPartnerDetailsHeader = 'Bill to Party';
            shipToPartnerDetailsHeader = 'Ship to Party';
        } 


        doc.fillColor('black').fontSize(10).text(`GST no: ${gstNumber}`, { align: 'right' });
        doc.fontSize(23).text(name, { align: 'center' });
        doc.fontSize(12)
            .text(organizationAddressString1, { align: 'center' })
            .text(organizationAddressString2, { align: 'center' })
            .moveDown();

        const igst = (amount * transactionData.gstPercentage) / 100;
        const totalAfterTax = new Decimal(amount).plus(igst).toNumber();

        const columnWidths = [60, 60, 60, 60, 60, 60, 60, 60]; // 8 columns
        const tableWidth = columnWidths.reduce((sum, w) => sum + w, 0);
        const pageWidth = doc.page.width;
        const x = (pageWidth - tableWidth) / 2;

        const toWords = new ToWords();

        doc.table({
            position: { x: x, y: doc.y },
            data: [
                [
                    { text: `GST Invoice - ${transactionData.transactionType}`, colSpan: 8, align: 'center', font: { size: 18 } }
                ],
                [
                    { text: `Invoice No : ${"123"}`, colSpan: 4, font: { size: 11 } },
                    { text: `Transport Mode : `, colSpan: 4, font: { size: 11 } }
                ],
                [
                    { text: `Invoice Date : ${new Date().toLocaleDateString()}`, colSpan: 4, font: { size: 11 } },
                    { text: `Vehicle Number : `, colSpan: 4, font: { size: 11 } }
                ],
                [
                    { text: '', colSpan: 8 }
                ],
                [
                    { text: billToPartnerDetailsHeader, colSpan: 4, font: { size: 11 } },
                    { text: shipToPartnerDetailsHeader, colSpan: 4, font: { size: 11 } }
                ],
                [
                    { text: `Name: ${partner.name}`, colSpan: 4, font: { size: 11 } },
                    { text: `Name: ${partner.name}`, colSpan: 4, font: { size: 11 } }
                ],
                [
                    { text: `Address: ${partnerAddressString1}`, colSpan: 4, font: { size: 11 } },
                    { text: `Address: ${partnerAddressString1}`, colSpan: 4, font: { size: 11 } }
                ],
                [
                    { text: `GSTIN: ${partner.gstNumber}`, colSpan: 4, font: { size: 11 } },
                    { text: `GSTIN: ${partner.gstNumber}`, colSpan: 4, font: { size: 11 } }
                ],
                [
                    { text: `State: ${partner.address.state}`, colSpan: 2, font: { size: 11 } },
                    { text: `PIN: ${partner.address.pin}`, colSpan: 2, font: { size: 11 } },
                    { text: `State: ${partner.address.state}`, colSpan: 2, font: { size: 11 } },
                    { text: `PIN: ${partner.address.pin}`, colSpan: 2, font: { size: 11 } },
                ],
                [
                    { text: '', colSpan: 8 }
                ],
                [
                    { text: "Product Description", rowSpan: 2, font: { size: 11 } },
                    { text: "HSN Code", rowSpan: 2, font: { size: 11 } },
                    { text: "Quantity", rowSpan: 2, font: { size: 11 } },
                    { text: "Rate", rowSpan: 2, font: { size: 11 } },
                    { text: "IGST", colSpan: 2, font: { size: 11 } },
                    { text: "Total", colSpan: 2, font: { size: 11 } }
                ],
                [
                    { text: "Rate", font: { size: 11 } },
                    { text: "Amount", font: { size: 11 } },
                    { text: "Before Tax", font: { size: 11 }},
                    { text: "After Tax", font: { size: 11 } }
                ],
                [
                    { text: "Arecanut", font: { size: 11 } },
                    { text: "       ", font: { size: 11 } },
                    { text: transactionData.quantity.count.toString() + " Kilogram", font: { size: 11 } },
                    { text: transactionData.rate.toString(), font: { size: 11 } },
                    { text: `${transactionData.gstPercentage}%`, font: { size: 11 } },
                    { text: igst.toString(), font: { size: 11 } },
                    { text: amount.toString(), font: { size: 11 } },
                    { text: totalAfterTax.toString(), font: { size: 11 } }
                ],
                [
                    { text: "Total", colSpan: 5, font: { size: 11 } },
                    { text: igst.toString(), font: { size: 11 } },
                    { text: amount.toString(), font: { size: 11 } },
                    { text: totalAfterTax.toString(), font: { size: 11 } },
                ],
                [
                    { text: "Total Amount in Words", colSpan: 5, font: { size: 11 } },
                    { text: `${toWords.convert(totalAfterTax)} Rupees Only` , colSpan: 3, font: { size: 11 } }
                ],
                [
                    { text: `Bank Details (${name})`, colSpan: 3, font: { size: 11 } },
                    { text: `${name} (Authorised Signatory)`, colSpan: 5, rowSpan: 3, align: { x: 'center', y: 'top' }, font: { size: 11 } }
                ],
                [
                    { text: `Account Number: ${bankDetails.accountNumber}`, colSpan: 3, font: { size: 11 } },
                ],
                [
                    { text: `IFSC Code: ${bankDetails.ifscCode}`, colSpan: 3, font: { size: 11 } },
                ]
            ],
            rowStyles: (rowIndex: number) => {
                let style: { align?: {x, y}; } = {};
                switch (rowIndex) {
                    case 1:
                    case 2:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 16:
                    case 17:
                        style.align = { x: "left", y: "center" };
                        break;
                    default:
                        style.align = { x: "center", y: "center" };
                }
                return style;
            }
        });

        doc.end();
        return new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', (err) => reject(err));
        });
    }
}