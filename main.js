console.log("The extension is up and running");

// Function to create and display the suggestion box
function createSuggestionBox() {
  const suggestionBox = document.createElement("div");
  suggestionBox.id = "vim-helper-suggestion-box";

  // Apply dynamic and interactive styles
  suggestionBox.style.position = "fixed";
  suggestionBox.style.top = "5vh";
  suggestionBox.style.right = "5vw";
  suggestionBox.style.width = "25vw";
  suggestionBox.style.height = "30vh";
  suggestionBox.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
  suggestionBox.style.border = "2px solid #ccc";
  suggestionBox.style.borderRadius = "8px";
  suggestionBox.style.padding = "10px";
  suggestionBox.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  suggestionBox.style.zIndex = "9999";
  suggestionBox.style.resize = "both";
  suggestionBox.style.overflow = "auto";
  suggestionBox.style.minWidth = "10px"; // Prevents the box from being resized too small
  suggestionBox.style.minHeight = "10px"; // Prevents the box from being resized too small
  suggestionBox.style.color = "#000"

  // Add the drag handle and content
  suggestionBox.innerHTML = `
    <h3 id="vim-helper-drag-handle" style="cursor: move; color: #000; margin: -10px; padding: 10px; border-bottom: 1px solid #333;">VimHelper Suggestions</h3>
    <div style="margin-top: 10px;">
        <p>This is where your Vim motion suggestions will appear.</p>
        <p>Drag the box using the header. Resize it using the bottom-right corner.</p>
    </div>
  `;

  document.body.appendChild(suggestionBox);

  // Add dragging functionality to the header handle only
  const dragHandle = document.getElementById("vim-helper-drag-handle");
  let isDragging = false;
  let offsetX, offsetY;

  dragHandle.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - suggestionBox.getBoundingClientRect().left;
    offsetY = e.clientY - suggestionBox.getBoundingClientRect().top;
    suggestionBox.style.transition = "none"; // Disable smooth transition while dragging
    e.preventDefault(); // Prevents text selection on the header
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      suggestionBox.style.left = `${e.clientX - offsetX}px`;
      suggestionBox.style.top = `${e.clientY - offsetY}px`;
      suggestionBox.style.right = "auto";
      suggestionBox.style.bottom = "auto";
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    suggestionBox.style.transition = "top 0.3s ease, left 0.3s ease";
  });
}

createSuggestionBox();
