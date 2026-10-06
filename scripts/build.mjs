import { cp, mkdir, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
await mkdir(root + 'dist', { recursive: true });
await cp(root + 'public', root + 'dist', { recursive: true });
for (const file of ['index.html', 'app.js', 'styles.css', 'assets/landscape.jpg']) {
  if (!(await stat(root + 'dist/' + file)).size) throw new Error('Archivo vacío: ' + file);
}
console.log('Sitio compilado en dist/ · ' + (await readdir(root + 'dist')).length + ' entradas.');
