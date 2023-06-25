function twoDigitRegular(value) {
  const regStr = `^\\d*(\\.?\\d{0,2})`;
  const reg = new RegExp(regStr, 'g');
  return value.match(reg)[0];
}
function phoneRegular(value) {
  const phoneReg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
  return phoneReg.test(value);
}
function passwordRegular(value) {
  const phoneReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@&%#/+-._])[a-zA-Z0-9~!@&%#+-/._]{8,16}$/;
  return phoneReg.test(value);
}
function integerRegular(value) {
  return value.replace(/[^0-9]/g, '');
}
export { integerRegular, twoDigitRegular, phoneRegular, passwordRegular };
