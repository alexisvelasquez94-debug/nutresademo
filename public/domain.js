export const STEPS = [
  ['Datos generales', 'Tu información básica', 'user'],
  ['Compañía', 'Estructura y actividad', 'building'],
  ['Plantas', 'Ubicación y operación', 'factory'],
  ['Empleados', 'Talento y organización', 'users'],
  ['Mercado', 'Canales y presencia', 'chart'],
  ['Clientes', 'Relaciones comerciales', 'handshake'],
  ['Insumos y negociación', 'Origen y condiciones', 'box'],
  ['Contactos y adjuntos', 'Personas y documentos', 'paperclip'],
];
export const CATEGORIES = {
  'Materias primas': ['Agrícolas', 'Ingredientes', 'Aceites y grasas', 'Lácteos', 'Otras materias primas'],
  'Material de empaque': ['Papel y cartón', 'Plásticos', 'Vidrio', 'Metales', 'Otros empaques'],
  'Materiales indirectos (MRO)': ['Mantenimiento', 'Repuestos', 'Equipos', 'Suministros'],
  'Servicios': ['Logística', 'Tecnología', 'Consultoría', 'Servicios generales', 'Otros servicios'],
};
export const COUNTRIES = ['Colombia', 'México', 'Costa Rica', 'Chile', 'Perú', 'Ecuador', 'Panamá', 'Estados Unidos', 'Brasil', 'Argentina', 'España', 'Otro'];
export function emptyState() {
  return {
    version: 1, step: 0, updatedAt: null, submission: null,
    general: { nit: '', name: '', legalName: '', email: '', country: 'Colombia', dial: '+57', phone: '', consent: false, privacyRead: false },
    company: { exports: 'No', year: '', category: '', subcategory: '', type: '', society: '', description: '', website: '' },
    plants: [], employees: { total: '', research: '' }, market: [], competitors: '', clients: [],
    sourcing: { origin: '', integration: '', projects: '', leadTime: '' }, contacts: [], attachments: [],
  };
}
export function escapeHtml(value = '') { return String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
export function normalize(value = '') { return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim(); }
export const emailValid = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export function validWebsite(value) { if (!value) return true; try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; } }
export function validateStep(s, step) {
  const errors = [];
  const required = (value, message) => { if (!String(value ?? '').trim()) errors.push(message); };
  if (step === 0) {
    if (!/^[\d.\-\s]{5,20}$/.test(s.general.nit) || s.general.nit.replace(/\D/g, '').length < 5) errors.push('Ingresa un NIT válido (números y dígito de verificación).');
    required(s.general.name, 'Ingresa el nombre de la empresa.');
    if (!emailValid(s.general.email)) errors.push('Ingresa un correo electrónico válido.');
    if (s.general.phone && !/^[\d\s()+-]{6,20}$/.test(s.general.phone)) errors.push('Revisa el número de teléfono.');
    if (!s.general.privacyRead || !s.general.consent) errors.push('Lee y acepta el aviso de tratamiento de datos de la demo.');
  }
  if (step === 1) {
    const y = Number(s.company.year);
    if (!Number.isInteger(y) || y < 1800 || y > new Date().getFullYear()) errors.push('Ingresa un año de establecimiento válido.');
    if (!validWebsite(s.company.website)) errors.push('La página web debe comenzar por https:// o http://.');
    if (s.company.subcategory && !CATEGORIES[s.company.category]?.includes(s.company.subcategory)) errors.push('Revisa la subcategoría de la compañía.');
  }
  if (step === 3) {
    const { total, research } = s.employees;
    if (total === '' || !Number.isInteger(Number(total)) || Number(total) < 0) errors.push('Ingresa el total de empleados (cero o un entero positivo).');
    if (research === '' || !Number.isInteger(Number(research)) || Number(research) < 0) errors.push('Ingresa los empleados de I+D (cero o un entero positivo).');
    if (Number(research) > Number(total)) errors.push('El personal de I+D no puede superar el total de empleados.');
  }
  if (step === 5 && s.clients.reduce((sum, c) => sum + Number(c.share), 0) > 100.00001) errors.push('La participación total de los clientes no puede superar el 100 %.');
  return errors;
}
export function isStepComplete(s, i) {
  if (validateStep(s, i).length) return false;
  return [true, true, s.plants.length > 0, true, s.market.length > 0 || !!s.competitors, s.clients.length > 0, !!s.sourcing.origin, s.contacts.length > 0][i];
}
export function validateFile(file, existing, maxCount = 5, maxBytes = 10485760) {
  if (existing.length >= maxCount) return 'Puedes adjuntar hasta 5 archivos.';
  if (!/\.(pdf|jpe?g|png|xlsx)$/i.test(file.name)) return 'Formato no permitido. Usa PDF, JPG, JPEG, PNG o XLSX.';
  if (file.size > maxBytes) return 'El archivo supera los 10 MB.';
  if (file.size === 0) return 'El archivo está vacío.';
  if (existing.some(x => x.name === file.name && x.size === file.size)) return 'Este archivo ya está adjunto.';
  return '';
}
export const FAQS = [
  { id: 'registro', q: '¿Cómo me registro como proveedor?', a: 'Selecciona “Registrar mi empresa” y completa las ocho secciones. Los campos con asterisco son obligatorios. Puedes navegar entre secciones, guardar tu avance y revisar el resumen antes de enviar la demo.', tags: ['registrar','registro','proveedor','empezar','inscribir'], route: 'registro/0' },
  { id: 'documentos', q: '¿Qué documentos puedo adjuntar?', a: 'La demo permite hasta 5 archivos PDF, JPG, JPEG, PNG o Excel XLSX, con un máximo de 10 MB por archivo. Se agregan en “Contactos y adjuntos” y quedan guardados únicamente en este navegador. No hay una lista de documentos obligatorios definida para esta demo.', tags: ['documento','archivo','adjunto','pdf','excel','formato','peso','tamano','10 mb','5 archivos'], route: 'registro/7' },
  { id: 'guardar', q: '¿Puedo continuar el registro después?', a: 'Sí. Usa “Guardar y salir”. El borrador se conserva en el mismo navegador y dispositivo. Al volver, selecciona “Continuar mi registro”. Si borras los datos del navegador, se perderán el borrador y los adjuntos. La demo no sincroniza información entre equipos.', tags: ['guardar','continuar','borrador','despues','retomar','progreso'], route: 'registro' },
  { id: 'login', q: '¿Cómo ingreso a la demo?', a: 'En “Iniciar sesión” encontrarás las credenciales de demostración. Puedes usarlas para ingresar al panel “Mi registro”. El acceso corporativo SSO también es una simulación: no se conecta con cuentas reales de Nutresa.', tags: ['login','sesion','ingresar','acceso','cedula','credenciales','sso','usuario'], route: 'login' },
  { id: 'password', q: '¿Qué hago si olvidé la contraseña?', a: 'Selecciona “¿Olvidaste tu contraseña?” en el login para volver a ver las credenciales públicas de demostración. Esta versión no envía correos de recuperación ni administra contraseñas reales.', tags: ['contrasena','clave','olvide','olvidado','recuperar'], route: 'login' },
  { id: 'nit', q: '¿Qué debo escribir en el NIT?', a: 'Ingresa el número de identificación tributaria de tu empresa, incluido su dígito de verificación cuando corresponda. El campo acepta números, puntos y guiones. Para probar usa datos ficticios, por ejemplo 900123456-7.', tags: ['nit','tributaria','identificacion','digito'], route: 'registro/0' },
  { id: 'plantas', q: '¿Puedo registrar varias plantas o sedes?', a: 'Sí. En “Plantas” puedes agregar, editar y eliminar varias sedes con su nombre, país, ciudad y dirección. También puedes usar esta sección para registrar el domicilio fiscal.', tags: ['planta','sede','domicilio','fiscal','direccion'], route: 'registro/2' },
  { id: 'clientes', q: '¿Cómo registro mis clientes y canales de venta?', a: 'En “Mercado” agrega cada canal y su valor de ventas, indicando la moneda. En “Clientes” agrega tus principales clientes y su participación porcentual. La suma de las participaciones no puede superar el 100 %.', tags: ['cliente','canal','mercado','ventas','porcentaje','participacion'], route: 'registro/5' },
  { id: 'envio', q: '¿Qué ocurre al enviar el formulario?', a: 'La demo valida los datos obligatorios y genera una constancia local con un número de referencia. No envía información a Servicios Nutresa ni representa una aprobación como proveedor. Puedes descargar el resumen en JSON desde “Mi registro”.', tags: ['enviar','envio','aprobacion','aprobado','estado','solicitud','respuesta','plazo','radicado'], route: 'mi-registro' },
  { id: 'privacidad', q: '¿Dónde se guarda mi información?', a: 'El formulario se guarda localmente en tu navegador y los adjuntos en su almacenamiento de archivos. Esta demo no transmite tus datos a Nutresa ni a un servicio de inteligencia artificial. Usa solo información ficticia. Puedes borrar los datos desde “Mi registro”.', tags: ['privacidad','datos','seguridad','habeas','almacenamiento','borrar','eliminar'], route: 'mi-registro' },
  { id: 'categorias', q: '¿Qué categorías de proveedores puedo seleccionar?', a: 'La demo incluye materias primas, material de empaque, materiales indirectos (MRO) y servicios. Las subcategorías son ilustrativas y se muestran según la categoría elegida en “Compañía”.', tags: ['categoria','materia','empaque','mro','servicio','producto','compania'], route: 'registro/1' },
  { id: 'ayuda', q: '¿Cómo puedo solicitar ayuda?', a: 'Puedes consultar las preguntas frecuentes o preguntar aquí sobre el uso de la demo. Este asistente no consulta solicitudes reales ni conecta con un asesor. El canal oficial de soporte debe configurarse antes de utilizar el portal en producción.', tags: ['ayuda','soporte','contactar','asesor','humano','telefono','correo'], route: 'ayuda' },
];
export function answerQuestion(question) {
  const q = normalize(question);
  const exact = FAQS.find(f => normalize(f.q) === q);
  if (exact) return exact;
  if (/^(hola|buenas|buenos dias|buenas tardes|buenas noches|gracias)$/.test(q)) return { a: '¡Hola! Soy tu asistente del portal. Puedo ayudarte con el registro, los documentos, el acceso y el guardado de tu información de demostración.' };
  const words = q.split(' ');
  const matches = FAQS.map(f => ({ f, score: f.tags.reduce((sum, tag) => sum + (tag.includes(' ') ? q.includes(tag) : words.some(w => w === tag || (tag.length > 4 && w.startsWith(tag)))) * 2, 0) })).sort((a,b) => b.score-a.score);
  return matches[0]?.score > 0 ? matches[0].f : { a: 'No tengo una respuesta verificada para esa pregunta. Puedo ayudarte con el registro, archivos, acceso o guardado de la demo. Consulta las preguntas frecuentes para ver los temas disponibles; no tengo acceso a información interna de Nutresa.', route: 'ayuda' };
}
