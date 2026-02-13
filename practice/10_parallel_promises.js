const fetchAll = async () => {
    // Triggers both requests immediately (in parallel)
    const userPromise = getUser(1);
    const postsPromise = getPosts(1);
  
    // 'Promise.all' waits for BOTH to finish
    const [user, posts] = await Promise.all([
      userPromise, 
      postsPromise
    ]);
    
    console.log(user, posts);
  };
// Demo version of getUser and getPosts for testing
function getUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: "User " + id });
    }, 500);
  });
}

function getPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { userId, id: 1, title: "First post" },
        { userId, id: 2, title: "Second post" }
      ]);
    }, 700);
  });
}

// Run our function for demonstration
console.time("parallel-fetch");
fetchAll().then(() => {
  console.timeEnd("parallel-fetch");
});