/**
 * Shareable URL handling. URLs may only carry allowed enum values (scenario
 * IDs, layer/persona/environment/mobility/mechanism IDs); anything else is
 * ignored on parse. No free text, personal data, or secrets ever enter URLs.
 */
import {
  ENVIRONMENT_IDS,
  LAYER_IDS,
  MECHANISMS,
  MOBILITY_IDS,
  type EnvironmentId,
  type LayerId,
  type Mechanism,
  type MobilityId,
} from './types';

export interface ShareParams {
  layers?: LayerId[];
  personas?: string[];
  env?: EnvironmentId;
  mobility?: MobilityId;
  mechanism?: Mechanism;
}

const ALLOWED_PERSONAS = ['explorer', 'critic', 'synthesizer', 'conservator', 'auditor'];

export function encodeSelection(params: ShareParams): string {
  const qs = new URLSearchParams();
  if (params.layers?.length) qs.set('layers', params.layers.join(','));
  if (params.personas?.length) qs.set('personas', params.personas.join(','));
  if (params.env) qs.set('env', params.env);
  if (params.mobility) qs.set('m', params.mobility);
  if (params.mechanism) qs.set('mech', params.mechanism);
  return qs.toString();
}

/** Parse and whitelist-validate. Returns only allowed values. */
export function parseSelection(search: string): ShareParams {
  const qs = new URLSearchParams(search);
  const out: ShareParams = {};

  const layers = (qs.get('layers') ?? '')
    .split(',')
    .filter((v): v is LayerId => (LAYER_IDS as string[]).includes(v));
  if (layers.length) out.layers = layers;

  const personas = (qs.get('personas') ?? '').split(',').filter((v) => ALLOWED_PERSONAS.includes(v));
  if (personas.length) out.personas = personas;

  const env = qs.get('env');
  if (env && (ENVIRONMENT_IDS as string[]).includes(env)) out.env = env as EnvironmentId;

  const mobility = qs.get('m');
  if (mobility && (MOBILITY_IDS as string[]).includes(mobility)) out.mobility = mobility as MobilityId;

  const mechanism = qs.get('mech');
  if (mechanism && (MECHANISMS as string[]).includes(mechanism)) out.mechanism = mechanism as Mechanism;

  return out;
}

export function copyShareUrl(search: string): Promise<string> {
  const base = `${window.location.origin}${window.location.pathname}`;
  const url = search ? `${base}?${search}` : base;
  return navigator.clipboard
    .writeText(url)
    .then(() => url)
    .catch(() => url);
}
