/* tslint:disable */
/* eslint-disable */
/**
* @returns {any}
*/
export function wasm_memory(): any;
/**
*/
export enum CellType {
  Empty = 0,
  Attacker = 1,
  Defender = 2,
  King = 3,
}
/**
*/
export class Hnefatafl {
  free(): void;
/**
* @returns {Hnefatafl}
*/
  static new(): Hnefatafl;
/**
* @returns {number}
*/
  width(): number;
/**
* @returns {number}
*/
  height(): number;
/**
*/
  reset(): void;
/**
* @returns {boolean}
*/
  is_black_to_play(): boolean;
/**
*/
  copy_board_to_local(): void;
/**
* @returns {number}
*/
  tiles(): number;
/**
* @returns {string}
*/
  get_board(): string;
/**
* @returns {string}
*/
  render(): string;
/**
* @param {number} from_x
* @param {number} from_y
* @param {number} to_x
* @param {number} to_y
* @returns {string}
*/
  move_piece(from_x: number, from_y: number, to_x: number, to_y: number): string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_hnefatafl_free: (a: number) => void;
  readonly hnefatafl_new: () => number;
  readonly hnefatafl_height: (a: number) => number;
  readonly hnefatafl_reset: (a: number) => void;
  readonly hnefatafl_is_black_to_play: (a: number) => number;
  readonly hnefatafl_copy_board_to_local: (a: number) => void;
  readonly hnefatafl_tiles: (a: number) => number;
  readonly hnefatafl_get_board: (a: number, b: number) => void;
  readonly hnefatafl_move_piece: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly hnefatafl_width: (a: number) => number;
  readonly hnefatafl_render: (a: number, b: number) => void;
  readonly wasm_memory: () => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
