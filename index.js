const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./db/config');
require('dotenv').config();



//Crear el servidor/App de express

const app = express();

// Base de datos 
dbConnection();

//Directorio publico

app.use(express.static('public'))

//Cors
app.use( cors() );

//Lectura y parseo del body
app.use(express.json());


//Rutas
app.use('/api/auth', require('./routes/auth'));


//manejar las demas rutas

app.get('*', (req,resp) => {
    resp.sendFile(path.resolve(__dirname, 'public/index.html'))
})

app.listen(process.env.PORT, () => {
    console.log(process.env.PORT);
    console.log(`Servidor funcionando en puerto ${process.env.PORT}`);
});

//GET

app.get('/', (req, res)=> {
    res.json({
        ok:true,
        msg:'Hola',
        uid: 3221
    })
})