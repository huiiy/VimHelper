console.log("VimHelper is up and running! (v4 - with getComputedStyle)");

let keypressHistory = "";
const MOTION_THRESHOLD = 3; // Trigger suggestion after 3 repeated keys

/**
 * Checks the keypress history for inefficient patterns and updates the suggestion box.
 */
function checkForInefficientMotion() {
    if (keypressHistory.length < MOTION_THRESHOLD) {
        return;
    }

    const lastChar = keypressHistory.slice(-1);
    // Check if the last N characters are all the same
    if (keypressHistory === lastChar.repeat(MOTION_THRESHOLD)) {
        let suggestion = "";
        switch (lastChar) {
            case "h":
                suggestion = `Try using 'b' to move back a word or '0' to go to the start of the line.`;
                break;
            case "j":
                suggestion = `Consider using '}' to jump to the next paragraph or a specific line number with 'G'.`;
                break;
            case "k":
                suggestion = `Consider using '{' to jump to the previous paragraph or a specific line number with 'G'.`;
                break;
            case "l":
                suggestion = `Try using 'w' to move to the next word, 'e' to the end of the word, or '$' to the end of the line.`;
                break;
            default:
                return;
        }

        const suggestionContent = document.querySelector("#vim-helper-content");
        if (suggestionContent) {
            console.log(`Suggestion: Inefficient motion detected ('${keypressHistory}'). Updating dialog box.`);
            suggestionContent.innerHTML = `<p style='color: #D9534F;'><strong>Inefficient Motion:</strong> ${keypressHistory}</p><p>${suggestion}</p>`;
        }
        keypressHistory = ""; // Reset after showing a suggestion
    }
}

/**
 * Creates the suggestion box UI.
 */
function createSuggestionBox() {
    if (document.getElementById("vim-helper-suggestion-box")) return;

    const suggestionBox = document.createElement("div");
    suggestionBox.id = "vim-helper-suggestion-box";
    suggestionBox.style.cssText = 'position: fixed; top: 5vh; right: 5vw; width: 25vw; min-height: 100px; padding: 10px; background-color: rgba(255, 255, 255, 0.9); border: 1px solid #ccc; border-radius: 8px; z-index: 9999; color: #000; box-shadow: 0 4px 8px rgba(0,0,0,0.2); resize: both; overflow: auto;';

    suggestionBox.innerHTML = `
    <h3 id="vim-helper-drag-handle" style="margin:-10px -10px 10px -10px; padding:10px; color: #000; border-bottom:1px solid #ccc; cursor: move;">VimHelper Suggestions</h3>
    <div id="vim-helper-content">
        <p>Suggestions will appear here when inefficient motions are detected.</p>
    </div>
  `;
    document.body.appendChild(suggestionBox);

    // Drag and drop functionality
    const dragHandle = document.getElementById("vim-helper-drag-handle");
    let isDragging = false,
        offsetX, offsetY;

    dragHandle.addEventListener("mousedown", (e) => {
        isDragging = true;
        const rect = suggestionBox.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        suggestionBox.style.transition = 'none';
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            suggestionBox.style.left = `${e.clientX - offsetX}px`;
            suggestionBox.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        suggestionBox.style.transition = 'top 0.3s ease, left 0.3s ease';
    });
}


// --- Main Execution ---
setTimeout(() => {
    const editor = document.querySelector('.monaco-editor');
    if (!editor) {
        console.error("VimHelper Error: Monaco editor not found.");
        return;
    }

    createSuggestionBox();

    editor.addEventListener('keydown', (e) => {
        const cursor = editor.querySelector('.cursor');
        if (!cursor || e.key.length > 1) { // Ignore non-character keys (like Shift, Ctrl, etc.)
            return;
        }

        // Use getComputedStyle for a reliable way to get the rendered width
        const computedStyle = window.getComputedStyle(cursor);
        const cursorWidth = parseInt(computedStyle.width, 10);

        console.log(`Key pressed: ${e.key}, Cursor width: ${cursorWidth}px`);

        // Normal mode cursor is wide (>5px), Insert mode is narrow (<3px).
        const isNormalMode = cursorWidth > 5;

        if (isNormalMode) {
            keypressHistory += e.key;
            // Trim history to the required length
            if (keypressHistory.length > MOTION_THRESHOLD) {
                keypressHistory = keypressHistory.slice(1);
            }
            console.log(`Normal Mode Detected. History: "${keypressHistory}"`);
            checkForInefficientMotion();
        } else {
            // If we are not in normal mode, clear the history.
            keypressHistory = "";
        }
    }, true); // Use capture phase to get the event early

}, 2000);
