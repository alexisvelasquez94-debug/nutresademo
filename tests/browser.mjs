// Prueba opcional de extremo a extremo. Requiere Playwright disponible en el entorno de QA.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const { chromium }=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
await mkdir('test-results',{recursive:true});
const route=async hash=>{await page.goto('http://127.0.0.1:4173/#'+hash);await page.locator('#main').waitFor();};
const btn=(name)=>page.getByRole('button',{name,exact:true});
const next=async()=>btn('Continuar').click();
const fill=async(selector,value)=>page.locator(selector).fill(value);
const add=async(kind,values)=>{
  await page.locator(`[data-action="add-row"][data-kind="${kind}"]`).click();
  for(const [key,value] of Object.entries(values)) {const el=page.locator(`#row-form [name="${key}"]`);if(await el.evaluate(x=>x.tagName)==='SELECT')await el.selectOption(value);else await el.fill(value);}
  await page.locator('#row-form').getByRole('button',{name:'Guardar',exact:true}).click();
  await page.locator('#modal').waitFor({state:'hidden'});
};
try {
  await route('inicio');await page.getByRole('heading',{name:'Construyamos nuevas oportunidades.'}).waitFor();
  await page.screenshot({path:'test-results/inicio-escritorio.png',fullPage:true});
  await route('login');await fill('#username','incorrecto');await fill('#password','incorrecto');await page.locator('#login-form [type="submit"]').click();
  assert.match(await page.locator('#login-errors').innerText(),/no coinciden/);
  await btn('Usar estas credenciales').click();await page.locator('#login-form [type="submit"]').click();await page.waitForURL('**/#mi-registro');
  await btn('Salir').click();await route('registro/0');await next();assert.match(await page.locator('#form-errors').innerText(),/NIT/);
  await fill('#general-nit','900123456-7');await fill('#general-name','Alimentos de Prueba');await fill('#general-legalName','Alimentos de Prueba S.A.S.');await fill('#general-email','demo@example.com');await fill('#general-phone','3001234567');
  assert.equal(await page.locator('[data-field="general.consent"]').isDisabled(),true);
  await btn('Leer aviso de tratamiento de datos').click();await btn('He leído el aviso').click();await page.locator('[data-field="general.consent"]').check();
  assert.equal(await page.locator('.aside-progress strong').innerText(),'13%');await page.screenshot({path:'test-results/registro-escritorio.png',fullPage:true});await next();
  await page.waitForURL('**/#registro/1');await fill('#company-year','2010');await page.locator('#company-category').selectOption('Servicios');await page.locator('#company-subcategory').selectOption('Logística');await fill('#company-description','Transporte de alimentos.');await next();
  await page.waitForURL('**/#registro/2');await add('plants',{name:'Planta de prueba',country:'Colombia',city:'Medellín',address:'Calle de ejemplo 123'});
  await page.getByRole('button',{name:'Editar Planta de prueba',exact:true}).click();await fill('#row-form #city','Bogotá');await page.locator('#row-form').getByRole('button',{name:'Guardar',exact:true}).click();
  assert.match(await page.locator('tbody').innerText(),/Bogotá/);
  await add('plants',{name:'Sede temporal',country:'Colombia',city:'Cali'});await page.getByRole('button',{name:'Eliminar Sede temporal',exact:true}).click();await page.locator('#modal').getByRole('button',{name:'Eliminar',exact:true}).click();assert.equal(await page.locator('tbody tr').count(),1);await next();
  await page.waitForURL('**/#registro/3');await fill('#employees-total','20');await fill('#employees-research','21');await next();assert.match(await page.locator('#form-errors').innerText(),/superar/);await fill('#employees-research','3');await next();
  await page.waitForURL('**/#registro/4');await add('market',{channel:'Industrial',sales:'12000000',currency:'COP',other:'Ventas nacionales'});await fill('#competitors','Compañía ficticia');await next();
  await page.waitForURL('**/#registro/5');await add('clients',{name:'Cliente de prueba',share:'60'});
  await page.locator('[data-action="add-row"]').click();await fill('#row-form #name','Cliente adicional');await fill('#row-form #share','50');await page.locator('#row-form').getByRole('button',{name:'Guardar',exact:true}).click();assert.match(await page.locator('#row-errors').innerText(),/100/);await fill('#row-form #share','40');await page.locator('#row-form').getByRole('button',{name:'Guardar',exact:true}).click();await next();
  await page.waitForURL('**/#registro/6');await page.getByLabel('Ambos',{exact:true}).check();await fill('#sourcing-leadTime','15 días hábiles');await next();
  await page.waitForURL('**/#registro/7');await add('contacts',{name:'Contacto Ficticio',role:'Comercial',phone:'3009876543',email:'contacto@example.com',notes:'Datos de prueba'});
  await page.locator('#file-input').setInputFiles({name:'archivo.txt',mimeType:'text/plain',buffer:Buffer.from('No permitido')});await page.locator('#upload-errors').waitFor({state:'visible'});assert.match(await page.locator('#upload-errors').innerText(),/Formato no permitido/);
  const pdf=Buffer.from('%PDF-1.4\nDemo de documento ficticio\n%%EOF');
  await page.locator('#file-input').setInputFiles({name:'portafolio-demo.pdf',mimeType:'application/pdf',buffer:pdf});await page.locator('.file-list li').waitFor();
  await page.reload();await page.locator('.file-list li').waitFor();assert.match(await page.locator('.file-list').innerText(),/portafolio-demo.pdf/);
  const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Descargar portafolio-demo.pdf',exact:true}).click();assert.equal((await downloadPromise).suggestedFilename(),'portafolio-demo.pdf');
  await page.locator('#file-input').setInputFiles({name:'portafolio-demo.pdf',mimeType:'application/pdf',buffer:pdf});await page.locator('#upload-errors').waitFor({state:'visible'});assert.match(await page.locator('#upload-errors').innerText(),/ya está/);
  await btn('Guardar y salir').click();await page.waitForURL('**/#inicio');await route('login');await btn('Usar estas credenciales').click();await page.locator('#login-form [type="submit"]').click();await page.waitForURL('**/#mi-registro');await btn('Continuar mi registro').click();await page.waitForURL('**/#registro');
  await btn('Revisar y enviar').click();await page.locator('#modal').waitFor();await btn('Confirmar envío de prueba').click();await page.waitForURL('**/#mi-registro');assert.match(await page.locator('.success-panel').innerText(),/DEMO-/);
  const jsonDownload=page.waitForEvent('download');await btn('Descargar datos (JSON)').click();assert.equal((await jsonDownload).suggestedFilename(),'registro-proveedor-demo.json');
  await btn('Editar registro').click();await btn('Volver a borrador').click();await page.waitForURL('**/#registro');
  await page.getByRole('button',{name:'Eliminar portafolio-demo.pdf',exact:true}).click();await btn('Eliminar documento').click();await page.locator('#modal').waitFor({state:'hidden'});assert.equal(await page.locator('.file-list li').count(),0);
  await page.locator('.chat-launcher').click();await fill('#chat-input','¿Qué documentos puedo adjuntar?');await page.locator('#chat-form [aria-label="Enviar pregunta"]').click();assert.match(await page.locator('.chat-message.assistant').last().innerText(),/10 MB/);
  await fill('#chat-input','¿Cuál es el precio del café mañana?');await page.locator('#chat-form [aria-label="Enviar pregunta"]').click();assert.match(await page.locator('.chat-message.assistant').last().innerText(),/No tengo una respuesta verificada/);await page.getByRole('button',{name:'Cerrar asistente',exact:true}).click();
  await route('ayuda');await fill('#faq-search','contraseña');assert.ok(await page.locator('.faq-item').count()>0);
  await route('mi-registro');await btn('Salir').click();await route('login');await btn('Acceso corporativo SSO DEMO').click();await btn('Continuar en modo demo').click();await page.waitForURL('**/#mi-registro');
  await btn('Borrar datos de la demo').click();await btn('Borrar todo').click();await page.locator('#modal').waitFor({state:'hidden'});
  assert.equal(await page.evaluate(()=>localStorage.getItem('nutresa-proveedor-demo-v1')),null);
  await page.setViewportSize({width:390,height:844});
  for(const routeName of ['inicio','registro/0','registro/7','mi-registro','ayuda']) {await route(routeName);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'Desborde horizontal: '+routeName);}
  await route('registro/0');await page.screenshot({path:'test-results/registro-movil.png',fullPage:true});
  await btn('Abrir menú').click();await btn('Salir').click();await route('login');await page.screenshot({path:'test-results/login-movil.png',fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.deepEqual(errors,[]);
  console.log('E2E OK: login y SSO demo, 8 módulos, CRUD, validación, adjuntos persistentes, descarga, borrador, envío, exportación, chatbot, borrado y móvil.');
} finally {await browser.close();}
