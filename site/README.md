# TH Arenas – sitio web

Sitio estático (HTML + CSS + JS) con varias páginas. No necesita servidor ni compilación: se sube la carpeta tal cual.

## Páginas
| Archivo | Contenido |
| --- | --- |
| `index.html` | Portada: hero, precios, calculadora, amenidades, ubicación y enlaces al resto |
| `proyecto.html` | Descripción del proyecto, datos clave y fotos reales |
| `precios.html` | Pestañas de 1, 2 y 3 habitaciones con precio, metraje y galería |
| `calculadora.html` | Calculadora de inicial, cuota mensual e ingreso recomendado |
| `planos.html` | Planos de los tipos A, B y C (con visor en grande) |
| `amenidades.html` | Piscina, gimnasio, casa club, plaza comercial y más |
| `preguntas.html` | Preguntas frecuentes |
| `ubicacion.html` | Mapa y distancias a puntos de interés |
| `contacto.html` | Formulario de visita / WhatsApp y datos de contacto |
| `404.html` | Página de error |

El menú y el pie de página se repiten en cada archivo HTML. Si cambias un enlace o un texto del menú, hazlo también en las demás páginas. En móvil y tablet (≤860 px) el menú se convierte en un botón hamburguesa; su comportamiento está en `assets/js/main.js` y los estilos en `styles.css`.

## Antes de publicar
1. **Dominio**: busca y reemplaza `https://TU-DOMINIO.com` por tu dominio real en todos los `.html`, `robots.txt` y `sitemap.xml`.
2. **WhatsApp**: en `assets/js/main.js` (arriba) cambia `CONFIG.whatsapp` por el número de ventas (formato `1809XXXXXXX`).
3. **Formulario / CRM** (opcional): pon en `CONFIG.endpoint` la URL de tu CRM, Formspree o webhook (recibe un POST JSON con los datos y los UTM). Si lo dejas vacío, el formulario abre WhatsApp con el mensaje armado.
4. **Analítica**: pega tu Pixel de Meta / GA4 / Tag Manager donde indica el comentario en el `<head>` de cada página (o mejor, en un archivo JS común).
5. **Video**: en `planos.html` hay un comentario con el iframe listo para pegar el enlace del video.

## Dónde editar precios y datos
- Precios, metraje, baños, mantenimiento y descuentos: objeto `data` y `descuentos` en `assets/js/main.js`.
- Los mismos precios aparecen escritos en el HTML: botones de la calculadora (`calculadora.html`), "Precio desde" del hero (`index.html`), datos clave (`proyecto.html`) y preguntas frecuentes (`preguntas.html`). Cámbialos también ahí.
- Fotos: `assets/img/` (WebP). Las de apartamentos son `apto-Nh-0X.webp` + miniatura `-t.webp`.

## Cómo publicar
- **Cloudflare Pages / Netlify**: arrastra la carpeta (o conecta el repositorio). Ya incluye `_headers`. Luego añade tu dominio y activa HTTPS.
- **Hosting con cPanel / Apache**: sube todo el contenido a `public_html`. Ya incluye `.htaccess` (HTTPS, caché, compresión).
- Después: verifica el dominio en Google Search Console y envía `sitemap.xml`.
