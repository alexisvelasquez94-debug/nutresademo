# Servicios Nutresa · Demo de aprovisionamiento potencial

Implementación completa del concepto **Conexión sostenible**: logo oficial de Servicios Nutresa, tipografía Poppins y verdes del portal original, fotografía agrícola ilustrativa, formularios claros y diseño adaptable a móvil y escritorio.

La web utiliza el paisaje completo seleccionado. `extras/cafeto-transparente.png` es una alternativa con transparencia generada a partir de esa imagen y se entrega por separado, sin cambiar el fondo del sitio. Consulta `DESPLEGAR.md` para la guía rápida de publicación por ZIP o repositorio.

## Publicar directamente en AWS Amplify

El paquete `nutresa-amplify-listo.zip` contiene el sitio listo para publicar. **No necesita instalación ni compilación previa.**

1. Entra a la consola de AWS Amplify.
2. Selecciona **Create new app → Deploy without Git → Next**.
3. Usa un nombre, por ejemplo `servicios-nutresa-demo`, y una rama como `demo`.
4. Selecciona **Drag and drop** y carga `nutresa-amplify-listo.zip`.
5. Selecciona **Save and deploy**. Amplify te mostrará la dirección pública del sitio.

Sube el ZIP listo, no el paquete de código fuente. `index.html` debe estar en la raíz del ZIP; el paquete entregado ya tiene esta estructura. Las rutas usan `#`, por lo que no necesitas configurar redirecciones de SPA.

Documentación oficial consultada:
- https://docs.aws.amazon.com/amplify/latest/userguide/manual-deploys.html
- https://docs.aws.amazon.com/amplify/latest/userguide/yml-specification-syntax.html

No se ha publicado automáticamente en tu cuenta de AWS.

## Credenciales de demostración

- **Cédula:** `1000000000`
- **Contraseña:** `NutresaDemo2026!`

El botón **Usar estas credenciales** completa el login. **Acceso corporativo SSO** simula una sesión después de mostrar una explicación. **¿Olvidaste tu contraseña?** vuelve a mostrar las credenciales públicas; no envía correos.

## Funcionalidades incluidas

| Módulo | Contenido |
| --- | --- |
| Inicio | Presentación, cuatro categorías de aprovisionamiento, guía del proceso y acceso al asistente |
| 1. Datos generales | NIT, nombre, razón social, correo, país, indicativo, teléfono, lectura y aceptación del aviso de demo |
| 2. Compañía | Exportación, NIT y nombre sincronizados, año, categoría y subcategoría dependiente, tipo de compañía y sociedad, productos/servicios, web |
| 3. Plantas | Crear, editar y eliminar múltiples plantas o domicilios con país, ciudad y dirección |
| 4. Empleados | Total e I+D, validación de enteros no negativos y de I+D menor o igual al total |
| 5. Mercado | Crear, editar y eliminar canales, valor de ventas, moneda, otros canales y competidores |
| 6. Clientes | Crear, editar y eliminar clientes, participación porcentual y control de suma máxima del 100 % |
| 7. Insumos y negociación | Procedencia nacional/importada/ambas, integración vertical, proyectos de inversión y lead time |
| 8. Contactos y adjuntos | Crear, editar y eliminar contactos; carga por selección o arrastre; descarga y eliminación de archivos |
| Mi registro | Avance, estado, resumen, envío simulado, reapertura para edición, exportación JSON y borrado local |
| Preguntas frecuentes | Catálogo buscable de 12 respuestas |
| Chatbot | Conversación local, preguntas sugeridas, detección de temas en español y enlaces al módulo correspondiente |

Los adjuntos permiten hasta 5 archivos PDF, JPG, JPEG, PNG o XLSX y un máximo de 10 MB por archivo. La validación de extensión y tamaño es de demostración y no sustituye la inspección de archivos de un servidor. Los archivos se guardan como objetos binarios en IndexedDB y se pueden descargar después de recargar el sitio.

Los campos obligatorios se inspiran en las capturas. Las secciones tabulares pueden quedar vacías; se consideran opcionales en la demo. El indicador mide secciones con información, por lo que un envío válido puede tener menos del 100 % si se omiten secciones opcionales. Los catálogos son ilustrativos. El selector de idioma no está implementado; **ES** indica el idioma disponible.

## Alcance del acceso, guardado y chatbot

Esta es una **demo estática, sin backend**:

- El login es una simulación; sus credenciales están en el código público y no protegen datos reales.
- Hay un solo perfil de demostración por navegador/origen. El acceso de contraseña y el SSO simulado usan ese mismo perfil.
- Los datos del formulario se guardan en `localStorage`, los archivos en `IndexedDB` y la sesión en `sessionStorage`.
- Cerrar sesión mantiene el borrador y los adjuntos. Borrar los datos del navegador los elimina. Cambiar de dispositivo, dominio o navegador no conserva el registro.
- El envío genera una referencia y una constancia locales; no radica solicitudes en Servicios Nutresa, no envía correos y no implica aprobación.
- El JSON exportado contiene los campos y metadatos de adjuntos, **no los archivos binarios**. Cada archivo se descarga individualmente desde el módulo 8. El JSON es un resumen y no dispone de importación.
- El chatbot responde con reglas y una base de preguntas frecuentes editable; no llama a modelos de IA, no tiene claves API y no consulta información interna.
- El aviso de privacidad es un texto explicativo de la demo, no una política corporativa oficial.
- La fotografía es una ilustración generada con IA de un paisaje agrícola; no identifica una propiedad de Nutresa. El logo de Servicios Nutresa se reutiliza sin modificaciones desde su sitio oficial. Poppins y el verde base #00843D se verificaron en los estilos del portal de las capturas.

Usa información ficticia. Para un despliegue productivo se necesitan autenticación real, autorización en servidor, base de datos, almacenamiento privado de documentos y política de privacidad aprobada. Una arquitectura posterior puede usar Amazon Cognito, API/Lambda, DynamoDB y S3; ninguno de esos servicios se aprovisiona con este código ni con `amplify.yml`.

## Ejecutar el código fuente

Requisito: Node.js 20 o superior. No hay dependencias de terceros ni es necesario ejecutar `npm install`.

```sh
npm run dev
```

Abre `http://127.0.0.1:4173`. Utiliza un servidor HTTP: no abras `index.html` con doble clic, porque los módulos de JavaScript y el almacenamiento necesitan un origen web.

```sh
npm test
npm run build
npm run preview
```

`npm run build` genera `dist/`. Para reconstruir el ZIP manualmente, comprime **el contenido de `dist/`**, sin incluir la carpeta contenedora. El archivo `amplify.yml` ejecuta las pruebas y la compilación si eliges conectar el proyecto a un repositorio Git. Publica el contenido del proyecto con `package.json`, `amplify.yml` y `public/` en la raíz de ese repositorio.

## Estructura

```text
public/
  index.html             Entrada y estructura base accesible
  styles.css             Tema, formularios y adaptación móvil
  app.js                 Páginas, eventos, tablas, modales y chatbot
  config.js              Credenciales públicas y límites de la demo
  domain.js              Catálogos, validaciones y preguntas frecuentes
  storage.js             Persistencia local y documentos
  assets/
    landscape.jpg        Paisaje ilustrativo optimizado y incluido localmente
    favicon.svg          Icono de hoja genérico
scripts/
  build.mjs              Genera dist/ sin dependencias
  serve.mjs              Servidor local
tests/
  domain.test.mjs        Pruebas de reglas, archivos y chatbot
amplify.yml              Configuración de compilación en Amplify
package.json             Comandos del proyecto
```

Para cambiar textos y preguntas del chatbot, edita `FAQS` en `public/domain.js`. Para cambiar colores, modifica las variables al principio de `public/styles.css`. Para ajustar el acceso de demostración, edita `public/config.js`. Nunca coloques claves privadas en estos archivos: todo el contenido de `public/` se distribuye al navegador.

## Recorrido sugerido para presentar la demo

1. Abre el inicio y selecciona **Registrar mi empresa**.
2. Prueba la validación con un campo obligatorio vacío; luego completa datos ficticios y lee el aviso.
3. Recorre las ocho secciones, agrega y edita una planta, un canal, un cliente y un contacto.
4. Adjunta un PDF ficticio, recarga y verifica que siga disponible.
5. Abre el chatbot y pregunta “¿Puedo continuar después?” o “¿Qué documentos puedo adjuntar?”.
6. Usa **Guardar y salir**, entra con las credenciales de prueba y continúa desde **Mi registro**.
7. Selecciona **Revisar y enviar**, revisa el resumen y confirma el envío simulado.
8. Descarga el JSON, vuelve a editar si lo deseas y finaliza borrando los datos de prueba.

La demo no carga fuentes, scripts o imágenes externos. Después de publicar, todas las funciones del prototipo utilizan sus archivos locales y el almacenamiento del navegador.
