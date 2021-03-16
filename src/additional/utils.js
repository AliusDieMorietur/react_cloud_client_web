
export const findPlace = (departureFolder, currentPath) => {
  if (currentPath.indexOf('/') === -1) return departureFolder;
  const dirs = currentPath.split('/');
  let childs = departureFolder;

  for (const folder of dirs) 
    for (const item of childs) 
      if (item.name === folder) childs = item.childs;
  return childs;
} 

export const downloadFile = (name, dataBlob) => {
  const blobUrl = window.URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
};

export const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export const toFlat = (currentPath, departure, destination = [], withFolders = false) => {
  for (const item of departure) 
    if (item.childs !== null) {
      toFlat(`${currentPath}${item.name}/`, item.childs, destination, withFolders);
      if (withFolders) 
        destination.push(`${currentPath}${item.name}/`);
    }
    else
      destination.push(`${currentPath}${item.name}`);
  return destination;
}; 
