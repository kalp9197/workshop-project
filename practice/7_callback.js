function getData(callback) {
  callback('a');
}
function getMoreData(a, callback) {
  callback('b');
}
function getEvenMoreData(b, callback) {
  callback('c');
}
// This is hard to read and debug
getData(function(a) {
    // We wait for 'a' to return...
    getMoreData(a, function(b) {
      // Then we wait for 'b'...
      getEvenMoreData(b, function(c) {
        // Then we wait for 'c'...
        console.log(c);
      });
    });
  });
