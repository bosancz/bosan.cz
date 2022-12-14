// @ts-ignore
import ImageTool from './bundle.js';

export const Image = {
  class: ImageTool,
  config: {
    uploader: {
      uploadByFile(file: any) {
        const r = toDataURL(file);
        console.log("uploadByFile", r);
        return r;
      },
      uploadByUrl(url: string) { }
    }
  }
};
function toDataURL(file: File) {
  const r = new Promise<{ success: boolean, file: { url: string; }; }>((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = (event) => resolve({ success: true, file: { url: <string>event.target!.result } });
    reader.readAsDataURL(file);
  });
  console.log("toDataURL", r);
  return r;
}
