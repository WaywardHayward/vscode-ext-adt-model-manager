

export default function dtmiToFileName(dtmi:string){
  return dtmi.replace(/:/g, '.').replace(/\;/g, '.v');
}