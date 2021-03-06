export const findPlace = (departureFolder, currentPath) => {
  if (currentPath.indexOf("/") === -1) return departureFolder;
  const dirs = currentPath.split("/");
  let children = departureFolder;

  for (const folder of dirs)
    for (const item of children) if (item.name === folder) children = item.children;
  return children;
};

export const downloadFile = (name, dataBlob) => {
  const blobUrl = window.URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.setAttribute("download", name);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
};

export const copyToClipboard = (str) => {
  const input = document.createElement("textarea");
  input.value = str;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
};

export const toFlat = (
  currentPath,
  departure,
  destination = [],
  withFolders = false
) => {
  for (const item of departure)
    if (item.children !== null) {
      toFlat(
        `${currentPath}${item.name}/`,
        item.children,
        destination,
        withFolders
      );
      if (withFolders) destination.push(`${currentPath}${item.name}/`);
    } else destination.push(`${currentPath}${item.name}`);
  return destination;
};
