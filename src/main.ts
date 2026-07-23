import './ui/styles.css';
import { SceneManager } from './scene/SceneManager';

const stage = document.getElementById('stage');
if (!stage) {
  throw new Error('Élément #stage introuvable dans le document.');
}

const app = new SceneManager(stage);
app.start();
