function getData() {
  return new Promise((resolve, reject) => {
    resolve('a');
  });
}
function getMoreData(a) {
  return new Promise((resolve, reject) => {
    resolve('b');
  });
}
function getEvenMoreData(b) {
  return new Promise((resolve, reject) => {
    resolve('c');
  });
}
// Flattens the code using .then() chaining
getData()
  .then(a => {
    return getMoreData(a);
  })
  .then(b => {
    return getEvenMoreData(b);
  })
  .then(c => {
    console.log(c);
  })
  .catch(err => {
    // Handles errors for ANY of the steps above
    console.error(err);
  });
