export const removeVietnameseTones = (str) => {
  const accents =
    "àáảãạảãăắẳằẵặâầấậẩẫäæçèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ";
  const noAccents =
    "aaaaaaaaaaaaaaaaaaaaaceeeeeeeeeeeiiiiiooooooooooooooouuuuuuuuuuuyyy";

  return str
    .split("")
    .map((char) => {
      const index = accents.indexOf(char);
      return index !== -1 ? noAccents[index] : char;
    })
    .join("");
};
