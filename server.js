const express = require('express');
const Jimp = require('jimp');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/assets/img'));
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use('/css', express.static(__dirname + '/assets/css'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/cargar", async (req, res) => {

    try {
        const newUuid = uuid.v4().slice(0, 6);

        const { imagen, url } = req.query;
        const imagenProcesada = await Jimp.read(url);

        imagenProcesada.resize(350, 350);
        imagenProcesada.greyscale();

        imagenProcesada.getBuffer(Jimp.newUuid, (err, buffer) => {
            if (err) {
                throw err;
            }

            res.set('Content-Type', Jimp.newUuid);

            res.send(buffer);
        });
        
    } catch (error) {
        console.log('Error al procesar la imagen: ', error);
        res.status(500).send('Error interno del servidor');
    }
})

app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});

app.use((req, res) => {
    res.send('Esta página no existe...');
});