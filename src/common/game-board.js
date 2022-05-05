const EmojiStringFactory = require('../utils/emoji-string-factory')
const GameConfig = require('../config/game-config')
/**
 * Class that handles the Diskordle game board that players interact with. Updates its appearance (rendered board state)
 * based on incoming words from users.
 *
 * @author Alex Carney
 */

//alphabet from https://ourcodeworld.com/articles/read/1458/how-to-print-the-alphabet-with-javascript
const alphabet = String.fromCharCode(...Array(123).keys()).slice(97)
module.exports = class GameBoard {
    BOARD_WIDTH = 5
    BOARD_HEIGHT = 6

    /**
     * Instantiates a new game board, which represents a Diskordle game player's current efforts at finding their word
     * @param interaction
     * @param targetWord
     */
    constructor(interaction, targetWord) {
        this.interaction = interaction
        this.targetWord = targetWord
        this.boardState = this._initializeBoard()
        this.guessNum = 0;
        this.playingState = GameBoard.playingStates.IN_PLAY
        this.letterColors = this._initializeKeyboard()
    }

    /**
     *
     * @returns {string[][]}
     * @private
     */
    _initializeBoard() {
        // Adapted from https://stackoverflow.com/questions/53992415/how-to-fill-multidimensional-array-in-javascript
        return Array.from({length: this.BOARD_HEIGHT}, () => (
            Array.from({length: this.BOARD_WIDTH}, () => ':white_large_square:')
        ))
    }

    /**
     *
     * @returns {Map<any, any>}
     * @private
     */
    _initializeKeyboard() {
        const colors = new Map()
        alphabet.split('').forEach((letter) => {
            colors.set(letter, GameConfig.letterColorNotInWord)
        })
        return colors
    }

    /**
     * Nicely formats the board state for display to player
     * Tried using .reduce originally, but it didn't work as expected due to multidimensional array
     * @returns {string}
     */
    renderBoard() {
        let str = ""
        for (let item of this.boardState) {
            if (Array.isArray(item)) {
                str += item.join(' ') + "\n"
            }
        }
        return str
    }

    /**
     * Compares a validated input word to this board's solution. Updates the board accordingly, returns the result
     * @param guessWord Validated input word
     * @returns {string} Rendered form of game board
     */
    guessWord(guessWord) {
        guessWord = guessWord.toLowerCase()
        if (guessWord === this.targetWord) {
            this.playingState = GameBoard.playingStates.WON
        } else if (this.guessNum === this.BOARD_HEIGHT - 1) {
            this.playingState = GameBoard.playingStates.LOST
        }
        //Render the board no matter what. Game outcomes are handled by word.js
        this._determineWordResponse(guessWord)
        this.guessNum++
        return this.renderBoard()
    }

    /**
     * Updates the game board state with the proper string consisting of different color emojis based on
     * validity of input word with regards to solution
     *
     * I needed some help with this method when it came to handling duplicate letters. After a few attempts, I couldn't
     * get duplicates to work exactly like they do in Wordle, so I took some inspiration from the 'wordle_archive'
     * project
     *
     * @author Alex Carney, with some help from https://github.com/DevangThakkar/wordle_archive
     * @param guessWord
     */
    _determineWordResponse(guessWord) {
        const guessLetters = guessWord.split('')
        const answerLetters = this.targetWord.split('')

        // Assume all letters are incorrect first, then change to green and yellow
        guessLetters.forEach((letter, index) => {
            this.boardState[this.guessNum][index] =
                EmojiStringFactory(
                    this.interaction,
                    letter,
                    GameConfig.letterColorNotInWord
                )
            if(this.letterColors.get(letter) === GameConfig.letterColorNotInWord) {
                this.letterColors.set(letter, GameConfig.letterColorKeyboardDontUse)
            }
        })

        // First, determine all GREEN squares. These are duplicate-invariant
        guessLetters.forEach((letter, index) => {
            if (letter === this.targetWord[index]) {
                this.boardState[this.guessNum][index] =
                    EmojiStringFactory(
                        this.interaction,
                        letter,
                        GameConfig.letterColorCorrectSpot
                    )
                // DELETE this letter to account for duplicates
                // let removed = answerLetters.splice(index, 1)
                answerLetters[index] = '-1'
                this.letterColors.set(letter,GameConfig.letterColorCorrectSpot)
            }
        })

        // Next, determine all YELLOW squares.
        guessLetters.forEach((letter, index) => {
            if (answerLetters.includes(letter)
                && !this.boardState[this.guessNum][index].includes('green')) {
                this.boardState[this.guessNum][index] =
                    EmojiStringFactory(
                        this.interaction,
                        letter,
                        GameConfig.letterColorContainedInWord
                    )
                // The yellow letter is somewhere in the word. Account for that, then
                // remove wherever it is
                //answerLetters.splice(answerLetters.indexOf(letter), 1)
                answerLetters[answerLetters.indexOf(letter)] = '-1'
                // Don't overwrite a green keyboard with red
                if(this.letterColors.get(letter) !== GameConfig.letterColorCorrectSpot) {
                    this.letterColors.set(letter, GameConfig.letterColorContainedInWord)
                }
            }
        })
    }


    static playingStates = Object.freeze({
        IN_PLAY: 'IN_PLAY',
        LOST: 'LOST',
        WON: 'WON',
    })


}
