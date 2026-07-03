const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    // Remove crossOrigin for data URLs as it can block loading in some browsers
    if (!url.startsWith('data:')) {
      image.setAttribute("crossOrigin", "anonymous"); 
    }
    image.src = url;
  });

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  fileName: string = "cropped.jpg"
): Promise<File | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  // set canvas size to match the bounding box
  canvas.width = image.width;
  canvas.height = image.height;

  // draw image to canvas
  ctx.drawImage(image, 0, 0);

  // Ensure values are strict 32-bit integers (Canvas API requires longs)
  const pixelX = pixelCrop.x | 0;
  const pixelY = pixelCrop.y | 0;
  const pixelWidth = Math.max(1, pixelCrop.width | 0);
  const pixelHeight = Math.max(1, pixelCrop.height | 0);

  // extracted cropped image
  const data = ctx.getImageData(
    pixelX,
    pixelY,
    pixelWidth,
    pixelHeight
  );

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelWidth;
  canvas.height = pixelHeight;

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  // As a blob
  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(new File([file], fileName, { type: "image/jpeg" }));
      } else {
        resolve(null);
      }
    }, "image/jpeg", 0.9);
  });
}
