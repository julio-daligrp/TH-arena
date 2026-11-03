# TH Arenas – sitio web

Sitio estático (HTML + CSS + JS). No necesita servidor ni compilación: se sube la carpeta tal cual.

## Antes de publicar
1. **Dominio**: busca y reemplaza `https://TU-DOMINIO.com` por tu dominio real en `index.html`, `robots.txt` y `sitemap.xml`.
2. **WhatsApp**: en `assets/js/main.js` (arriba) cambia `CONFIG.whatsapp` por el número de ventas (formato `1809XXXXXXX`).
3. **Formulario / CRM** (opcional): pon en `CONFIG.endpoint` la URL de tu CRM, Formspree o webhook (recibe un POST JSON con los datos y los UTM). Si lo dejas vacío, el formulario abre WhatsApp con el mensaje armado.
4. **Analítica**: pega tu Pixel de Meta / GA4 / Tag Manager donde indica el comentario al final del `<head>` en `index.html`.
5. **Video**: en la sección Planos hay un comentario con el iframe listo para pegar el enlace del video.

## Dónde editar precios y datos
- Precios, metraje, baños, mantenimiento y descuentos: objeto `data` y `descuentos` en `assets/js/main.js`.
- Los mismos precios aparecen escritos en `index.html` (botones de la calculadora, "Precio desde" del hero y preguntas frecuentes). Cámbialos también ahí.
- Fotos: `assets/img/` (WebP). Las de apartamentos son `apto-Nh-0X.webp` + miniatura `-t.webp`.

## Cómo publicar
- **Cloudflare Pages / Netlify**: arrastra la carpeta (o conecta el repositorio). Ya incluye `_headers`. Luego añade tu dominio y activa HTTPS.
- **Hosting con cPanel / Apache**: sube todo el contenido a `public_html`. Ya incluye `.htaccess` (HTTPS, caché, compresión).
- Después: verifica el dominio en Google Search Console y envía `sitemap.xml`.
