const CORRECT = 'correct';
const OUT_OF_PLACE = 'inword';
const WRONG = 'notinword';

/**
 * Determines which letters in a given guess are correct, which ones are out of place, and which ones are invalid
 * @param {string} solution the target word the player is trying to guess
 * @param {string} guess five-letter guess (presumes the guess has already been through other formatting validations like length and valid characters)
 * @returns {{letter: string, state: CORRECT | OUT_OF_PLACE | WRONG}[]}
 */
export function validateWordleGuess(solution, guess) {
    /**
     * @type {{letter: string, state: CORRECT | OUT_OF_PLACE | WRONG}[]}
     */
    const guessedLetters = guess
        .split('')
        .map(letter => ({letter, state: WRONG}));

    /**
     * @type {{letter: string, includedInGuess: boolean}[]}
     */
    const solutionLetters = solution
        .split('')
        .map(letter => ({letter, includedInGuess: false}));

    // First pass: correct letters in the correct place
    for (let i = 0; i < guessedLetters.length; i++) {
        if (guessedLetters[i].letter === solutionLetters[i].letter) {
            guessedLetters[i].state = CORRECT;
            solutionLetters[i].includedInGuess = true;
        }
    }

    // Second pass: correct letters in the wrong places
    for (let i = 0; i < guessedLetters.length; i++) {
        if (guessedLetters[i].state === CORRECT) {
            continue;
        }

        const letterFoundElsewhere = solutionLetters
            .find((solutionLetter) => {
                const matchesLetter = solutionLetter.letter === guessedLetters[i].letter;
                return matchesLetter && !solutionLetter.includedInGuess;
            });

        if (letterFoundElsewhere) {
            guessedLetters[i].state = OUT_OF_PLACE;
            letterFoundElsewhere.includedInGuess = true;
        }
    }

    return guessedLetters;
}