const express = require('express');
const path = require('path');
const Handlebars = require('handlebars');
const { engine } = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const productsRouter = require('./src/Routes/products.Router');
const cartsRouter = require('./src/routes/carts.router');
const viewsRouter = require('./src/routes/views.router');
const { connectDB } = require('./src/config/db.js'); 

connectDB();


const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

// Handlebars config
app.engine(
  'handlebars',
  engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
);

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

// Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Sockets global
require('./src/sockets/socketManager')(io);

const PORT = 8080;
http.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
