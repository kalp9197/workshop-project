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
// 1. Mark function as 'async'
const processData = async () => {
    try {
      // 2. 'await' pauses execution here until getData() finishes
      const a = await getData();
      
      // 3. This line won't run until 'a' is ready
      const b = await getMoreData(a);
      
      console.log(b);
    } catch (error) {
      // 4. Catches errors from any step
      console.error("Something went wrong", error);
    }
  };

processData();