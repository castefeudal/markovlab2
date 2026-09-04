// Single source of truth for release metadata.
// Every versioned artifact (cache-busting query, SW cache name, manifests)
// is generated from this file — never hand-edit versions in multiple places.
export const RELEASE = {
  version: '6.0.0',
  revision: 'r2',
  /** Cache-busting query appended to runtime module/CSS imports. */
  get bust() { return `v=${this.version}-${this.revision}`; },
  /** Service-worker cache namespace (fork-isolated: markovlab2-*). */
  get cache() { return `markovlab2-v${this.version}-${this.revision}`; },
  productionBaseUrl: 'https://castefeudal.github.io/markovlab2',
  storageSchema: 4
};
export const RELEASE_CONFIG = { version: RELEASE.version, productionBaseUrl: RELEASE.productionBaseUrl };
