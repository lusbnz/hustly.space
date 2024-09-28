export const removeVietnameseTones = (str) => {
  const accents =  "àáảãạảãăắẳằẵặâầấậẩẫäæçèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹÂÁĐỨỘÀẢÃẠẢÃĂẮẲẰẴẶÂẦẤẬẨẪÄÆÇÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ";
  const noAccents ="aaaaaaaaaaaaaaaaaaaaaceeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAADUOAAAAAAAAAAAAAAAAAAAACEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYY";

  return str
    .split("")
    .map((char) => {
      const index = accents.indexOf(char);
      return index !== -1 ? noAccents[index] : char;
    })
    .join("");
};
