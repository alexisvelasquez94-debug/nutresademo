# Publicar la demo rápidamente

## Opción más rápida: cargar el ZIP

1. Abre [AWS Amplify](https://console.aws.amazon.com/amplify/).
2. Selecciona **Create new app → Deploy without Git**.
3. Nombra la aplicación `servicios-nutresa-demo` y la rama `demo`.
4. En **Drag and drop**, carga **nutresa-amplify-listo.zip**.
5. Pulsa **Save and deploy** y abre la URL que genere AWS.

No descomprimas y vuelvas a comprimir el ZIP dentro de otra carpeta. Ya contiene `index.html` en la raíz, como lo requiere Amplify.

## Opción con repositorio y despliegue automático

La carpeta `nutresa-demo` es un repositorio Git local con rama `main`. El ZIP de código contiene el proyecto y su historial Git. No se creó un repositorio remoto en una cuenta de GitHub.

1. Crea un repositorio vacío en tu proveedor Git, sin agregar un README inicial.
2. Descomprime el paquete de código y abre la terminal dentro de `nutresa-demo`.
3. Vincula el repositorio remoto usando **la URL de tu repositorio**:

```sh
git remote add origin URL_DE_TU_REPOSITORIO
git push -u origin main
```

4. En AWS Amplify, selecciona **Create new app** y conecta ese repositorio.
5. Elige la rama `main`. Amplify encontrará `amplify.yml`.
6. Verifica que los comandos sean `npm test` y `npm run build`, y que la carpeta de salida sea `dist`.
7. Guarda y despliega. Los siguientes cambios enviados a `main` podrán volver a desplegarse automáticamente.

Si prefieres cargar archivos desde la web de GitHub, carga el **contenido** de `nutresa-demo` en la raíz del repositorio, incluyendo `public/`, `scripts/`, `tests/`, `package.json` y `amplify.yml`. No cargues `.git/`, `dist/` ni `test-results/`.

## Probar el acceso

| Campo | Valor |
| --- | --- |
| Cédula | `1000000000` |
| Contraseña | `NutresaDemo2026!` |

El acceso, SSO y envío son simulados. El formulario y los adjuntos se guardan en el navegador; no se envían a Nutresa. El chatbot funciona con preguntas frecuentes locales. Usa información ficticia.

## Si aparece una página vacía

- Confirma que `index.html`, `app.js`, `styles.css`, `domain.js`, `config.js`, `storage.js` y `assets/` están en la raíz de la publicación.
- Abre la URL HTTPS de Amplify; no abras el HTML desde el explorador de archivos.
- Las rutas del sitio se ven como `/#registro/0`. No necesitan reglas de redirección.
- Si actualizaste una publicación existente y ves la versión anterior, recarga sin caché.

Referencia: [Despliegue manual de Amplify](https://docs.aws.amazon.com/amplify/latest/userguide/manual-deploys.html).
