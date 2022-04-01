export function priceFomat(price, number) {
  if (number === "million") {
    price = Math.ceil(Number(price) / 1000000).toString();
  }
  return Number(price).toLocaleString();
}
