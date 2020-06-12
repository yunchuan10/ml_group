import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';
export default {
  install(Vue, options) {
    Vue.prototype.getPdf = function() {
      var title = this.htmlTitle || new Date();
      html2Canvas(document.querySelector('#pdfDom'), {
        allowTaint: true
      }).then(canvas => {
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        let pageHeight = (contentWidth / 592.28) * 841.89;
        let leftHeight = contentHeight;
        let position = 0;
        let imgWidth = 595.28;
        let imgHeight = (592.28 / contentWidth) * contentHeight;
        let pageData = canvas.toDataURL('image/jpeg', 1.0);
        let PDF = new JsPDF('', 'pt', 'a4');
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            if (leftHeight > 0) {
              PDF.addPage();
            }
          }
        }
        let file = PDF.output('dataurl').split('base64,');
        let params = {
          fileName: title,
          base64EncodedFile: file[1]
        };

        this.$axiosPost(API.file_uploadBase64EncodedFile, params).then(res => {
          this.pdfUrl = res.url;
        });
        PDF.save(title + '.pdf');
      });
    };
  }
};
