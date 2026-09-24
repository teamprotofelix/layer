import { describe, expect, it } from 'vitest';
import { encodeSelection, parseSelection, type ShareParams } from '../src/lib/share';

describe('share URL — allowed enum values only', () => {
  it('round-trips valid values', () => {
    const params: ShareParams = {
      layers: ['L0', 'L3', 'L5'],
      personas: ['explorer', 'critic'],
      env: 'B',
      mobility: 'M2',
      mechanism: 'CRIU',
    };
    const encoded = encodeSelection(params);
    expect(parseSelection(`?${encoded}`)).toEqual({
      layers: ['L0', 'L3', 'L5'],
      personas: ['explorer', 'critic'],
      env: 'B',
      mobility: 'M2',
      mechanism: 'CRIU',
    });
  });

  it('rejects unknown layers, personas, envs, mobility, mechanisms', () => {
    const parsed = parseSelection(
      '?layers=L9,L0&personas=hacker,explorer&env=Z&m=M9&mech=EVIL',
    );
    expect(parsed.layers).toEqual(['L0']);
    expect(parsed.personas).toEqual(['explorer']);
    expect(parsed.env).toBeUndefined();
    expect(parsed.mobility).toBeUndefined();
    expect(parsed.mechanism).toBeUndefined();
  });

  it('ignores arbitrary free text', () => {
    const parsed = parseSelection('?env=alert(1)&layers=%3Cscript%3E&extra=stuff');
    expect(parsed.env).toBeUndefined();
    expect(parsed.layers).toBeUndefined();
  });

  it('returns empty params for empty input', () => {
    expect(parseSelection('')).toEqual({});
  });
});
