/**
 * A set of types for data kept in the store and data derived thereof.
 *
 * @module types
 */

import { Address, Hash } from "src/chain"

// =================================================================================================
// GAME-SPECIFIC TYPES

// -------------------------------------------------------------------------------------------------

export type Card = {
  id: bigint
  lore: {
    name: string,
    flavor: string,
    URL: string
  }
  stats: {
    attack: number
    defense: number
  }
}

// -------------------------------------------------------------------------------------------------

export enum GameStep {
  UNINITIALIZED,
  DRAW,
  PLAY,
  ATTACK,
  DEFEND,
  PASS
}

// -------------------------------------------------------------------------------------------------

export type PlayerData = {
  health: number
  deckStart: number
  deckEnd: number
  handRoot: Hash
  deckRoot: Hash
  // Bitfield of cards in the player's battlefield, for each bit: 1 if the card at the same
  // index as the bit in `GameData.cards` is on the battlefield, 0 otherwise.
  battlefield: bigint
  // Bitfield of cards in the player's graveyard (same thing as `battlefield`).
  graveyard: bigint
  attacking: readonly number[]
}

// -------------------------------------------------------------------------------------------------

export type FetchedGameData = {
  gameID: bigint
  gameCreator: Address
  players: readonly Address[]
  playerData: readonly PlayerData[]
  lastBlockNum: bigint
  publicRandomness: bigint
  playersLeftToJoin: number
  livePlayers: readonly number[]
  currentPlayer: number
  currentStep: GameStep
  attackingPlayer: Address
  /**
   * Array of cards involved in the game, only included if requested, otherwise empty.
   */
  cards: readonly bigint[]
}

// -------------------------------------------------------------------------------------------------

/**
 * Represent major phases of the game setup and breakdown, relative to the current player.
 */
export enum GameStatus {
  /** Default value, for use with missing game data. */
  UNKNOWN,
  /** The game has been created, but the player hasn't joined yet. */
  CREATED,
  /** The player joined the game. */
  JOINED,
  /** The player has drawn their initial hand. */
  HAND_DRAWN,
  /** The game has started (all players have drawn their initial hand. */
  STARTED,
  /** The game has ended (only one player left standing). */
  ENDED
}

// -------------------------------------------------------------------------------------------------

/**
 * The player's private info, i.e., his secret salt, the cards currently in their hand, as well as
 * the current ordering of their deck as per updating rules after drawing cards.
 *
 * This information cannot be derived from on-chain data.
 */
export type PrivateInfo = {
  /** The player's secret salt, necessary to hide information. */
  salt: bigint
  /** MimcHash of {@link salt}. */
  saltHash: bigint
  /** The player's current hand. */
  hand: readonly bigint[]
  /** The player's current deck ordering. */
  deck: readonly bigint[]
  /** Merkle root of {@link hand}. */
  handRoot: Hash
  /** Merkle root of {@link deck}. */
  deckRoot: Hash
}

// -------------------------------------------------------------------------------------------------

/**
 * For storing {@link PrivateInfo} in local storage, keyed by gameID (stringified) and player.
 */
export type PrivateInfoStore = {
  [gameID: string]: { [player: Address]: PrivateInfo }
}

// -------------------------------------------------------------------------------------------------

/**
 * Public view of the game board, derived from {@link FetchedGameData}.
 */
export type GameBoard = {
  /**
   * Cards in each player's graveyard in the game.
   * Players are ordered as in {@link FetchedGameData.players}.
   */
  graveyard: bigint[][]
  /**
   * Cards on the battlefield, under the control of each player.
   * Players are ordered as in {@link FetchedGameData.players}.
   */
  battlefield: bigint[][]
}

// =================================================================================================
// UI-RELATED TYPES

// -------------------------------------------------------------------------------------------------

/** This configure the global error modal to display an error message. */
export type ErrorConfig = {
  title: string
  message: string
  buttons: readonly {
    text: string
    onClick: () => void
  }[]
}

// =================================================================================================