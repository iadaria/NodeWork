const http = require('http');
const { brotliDecompressSync } = require('zlib');

const todos = [
    { id: 1, text: 'text 1'},
    { id: 2, text: 'text 21'},
    { id: 13, text: 'text d1'},
]

const server = http.createServer((req, res) => {
    const { headers, url, method } = req;
    console.log(headers, url, method);
    let body = [];

    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body);
        console.log('body', body.toString());
        //res.statusCode = 404;
        //res.setHeader('Content-Type', "application/json");

        let status = 404;
        const response = {
            success: false,
            data: null,
        };

        res.writeHeader(status, {
            'Content-Type': "application/json",
            'X-Powered-By': 'Node.js'
        });

        //res.write("Hellow");
        res.end(
            JSON.stringify(response)
        );
    })
    
});

const PORT = 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));