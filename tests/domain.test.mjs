import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyState, validateStep, validateFile, answerQuestion, escapeHtml, isStepComplete, validWebsite, FAQS } from '../public/domain.js';

test('Datos generales requieren NIT, nombre, correo y aceptación después de lectura', () => {
  const s=emptyState(); assert.equal(validateStep(s,0).length,4);
  Object.assign(s.general,{nit:'900123456-7',name:'Proveedor de prueba',email:'demo@example.com',consent:true});
  assert.equal(validateStep(s,0).length,1);
  s.general.privacyRead=true; assert.deepEqual(validateStep(s,0),[]);
  assert.ok(isStepComplete(s,0));
  s.general.email='correo-inválido'; assert.equal(validateStep(s,0).length,1);
});
test('I+D no supera el total y se permiten ceros explícitos',()=>{
  const s=emptyState(); assert.equal(validateStep(s,3).length,2);
  s.employees={total:'10',research:'11'}; assert.match(validateStep(s,3)[0],/superar/);
  s.employees={total:'0',research:'0'}; assert.deepEqual(validateStep(s,3),[]);
  s.employees={total:'1.2',research:'0'}; assert.equal(validateStep(s,3).length,1);
});
test('La compañía valida año, sitio web y subcategoría',()=>{
  const s=emptyState(); s.company.year=String(new Date().getFullYear()+1);assert.equal(validateStep(s,1).length,1);
  s.company.year='2010';s.company.website='javascript:alert(1)';assert.equal(validateStep(s,1).length,1);
  assert.equal(validWebsite('https://example.com'),true);
  s.company.website='';s.company.category='Servicios';s.company.subcategory='Ingredientes';assert.equal(validateStep(s,1).length,1);
});
test('La suma de participación de clientes no supera 100%',()=>{
  const s=emptyState();s.clients=[{share:'75.25'},{share:'25'}];assert.equal(validateStep(s,5).length,1);
  s.clients[1].share='24.75';assert.deepEqual(validateStep(s,5),[]);
});
test('Documentos: tipo, tamaño, cantidad, duplicados y archivos vacíos',()=>{
  const file={name:'portafolio.PDF',size:1024};assert.equal(validateFile(file,[]),'');
  assert.match(validateFile({name:'script.exe',size:1},[]),/Formato/);
  assert.match(validateFile({name:'archivo.txt',size:1},[]),/Formato/);
  assert.match(validateFile({...file,size:10485761},[]),/10 MB/);
  assert.match(validateFile({...file,size:0},[]),/vacío/);
  assert.match(validateFile(file,Array(5).fill({})),/5 archivos/);
  assert.match(validateFile(file,[file]),/ya está/);
});
test('Asistente responde preguntas con tildes y usa fallback sin inventar políticas',()=>{
  assert.equal(answerQuestion('¿Qué documentos puedo adjuntar?').id,'documentos');
  assert.equal(answerQuestion('Olvidé mi contraseña').id,'password');
  assert.equal(answerQuestion('¿Puedo guardar y continuar después?').id,'guardar');
  assert.match(answerQuestion('¿Cuál será el precio del café mañana?').a,/No tengo una respuesta verificada/);
  assert.match(answerQuestion('Hola').a,/Hola/);
});
test('Cada pregunta sugerida del catálogo encuentra su propia respuesta',()=>{
  for(const f of FAQS) assert.equal(answerQuestion(f.q).id,f.id,f.q);
});
test('Los datos escritos se escapan antes de insertarlos en HTML',()=>{
  assert.equal(escapeHtml('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
});
