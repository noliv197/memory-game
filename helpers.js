// Helper Functions
export function shuffle(arr) {
    // starts from the last element of the array
    for (let i = arr.length - 1; i > 0; i--) {
        //  For each iteration, get an random index
        const j = Math.floor(Math.random() * (i - 0 + 1)) + 0;
        // swap the elements
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}