import { CONFIG } from './config.js';
import { emptyState } from './domain.js';
export function loadState() {
  const raw = localStorage.getItem(CONFIG.storageKey);
  if (!raw) return emptyState();
  const saved = JSON.parse(raw);
  if (saved.version !== 1) throw new Error('La versión del borrador no es compatible.');
  const base = emptyState();
  for (const k of ['general','company','employees','sourcing']) base[k] = { ...base[k], ...saved[k] };
  for (const k of ['plants','market','clients','contacts','attachments']) { if (!Array.isArray(saved[k])) throw new Error('El borrador está incompleto.'); base[k] = saved[k]; }
  for (const k of ['step','updatedAt','submission','competitors']) if (saved[k] !== undefined) base[k] = saved[k];
  return base;
}
export function saveState(state) { state.updatedAt = new Date().toISOString(); localStorage.setItem(CONFIG.storageKey, JSON.stringify(state)); }
export function getSession() { try { return JSON.parse(sessionStorage.getItem(CONFIG.sessionKey)); } catch { return null; } }
export function setSession(session) { sessionStorage.setItem(CONFIG.sessionKey, JSON.stringify(session)); }
export function clearSession() { sessionStorage.removeItem(CONFIG.sessionKey); }
let database;
function db() {
  if (!database) database = new Promise((resolve, reject) => {
    const req = indexedDB.open(CONFIG.fileDatabase, 1);
    req.onupgradeneeded = () => req.result.createObjectStore('files', { keyPath: 'id' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => { database = undefined; reject(req.error); };
  });
  return database;
}
async function transact(mode, action) {
  const database = await db();
  return new Promise((resolve, reject) => {
    const tx = database.transaction('files', mode);
    const req = action(tx.objectStore('files'));
    tx.oncomplete = () => resolve(req.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Operación cancelada.'));
  });
}
export const putFile = (id, file) => transact('readwrite', store => store.put({ id, file }));
export const getFile = id => transact('readonly', store => store.get(id));
export const deleteFile = id => transact('readwrite', store => store.delete(id));
export const clearFiles = () => transact('readwrite', store => store.clear());
