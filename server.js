// Importación de los módulos necesarios
const express = require('express'); // Framework para crear aplicaciones web y APIs
const uuid = require('uuid'); // Generación de identificadores únicos
const Jimp = require('jimp'); // Procesamiento de imágenes en JavaScript

// Creación de una instancia de la aplicación Express
const app = express();
const PORT = 3000; // Puerto en el que se ejecutará el servidor

// Middleware para servir archivos estáticos desde el directorio "public"
app.use(express.static("public"));
// Middleware para servir archivos CSS de Bootstrap desde node_modules
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/css"));

// Ruta principal que sirve un archivo HTML
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

// Ruta para procesar y redimensionar imágenes
app.get("/cargar", async (req, res) => {
    const { imagen } = req.query; // Se obtiene el contenido del input traido desde la consulta

    try {
        // Se intenta leer la imagen utilizando Jimp
        const imagenGuardada = await Jimp.read(`${imagen}`);

        // Generación de un nombre aleatorio para la imagen redimensionada
        const nombreAleatoreo = `${uuid.v4().slice(0, 6)}.jpeg`;

        // Redimensionamiento y conversión de la imagen a escala de grises
        imagenGuardada
            .resize(350, Jimp.AUTO)
            .greyscale()
            .write(`${nombreAleatoreo}`);

        // Se obtiene el buffer de la imagen redimensionada
        imagenGuardada.getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
            if (err) {
                throw err;
            }

            // Configuración del encabezado de respuesta
            res.set('Content-Type', Jimp.MIME_JPEG);

            // Envío de la imagen redimensionada como respuesta
            res.send(buffer);
            console.log("Nombre de la nueva imagen almacenada: ", nombreAleatoreo);
        });

    } catch (error) {
        // Manejo de errores posibles durante el procesamiento de la imagen
        if (error.code == 'ENOENT') {
            console.error("La imagen no existe");
            res.status(404).send("La imagen no existe en el servidor");

        } else if (error == 'Error: Unsupported MIME type: image/webp') {
            console.error("Formato .webp no válido: ", error);
            res.status(400).send("Jimp no soporta formato .webp, intente con jpg, png, bmp, gif o tiff");

        } else if (error == 'Error: Unsupported MIME type: image/avif') {
            console.error("Formato .avif no válido: ", error);
            res.status(400).send("Jimp no soporta formato .avif, intente con jpg, png, bmp, gif o tiff");

        } else {
            console.error("Error al procesar la imagen:", error);
            res.status(500).send("Ocurrió un error al procesar la imagen.");
        }
    }
})

// Inicio del servidor Express
app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});

// Middleware para manejar solicitudes a rutas no definidas
app.use((req, res) => {
    res.send('Esta página no existe...');
});