import './ui/styles.css';
import { App } from './app/App';

const stage = document.getElementById('stage');
const hud = document.getElementById('hud');
const panel = document.getElementById('panel');
if (!stage || !hud || !panel) {
  throw new Error('Structure HTML attendue introuvable (#stage / #hud / #panel).');
}

const app = new App(stage, hud, panel);
app.start();

// Debug/automation handle (harmless global; also used by the guided tour).
(window as unknown as { __PASCALINE__: App }).__PASCALINE__ = app;
