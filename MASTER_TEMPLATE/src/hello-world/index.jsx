/**
 * HELLO WORLD WIDGET - Entry Point
 *
 * This is the starting point for your widget.
 * When ChatGPT calls your tool, it will load this widget and render it.
 *
 * BEGINNER TIP: Keep this file simple - it just sets up React and renders your main component.
 */

import { createRoot } from "react-dom/client";
import App from "./app";

// This tells React to render your App component into the HTML element with id "app-root"
createRoot(document.getElementById("app-root")).render(<App />);

// Export the App so it can be used elsewhere if needed
export { App };
export default App;
