import jsPDF from 'jspdf';
import { LandRecord } from '../types';

export class PDFGenerator {
  static async generateCertificate(record: LandRecord): Promise<void> {
    try {
      // Create PDF directly without HTML conversion
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const formatDate = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      };

      // Set up PDF content
      let yPosition = 20;
      
      // Header
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('BLOCKCHAIN LAND CERTIFICATE', 105, yPosition, { align: 'center' });
      yPosition += 10;
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'normal');
      pdf.text('LandChain Registry', 105, yPosition, { align: 'center' });
      yPosition += 15;
      
      // Registration Number
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Registration No: ${record.registrationNumber}`, 105, yPosition, { align: 'center' });
      yPosition += 20;
      
      // Owner Information
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PROPERTY OWNER', 20, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Name: ${record.ownerName}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Aadhaar Number: ${record.ownerNIC}`, 20, yPosition);
      yPosition += 15;
      
      // Property Details
      pdf.setFont('helvetica', 'bold');
      pdf.text('PROPERTY DETAILS', 20, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Land Size: ${record.landSize} acres`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Property Type: ${record.landType}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`District: ${record.district}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Province: ${record.province}`, 20, yPosition);
      yPosition += 15;
      
      // Address
      pdf.setFont('helvetica', 'bold');
      pdf.text('PROPERTY ADDRESS', 20, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      const addressLines = pdf.splitTextToSize(record.propertyAddress, 170);
      pdf.text(addressLines, 20, yPosition);
      yPosition += addressLines.length * 6 + 10;
      
      // Blockchain Information
      pdf.setFont('helvetica', 'bold');
      pdf.text('BLOCKCHAIN VERIFICATION', 20, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('Transaction Hash:', 20, yPosition);
      yPosition += 5;
      const txHashLines = pdf.splitTextToSize(record.transactionHash, 170);
      pdf.text(txHashLines, 20, yPosition);
      yPosition += txHashLines.length * 4 + 5;
      
      pdf.text('Block Hash:', 20, yPosition);
      yPosition += 5;
      const blockHashLines = pdf.splitTextToSize(record.blockHash, 170);
      pdf.text(blockHashLines, 20, yPosition);
      yPosition += blockHashLines.length * 4 + 5;
      
      pdf.text('Previous Block Hash:', 20, yPosition);
      yPosition += 5;
      const prevHashLines = pdf.splitTextToSize(record.previousHash, 170);
      pdf.text(prevHashLines, 20, yPosition);
      yPosition += prevHashLines.length * 4 + 15;
      
      // Registration Details
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('REGISTRATION DETAILS', 20, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Registration Date: ${formatDate(record.registrationDate)}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Last Verified: ${formatDate(record.lastVerified)}`, 20, yPosition);
      yPosition += 6;
      pdf.text('Status: ✓ Verified on Blockchain', 20, yPosition);
      yPosition += 15;
      
      // GPS Coordinates (if available)
      if (record.coordinates) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('GPS COORDINATES', 20, yPosition);
        yPosition += 8;
        
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Latitude: ${record.coordinates.latitude}°`, 20, yPosition);
        yPosition += 6;
        pdf.text(`Longitude: ${record.coordinates.longitude}°`, 20, yPosition);
        yPosition += 15;
      }
      
      // Footer
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text('This certificate is secured by blockchain technology.', 105, 280, { align: 'center' });
      pdf.text(`Generated on: ${formatDate(new Date())}`, 105, 285, { align: 'center' });

      // Save the PDF
      pdf.save(`LandChain_Certificate_${record.registrationNumber}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF certificate');
    }
  }
}