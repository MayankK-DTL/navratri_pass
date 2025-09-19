import React, { useRef, useEffect, useState } from "react";

function App() {
  const canvasTemplate = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const canvasImg = canvasTemplate.current;
    if (!canvasImg) return;
    
    const context = canvasImg.getContext("2d");
    const template = new Image();
    const qrCode = new Image();

    let loadedImageCount = 0;

    const onImageLoad = () => {
      loadedImageCount++;
      if (loadedImageCount === 2) {
          canvasImg.width = template.width;
          canvasImg.height = template.height;

          context.drawImage(template, 0, 0, canvasImg.width, canvasImg.height);

          const qrSize = 423;
          const qrX = 1272;
          const qrY = 74;
          
          context.drawImage(qrCode, qrX, qrY, qrSize, qrSize);

          setIsLoading(false);
      }
    };

    template.onload = onImageLoad;
    qrCode.onload = onImageLoad;

    // Set CORS to anonymous for external images
    template.crossOrigin = "anonymous";
    qrCode.crossOrigin = "anonymous";

    template.src = "https://d270hb9rabtrcg.cloudfront.net/Qr_Template/1757916654744_6_10_54_48599.png";
    qrCode.src = "https://d270hb9rabtrcg.cloudfront.net/Qr_Code/c4628ad0a3b29009e14e328e428417df.png";
  }, []);

  const handleDownload = () => {
    if (!canvasTemplate.current) return;
      const link = document.createElement("a");
      link.download = "qr_template_final.png";
      link.href = canvasTemplate.current.toDataURL("image/png");
      link.click();
  };

  const handleCopy = async () => {
    if (!canvasTemplate.current) return;
    
      canvasTemplate.current.toBlob(async (blob) => {
        if (!blob) return;
        
        if (navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
          ]);
          alert("Image copied to clipboard!");
        } else {
          alert("Clipboard not supported. Please use download instead.");
        }
      }, "image/png");
  };

  const handleShare = async () => {
    if (!canvasTemplate.current) return;

    canvasTemplate.current.toBlob(async (blob) => {
      console.log('blob', blob)
      if (!blob) return;

      const file = new File([blob], "qr_template_final.png", {
        type: "image/png",
      });

      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare) {
        const shareData = { files: [file] };
        
        if (navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
            console.log("Image shared successfully");
            return;
          } catch (error) {
            if (error.name !== 'AbortError') {
              console.error("Sharing failed:", error);
            }
          }
        }
      }

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Mobile WhatsApp sharing
        const whatsappURL = `whatsapp://send?text=${encodeURIComponent("Check out my QR code!")}`;
        window.open(whatsappURL, '_blank');
      } else {
        // Desktop: Open WhatsApp Web
        const whatsappWebURL = `https://web.whatsapp.com/send?text=${encodeURIComponent("Check out my QR code! Download the image to share it.")}`;
        window.open(whatsappWebURL, '_blank');
      }
    }, "image/png");
  };


  return (
    <main className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col items-center">
          
          <h1 className="text-3xl font-bold text-gray-800 text-center">Your Generated Pass</h1>

          <canvas
            ref={canvasTemplate}
            className="w-full max-w-2xl rounded-md border"
          />

          {!isLoading && (
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={handleCopy}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg hover:scale-101 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M20 10.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 0 0-3 0M23.5 4A4.5 4.5 0 0 1 28 8.5v13a4.5 4.5 0 0 1-4.5 4.5h-13A4.5 4.5 0 0 1 6 21.5v-13A4.5 4.5 0 0 1 10.5 4zM27 8.5A3.5 3.5 0 0 0 23.5 5h-13A3.5 3.5 0 0 0 7 8.5v13c0 .786.26 1.512.697 2.096l8.101-8.101a1.7 1.7 0 0 1 2.404 0l8.101 8.101c.438-.584.697-1.31.697-2.096zm-1.404 15.803l-8.101-8.1a.7.7 0 0 0-.99 0l-8.101 8.1c.584.438 1.31.697 2.096.697h13c.786 0 1.512-.26 2.096-.697M23.33 28c-.773.625-1.757 1-2.829 1h-10A7.5 7.5 0 0 1 3 21.5v-10c0-1.072.375-2.056 1-2.829V21.5a6.5 6.5 0 0 0 6.5 6.5z" /></svg>
                Copy Image
              </button>
              <button
                onClick={handleDownload}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:scale-101 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"><path d="M6.286 19C3.919 19 2 17.104 2 14.765s1.919-4.236 4.286-4.236q.427.001.83.08m7.265-2.582a5.8 5.8 0 0 1 1.905-.321c.654 0 1.283.109 1.87.309m-11.04 2.594a5.6 5.6 0 0 1-.354-1.962C6.762 5.528 9.32 3 12.476 3c2.94 0 5.361 2.194 5.68 5.015m-11.04 2.594a4.3 4.3 0 0 1 1.55.634m9.49-3.228C20.392 8.78 22 10.881 22 13.353c0 2.707-1.927 4.97-4.5 5.52" opacity="0.5" /><path stroke-linejoin="round" d="M12 22v-6m0 6l2-2m-2 2l-2-2" /></g></svg>
                Download
              </button>
              
              <button
                onClick={handleShare}
                className="bg-[#dc4c5b] hover:bg-[#ae1d1d] text-white font-bold py-3 px-6 rounded-lg hover:scale-101 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M19.59 12L15 7.41v2.46l-.86.13c-4.31.61-7.23 2.87-8.9 6.33c2.32-1.64 5.2-2.43 8.76-2.43h1v2.69m-2-1.69v.02c-4.47.21-7.67 1.82-10 5.08c1-5 4-10 11-11V5l7 7l-7 7v-4.1c-.33 0-.66.01-1 .02Z" /></svg>
                Share
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;