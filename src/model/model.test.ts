import { describe, it, expect } from 'vitest';
import { PascalineModel } from './PascalineModel';
import { isAdvance, isCarry, isOverflow, type Step } from './steps';

const countBy = (steps: Step[], type: Step['type']) =>
  steps.filter((s) => s.type === type).length;

describe('PascalineModel — état initial', () => {
  it('démarre à zéro', () => {
    const m = new PascalineModel();
    expect(m.count).toBe(6);
    expect(m.value()).toBe(0);
    expect(m.format()).toBe('000000');
    expect(m.read()).toEqual([0, 0, 0, 0, 0, 0]);
  });
});

describe('PascalineModel — addition simple sans retenue', () => {
  it('rotate(0, 3) => 3', () => {
    const m = new PascalineModel();
    const steps = m.rotate(0, 3);
    expect(m.value()).toBe(3);
    expect(steps).toHaveLength(3);
    expect(steps.every(isAdvance)).toBe(true);
    expect(steps.some((s) => isAdvance(s) && s.crossedZero)).toBe(false);
  });
});

describe('PascalineModel — 9 + 1 (une retenue)', () => {
  it('propage vers les dizaines', () => {
    const m = new PascalineModel();
    m.setValue(9);
    const steps = m.rotate(0, 1);

    expect(m.value()).toBe(10);
    expect(m.format()).toBe('000010');

    // advance p0 9->0 (cross) · carry 0->1 · advance p1 0->1
    expect(steps).toHaveLength(3);
    expect(steps[0]).toEqual({ type: 'advance', pos: 0, from: 9, to: 0, crossedZero: true });
    expect(steps[1]).toEqual({ type: 'carry', from: 0, to: 1 });
    expect(steps[2]).toEqual({ type: 'advance', pos: 1, from: 0, to: 1, crossedZero: false });
  });
});

describe('PascalineModel — 99 + 1 (retenue en cascade)', () => {
  it('donne 100 avec deux retenues ordonnées', () => {
    const m = new PascalineModel();
    m.setValue(99);
    const steps = m.rotate(0, 1);

    expect(m.value()).toBe(100);
    expect(countBy(steps, 'advance')).toBe(3); // p0, p1, p2
    expect(countBy(steps, 'carry')).toBe(2); // 0->1, 1->2
    expect(countBy(steps, 'overflow')).toBe(0);

    const carries = steps.filter(isCarry);
    expect(carries[0]).toEqual({ type: 'carry', from: 0, to: 1 });
    expect(carries[1]).toEqual({ type: 'carry', from: 1, to: 2 });
  });
});

describe('PascalineModel — 999999 + 1 (débordement)', () => {
  it('boucle à 000000 et émet un overflow', () => {
    const m = new PascalineModel();
    m.setValue(999999);
    const steps = m.rotate(0, 1);

    expect(m.value()).toBe(0);
    expect(m.format()).toBe('000000');

    expect(countBy(steps, 'advance')).toBe(6); // toutes les roues
    expect(countBy(steps, 'carry')).toBe(6); // 0->1 … 5->6
    expect(countBy(steps, 'overflow')).toBe(1);
    expect(steps[steps.length - 1]).toEqual({ type: 'overflow' });
    expect(steps.some(isOverflow)).toBe(true);
  });
});

describe('PascalineModel — addition sur une roue de rang supérieur', () => {
  it('rotate(2, 1) ajoute 100', () => {
    const m = new PascalineModel();
    m.setValue(1250);
    m.rotate(2, 1);
    expect(m.value()).toBe(1350);
  });
});

describe('PascalineModel — setValue / format', () => {
  it('encode correctement en little-endian', () => {
    const m = new PascalineModel();
    m.setValue(42);
    expect(m.read()).toEqual([2, 4, 0, 0, 0, 0]); // index 0 = unités
    expect(m.format()).toBe('000042');
  });
});

describe('PascalineModel — propriété : additions aléatoires', () => {
  it('équivaut à (somme) mod 10^6 sur 10 000 tirages', () => {
    const m = new PascalineModel();
    const mod = m.modulus();
    let expected = 0;
    for (let i = 0; i < 10_000; i++) {
      const pos = Math.floor(Math.random() * m.count);
      const notches = Math.floor(Math.random() * 10);
      m.rotate(pos, notches);
      expected = (expected + notches * 10 ** pos) % mod;
      expect(m.value()).toBe(expected);
    }
  });
});
