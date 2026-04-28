const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'programas_bkup.json');

// Read existing data
let data = [];
try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(rawData);
} catch (e) {
    console.error("Error reading data:", e);
    process.exit(1);
}

// Add default fields to existing data
data.forEach(item => {
    if (!item.type) item.type = "Aplicación de Escritorio";
    if (!item.category) item.category = "Otros";
});

// Helper to generate ID
const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

const newApps = [
    { name: "Google Suite", version: "Web", usageInfo: "Uso completo de Keep, Calendar, Contactos, Mail, Drive, Docs, Sheets y Slides.", url: "https://workspace.google.com/", type: "Web App", category: "Ofimática y Productividad" },
    { name: "Office 365", version: "Web", usageInfo: "Word, Excel, PowerPoint, Outlook y OneDrive.", url: "https://www.office.com/", type: "Web App", category: "Ofimática y Productividad" },
    { name: "Box.net", version: "Web", usageInfo: "Utilizada para gestionar archivos fuera de Google Drive y OneDrive.", url: "https://www.box.com/", type: "Web App", category: "Almacenamiento en la Nube" },
    { name: "Dropbox", version: "Web", usageInfo: "Utilizada para gestionar archivos fuera de Google Drive y OneDrive.", url: "https://www.dropbox.com/", type: "Web App", category: "Almacenamiento en la Nube" },
    { name: "Mega.nz", version: "Web", usageInfo: "Utilizada para gestionar archivos fuera de Google Drive y OneDrive.", url: "https://mega.nz/", type: "Web App", category: "Almacenamiento en la Nube" },
    { name: "Gemini", version: "Web", usageInfo: "Herramienta principal para documentación y guiones.", url: "https://gemini.google.com/", type: "Web App", category: "Inteligencia Artificial" },
    { name: "NotebookLM", version: "Web", usageInfo: "Herramienta principal para documentación y guiones.", url: "https://notebooklm.google.com/", type: "Web App", category: "Inteligencia Artificial" },
    { name: "Google AI Studio", version: "Web", usageInfo: "Uso ocasional.", url: "https://aistudio.google.com/", type: "Web App", category: "Inteligencia Artificial" },
    { name: "123apps", version: "Web", usageInfo: "Herramientas versátiles de audio, video y documentos.", url: "https://123apps.com/", type: "Web App", category: "Herramientas de Edición y Gestión de Archivos" },
    { name: "ILovePDF", version: "Web", usageInfo: "Gestión integral de archivos PDF.", url: "https://www.ilovepdf.com/", type: "Web App", category: "Herramientas de Edición y Gestión de Archivos" },
    { name: "ILoveIMG", version: "Web", usageInfo: "Edición y conversión de imágenes.", url: "https://www.iloveimg.com/", type: "Web App", category: "Herramientas de Edición y Gestión de Archivos" },
    { name: "Photopea", version: "Web", usageInfo: "Editor de imágenes avanzado, tipo Photoshop.", url: "https://www.photopea.com/", type: "Web App", category: "Herramientas de Edición y Gestión de Archivos" },
    { name: "Pixlr", version: "Web", usageInfo: "Edición de fotos e IA para remover fondos.", url: "https://pixlr.com/", type: "Web App", category: "Herramientas de Edición y Gestión de Archivos" },
    { name: "Bandlab", version: "Web", usageInfo: "Edición y grabación de audio.", url: "https://www.bandlab.com/", type: "Web App", category: "Herramientas de Edición y Gestión de Archivos" },
    { name: "CapCut Web", version: "Web", usageInfo: "Edición de video en 4K.", url: "https://www.capcut.com/", type: "Web App", category: "Herramientas de Edición y Gestión de Archivos" },
    { name: "Visual Code Studio", version: "Web", usageInfo: "Edición de código en la nube.", url: "https://vscode.dev/", type: "Web App", category: "Herramientas de Edición y Gestión de Archivos" },
    { name: "Open Spotify", version: "Web", usageInfo: "Música y podcasts.", url: "https://open.spotify.com/", type: "Web App", category: "Ocio y Entretenimiento" },
    { name: "YouTube Music", version: "Web", usageInfo: "Consumo de contenido musical.", url: "https://music.youtube.com/", type: "Web App", category: "Ocio y Entretenimiento" },
    { name: "YouTube", version: "Web", usageInfo: "Consumo de contenido de video.", url: "https://www.youtube.com/", type: "Web App", category: "Ocio y Entretenimiento" },
    { name: "uBlock Origin Lite", version: "Extensión", usageInfo: "Bloqueador de anuncios.", url: "", type: "Web App", category: "Ocio y Entretenimiento" },
    { name: "Prime Video", version: "Web", usageInfo: "Streaming de películas.", url: "https://www.primevideo.com/", type: "Web App", category: "Ocio y Entretenimiento" },
    { name: "Kindle Cloud Reader", version: "Web", usageInfo: "Lectura de libros.", url: "https://read.amazon.com/", type: "Web App", category: "Ocio y Entretenimiento" },
    { name: "Xbox Cloud Gaming", version: "Web", usageInfo: "Juegos en la nube.", url: "https://www.xbox.com/play", type: "Web App", category: "Gaming (Cloud Gaming)" },
    { name: "Luna", version: "Web", usageInfo: "Juegos incluidos con Amazon Prime.", url: "https://luna.amazon.es/", type: "Web App", category: "Gaming (Cloud Gaming)" },
    { name: "Archive.org", version: "Web", usageInfo: "Emulación de juegos retro (Software Library).", url: "https://archive.org/details/softwarelibrary", type: "Web App", category: "Gaming (Cloud Gaming)" }
];

newApps.forEach(app => {
    app.id = generateId();
    data.push(app);
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('programas_bkup.json has been updated.');
