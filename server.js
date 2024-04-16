const express = require('express');
const uuid = require('uuid');
const Jimp = require('jimp');
const fs = require('fs')

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/css"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/cargar", async (req, res) => {
    const { imagen } = req.query

    try {
        const imagenGuardada = await Jimp.read(
            `${imagen}`
        )
        const nombreAleatoreo = `${uuid.v4().slice(0, 6)}.jpeg`
        imagenGuardada
            .resize(350, Jimp.AUTO)
            .greyscale()
            .write(`${nombreAleatoreo}`)
        imagenGuardada.getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
            if (err) {
                throw err;
            }

            // Configurar el encabezado de respuesta
            res.set('Content-Type', Jimp.MIME_JPEG);

            // Enviar la imagen redimensionada como respuesta
            res.send(buffer);
            console.log("Nombre de la nueva imagen almacenada: ", nombreAleatoreo);
        });

    } catch (error) {

        if(error.code == "ENOENT"){
            console.error("La imagen no existe");
            res.status(404).send("La imagen no existe en el servidor");
        }

        console.error("Error al procesar la imagen:", error);
        res.status(500).send("Ocurrió un error al procesar la imagen.");
    }
})

app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});

app.use((req, res) => {
    res.send('Esta página no existe...');
});