import './ui/styles.css';
import { App } from './app/App';

const stage = document.getElementById('stage');
const hud = document.getElementById('hud');
if (!stage || !hud) {
  throw new Error('Structure HTML attendue introuvable (#stage / #hud).');
}

const app = new App(stage, hud);
app.start();

// Debug/automation handle (harmless global; also used by the guided tour).
(window as unknown as { __PASCALINE__: App }).__PASCALINE__ = app;
