/**
 * HELLO WORLD APP - Main Component
 *
 * This is your main widget component! This is where you build your UI.
 *
 * BEGINNER TIPS:
 * - React uses JSX (JavaScript + HTML-like syntax)
 * - Components are just functions that return HTML-like code
 * - Use {curly braces} to put JavaScript inside your HTML
 * - useState lets you track data that can change (like button clicks)
 */

import React, { useState } from "react";
import "./styles.css";

function App() {
  // STATE: This tracks how many times the button was clicked
  // useState returns [currentValue, functionToUpdateValue]
  const [count, setCount] = useState(0);

  // Get data from the MCP server (passed via window object)
  // This is how your server sends data to your widget
  const serverData = window.appData || { message: "No data from server" };

  return (
    <div className="app-container">
      {/* This is your widget's main content */}

      <div className="card">
        <h1>Hello from ChatGPT! 👋</h1>

        <p className="description">
          This is your first ChatGPT widget! You can customize everything here.
        </p>

        {/* Display data from your MCP server */}
        <div className="server-data">
          <h2>Data from Server:</h2>
          <p>{serverData.message}</p>
        </div>

        {/* Interactive button example */}
        <div className="counter">
          <p>You clicked the button {count} times</p>
          <button
            onClick={() => setCount(count + 1)}
            className="button"
          >
            Click me!
          </button>
        </div>

        {/* Tips for beginners */}
        <div className="tips">
          <h3>Next Steps:</h3>
          <ul>
            <li>Edit this file (app.jsx) to change the UI</li>
            <li>Modify styles.css to change colors and layout</li>
            <li>Update the MCP server to send different data</li>
            <li>Run "pnpm run dev" to see changes live!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
