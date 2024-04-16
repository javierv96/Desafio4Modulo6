const express = require('express');
const jimp = require('jimp');

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.use(express.static(__dirname + '/assets/img'));
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use('/css', express.static(__dirname + '/assets/css'));

app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});

app.use((req, res) => {
    res.send('Esta página no existe...');
});