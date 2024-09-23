export const modules = {
  toolbar: [
    // Formatting options
    ['bold', 'italic', 'underline', 'strike'], // Basic text formatting
    [{ header: 1 }, { header: 2 }], // Headers
    [{ color: [] }, { background: [] }], // Text color and background

    // Lists and blocks
    [{ list: 'ordered' }, { list: 'bullet' }], // Ordered/Unordered lists
    [{ blockquote: true }], // Blockquote
    [{ indent: '-1' }, { indent: '+1' }], // Indentation

    // Text formatting
    [{ align: [] }], // Text alignment (left, center, right)

    // Remove formatting
    ['clean'], // Clear formatting button
  ],
};
