export const modules = {
  toolbar: [
    // Formatting options
    [{ header: [1, 2, 3, 4, false] }],
    ['bold', 'italic', 'underline'], // Basic text formatting
    [{ color: [] }], // Text color and background

    // Lists and blocks
    [{ list: 'ordered' }, { list: 'bullet' }], // Ordered/Unordered lists
    // Text formatting
    [{ align: [] }], // Text alignment (left, center, right)
    ['code-block', 'link'],

    // Remove formatting
    ['clean'], // Clear formatting button
  ],
};
