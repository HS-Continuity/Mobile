const maskDigits = inputStr => {
  let digitCount = 0;
  return inputStr
    .split("")
    .map(char => {
      if (/\d/.test(char)) {
        digitCount++;
        if (digitCount >= 5 && digitCount <= 12) {
          return "*";
        }
      }
      return char;
    })
    .join("");
};

export default maskDigits;
