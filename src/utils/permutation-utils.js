/**
 * Not my code. Based on Dustenfield shuffle algorithm
 * Required as part of ensuring no player receives their own target word
 * @author https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
module.exports = function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
