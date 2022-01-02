const hapi = require('@hapi/hapi');
const fs = require('fs');

const productsJson = fs.readFileSync(__dirname + '/data/products.json');
const products = JSON.parse(productsJson);

const server = hapi.Server({
    port: 8081,
    host: '0.0.0.0'
});

server.route({
    method: 'GET',
    path: '/health',
    handler: (request, h) => {
        return {
            statusCode: 200,
            message: 'OK'
        };
    },
});

server.route({
    method: 'GET',
    path: '/products',
    handler: (require, h) => {
        return products.productList;
    }
});

server.route({
    method: 'GET',
    path: '/products/{productId}',
    handler: (request, h) => {
        let product;

        for (let index = 0; index < products.productList.length; index++) {
            if (products.productList[index].id == request.params.productId) {
                product = products.productList[index];
                break;
            }
        }

        if (product) {
            return product;
        } else {
            return h.response(JSON.parse('{}')).code(404);
        }
    }
});

server.route({
    method: 'POST',
    path: '/products',
    handler: (request, h) => {

        const product = request.payload;
        let maxId = 0;

        for (let index = 0; index < products.productList.length; index++) {
            if (products.productList[index].id > maxId) {
                maxId = products.productList[index].id;
            }
        }

        product.id = maxId + 1;
        products.productList.push(product);

        return product;
    }
});

server.route({
    method: 'PUT',
    path: '/products/{productId}',
    handler: (request, h) => {
        const product = request.payload;
        let matchFound = false;

        for (let index = 0; index < products.productList.length; index++) {
            if (products.productList[index].id == request.params.productId) {
                matchFound = true;
                product.id = products.productList[index].id;
                products.productList[index] = product;
                break;
            }
        }

        if (matchFound) {
            return product;
        } else {
            return h.response(JSON.parse('{}')).code(404);
        }
    }
});

server.route({
    method: 'DELETE',
    path: '/products/{productId}',
    handler: (request, h) => {
        let product;

        for (let index = 0; index < products.productList.length; index++) {

            if (products.productList[index].id == request.params.productId) {
                product = products.productList[index];
                products.productList.splice(index, 1);
                break
            }
        }

        if (product) {
            return product;
        } else {
            return h.response(JSON.parse('{}')).code(404);
        }
    }
});

const start = async () => {
    await server.start();
    console.log('Server listening on port %s', server.info.uri);
}

start();