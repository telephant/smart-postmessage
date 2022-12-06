
export const generateUniqueId = (len: number) => {
  const uuidBuf = new Uint8Array(len);
  window.crypto.getRandomValues(uuidBuf);
  const uuid = buf2Hex(uuidBuf);
  return uuid;
};

export const buf2Hex = (buffer: ArrayBuffer) => { // buffer is an ArrayBuffer
  // create a byte array (Uint8Array) that we can use to read the array buffer
  const byteArray = new Uint8Array(buffer);

  // for each element, we want to get its two-digit hexadecimal representation
  const hexParts = [];
  for (let i = 0; i < byteArray.length; i++) {
    // convert value to hexadecimal
    const hex = byteArray[i].toString(16);

    // pad with zeros to length 2
    const paddedHex = (`00${hex}`).slice(-2);

    // push to array
    hexParts.push(paddedHex);
  }

  // join all the hex values of the elements into a single string
  return hexParts.join('');
};

