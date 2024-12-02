export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface NamedAPIResourceList {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

export interface APIResource {
  url: string;
}

/**
 * The localized name for an API resource in a specific language
 */
export interface Name {
  /** The localized name for an API resource in a specific language */
  name: string;
  /** The language this name is in */
  language: NamedAPIResource;
}

/**
 * The internal id and version of an API resource
 */
export interface VersionGameIndex {
  /** The internal id of an API resource within game data */
  game_index: number;
  /** The version relevent to this game index */
  version: NamedAPIResource;
}

/**
 * The localized flavor text for an API resource in a specific language
 */
export interface FlavorText {
  /** The localized flavor text for an API resource in a specific language */
  flavor_text: string;
  /** The language this name is in */
  language: NamedAPIResource;
  /** The game version this flavor text appears in */
  version: NamedAPIResource;
}

/**
 * The localized description for an API resource in a specific language
 */
export interface Description {
  /** The localized description for an API resource in a specific language. */
  description: string;
  /** The language this name is in */
  language: NamedAPIResource;
}
