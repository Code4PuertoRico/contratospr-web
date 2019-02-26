import React from 'react';

interface PDFViewerProps {
  src: string;
}

class PDFViewer extends React.Component<PDFViewerProps> {
  render() {
    let fileUrl = `/_api/document?url=${encodeURIComponent(this.props.src)}`;
    let src = `/static/pdfjs/web/viewer.html?file=${encodeURIComponent(
      fileUrl
    )}`;

    return (
      <div>
        <style jsx>{`
          .pdf-viewer-container {
            overflow: hidden;
            padding-top: 100%;
            position: relative;
          }

          .pdf-viewer-container iframe {
            border: 0;
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;
          }
        `}</style>
        <div className="pdf-viewer-container">
          <iframe src={src} frameBorder="0" />
        </div>
      </div>
    );
  }
}

export default PDFViewer;
