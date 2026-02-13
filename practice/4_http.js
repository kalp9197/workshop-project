import http from 'http';

// Creating a raw server
const server = http.createServer((req, res) => {
  // We have to manually handle headers and status
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Hello World');
  res.end();
});

server.listen(8001
    , () => {
        console.log('Server is running on port 8001');
    }
);