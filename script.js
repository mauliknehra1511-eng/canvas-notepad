const canvas = document.getElementById('typeCanvas');
const ctx = canvas.getContext('2d');


// --------------------------------------------------
// 2. Text editor settings
// --------------------------------------------------

const fontSize = 32;
const fontFamily = 'monospace';

const startX = 40;       // Where text starts horizontally
const startY = 50;       // Baseline of the first line
const lineHeight = 42;   // Distance between lines

const cursorWidth = 4;
const cursorHeight = 32;
const cursorGap = 4;


// --------------------------------------------------
// 3. Store the text as separate lines
// --------------------------------------------------

let lines = [''];

// Which line the cursor is currently on
let currentLine = 0;

// Was the previous key Enter?
let previousWasEnter = false;


// --------------------------------------------------
// 4. Render the canvas
// --------------------------------------------------

function renderCanvas() {

    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set text appearance
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = '#000000.';

    // ----------------------------------------------
    // Draw every line
    // ----------------------------------------------

    for (let i = 0; i < lines.length; i++) {

        const y = startY + i * lineHeight;

        ctx.fillText(lines[i], startX, y);
    }


    // ----------------------------------------------
    // Calculate cursor position
    // ----------------------------------------------

    const currentText = lines[currentLine];

    // How wide is the current line?
    const textMetrics = ctx.measureText(currentText);

    // Cursor X position
    const cursorX =
        startX +
        textMetrics.width +
        cursorGap;

    // Cursor Y position
    const cursorY =
        startY -
        fontSize +
        4 +
        currentLine * lineHeight;


    // ----------------------------------------------
    // Draw cursor
    // ----------------------------------------------

    ctx.fillRect(
        cursorX,
        cursorY,
        cursorWidth,
        cursorHeight
    );
}


// --------------------------------------------------
// 5. Automatically wrap text
// --------------------------------------------------

function checkForWrap() {

    const currentText = lines[currentLine];

    const textMetrics = ctx.measureText(currentText);

    const availableWidth =
        canvas.width - startX - 20;


    // If the line is too wide...
    if (textMetrics.width > availableWidth) {

        // Remove the last character
        const overflowingCharacter =
            lines[currentLine].slice(-1);

        lines[currentLine] =
            lines[currentLine].slice(0, -1);


        // Create a new line
        lines.splice(currentLine + 1, 0, overflowingCharacter);

        // Move cursor to new line
        currentLine++;
    }
}


// --------------------------------------------------
// 6. Keyboard event handling
// --------------------------------------------------

window.addEventListener('keydown', (e) => {

    // ----------------------------------------------
    // BACKSPACE
    // ----------------------------------------------

    if (e.key === 'Backspace') {

        e.preventDefault();


        // If we're at the beginning of a line
        if (lines[currentLine].length === 0) {

            // If there is a previous line
            if (currentLine > 0) {

                // Move to previous line
                currentLine--;

            }

        } else {

            // Remove last character
            lines[currentLine] =
                lines[currentLine].slice(0, -1);
        }


        previousWasEnter = false;

        renderCanvas();

        return;
    }


    // ----------------------------------------------
    // ENTER
    // ----------------------------------------------

    if (e.key === 'Enter') {

        e.preventDefault();


        // ------------------------------------------
        // Second consecutive Enter
        // ------------------------------------------

        if (previousWasEnter) {

            // Remove the space that was added
            // by the first Enter
            lines[currentLine] =
                lines[currentLine].replace(/\s$/, '');


            // Create a new line
            lines.splice(currentLine + 1, 0, '');

            // Move cursor to the new line
            currentLine++;
        }


        // ------------------------------------------
        // First Enter
        // ------------------------------------------

        else {

            // Treat a single Enter as a space
            lines[currentLine] += ' ';
        }


        previousWasEnter = true;

        renderCanvas();

        return;
    }


    // ----------------------------------------------
    // Printable characters
    // ----------------------------------------------

    if (e.key.length === 1) {

        lines[currentLine] += e.key;

        previousWasEnter = false;

        // Check whether the line became too wide
        checkForWrap();

        renderCanvas();

        return;
    }


    // ----------------------------------------------
    // Any other key
    // ----------------------------------------------

    previousWasEnter = false;
});


// --------------------------------------------------
// 7. Initial drawing
// --------------------------------------------------

renderCanvas();