# ChatGPT App Master Template

**Welcome!** This is your starting point for building ChatGPT apps. Everything has been simplified and heavily commented for beginners.

---

## What Is This?

This template helps you build **custom widgets** (visual interfaces) that work inside ChatGPT conversations. When users ask ChatGPT for something, your widget can appear and provide an interactive experience!

**Examples of what you can build:**
- 📊 Data visualizations (charts, graphs, dashboards)
- 🎮 Interactive games
- 📝 Productivity tools (todo lists, calculators, timers)
- 🎨 Creative tools (drawing apps, color pickers)
- 🗺️ Maps and location-based widgets
- 📚 Educational tools (quizzes, flashcards, tutorials)

---

## How It Works (Simple Explanation)

```
1. You build a widget (like a React app)
   ↓
2. You build an MCP server (connects ChatGPT to your widget)
   ↓
3. ChatGPT calls your server when users need your tool
   ↓
4. Your widget appears in the ChatGPT conversation
   ↓
5. Users interact with your widget!
```

---

## Project Structure

```
MASTER_TEMPLATE/
├── src/                          # Your widget code
│   └── hello-world/              # Example widget
│       ├── index.jsx             # Entry point
│       ├── app.jsx               # Main component (EDIT THIS!)
│       └── styles.css            # Styles (EDIT THIS!)
│
├── mcp-server/                   # Your MCP server
│   └── src/
│       └── server.ts             # Server code (EDIT THIS!)
│
├── assets/                       # Built files (auto-generated)
│
├── package.json                  # Project dependencies
├── build.mts                     # Build script
└── vite.config.mts              # Dev server config
```

---

## Quick Start Guide

### Step 1: Install Dependencies

```bash
cd MASTER_TEMPLATE
pnpm install
```

This downloads all the code libraries your project needs.

---

### Step 2: Build Your Widget

```bash
pnpm run build
```

This converts your React code into HTML/JS/CSS files that can be served.

**What happens:**
- Reads `src/hello-world/`
- Bundles React components
- Outputs to `assets/hello-world.html`

---

### Step 3: Test Locally

```bash
# In one terminal: Serve the built files
pnpm run serve

# In another terminal: Start the MCP server
pnpm run server
```

- Assets are at: http://localhost:4444
- MCP server is at: http://localhost:8000

---

### Step 4: Connect to ChatGPT

To use your widget in ChatGPT:

1. **Install ngrok** (if you don't have it):
   ```bash
   # Download from https://ngrok.com/download
   # Or use: brew install ngrok (Mac) or choco install ngrok (Windows)
   ```

2. **Expose your server to the internet**:
   ```bash
   ngrok http 8000
   ```

3. **Copy the ngrok URL** (looks like `https://abc123.ngrok-free.app`)

4. **Add to ChatGPT**:
   - Go to ChatGPT
   - Open Settings → Connectors
   - Click "Add Connector"
   - Paste: `https://abc123.ngrok-free.app/mcp`

5. **Use it in a conversation**:
   - Start a new chat
   - Click "More" (three dots) → Select your connector
   - Ask: "Show me the hello world widget"

---

## Development Workflow

### Live Development (Hot Reload)

```bash
pnpm run dev
```

- Opens http://localhost:5173 in your browser
- Edit `src/hello-world/app.jsx`
- Save → Browser auto-refreshes!

**Note:** This is just for previewing your widget. To test with ChatGPT, you need to build and run the server.

---

## Customizing Your Widget

### Edit the UI

**File:** `src/hello-world/app.jsx`

```jsx
function App() {
  return (
    <div>
      <h1>Change me!</h1>
      <p>Add your own content here</p>
    </div>
  );
}
```

### Edit the Styles

**File:** `src/hello-world/styles.css`

```css
.card {
  background: blue; /* Change colors */
  padding: 20px;    /* Adjust spacing */
}
```

### Get Data from the Server

**In your widget (app.jsx):**
```jsx
const data = window.appData;
console.log(data.message);
```

**In your server (server.ts):**
```typescript
structuredContent: {
  message: "Hello from the server!",
  count: 42,
}
```

---

## Adding More Widgets

### 1. Create a New Widget Folder

```bash
mkdir src/my-new-widget
```

### 2. Copy the Template

```bash
cp src/hello-world/* src/my-new-widget/
```

### 3. Edit the Files

- Update `app.jsx` with your new UI
- Update `styles.css` with your new styles
- Change `index.jsx` if needed

### 4. Update `build.mts`

Add your new widget to the build config:

```typescript
input: {
  "hello-world": resolve(__dirname, "src/hello-world/index.jsx"),
  "my-new-widget": resolve(__dirname, "src/my-new-widget/index.jsx"), // Add this
}
```

### 5. Update `mcp-server/src/server.ts`

Add a new tool for your widget:

```typescript
const myNewTool: Tool = {
  name: "show-my-widget",
  description: "Shows my awesome new widget",
  // ... rest of config
};
```

---

## Common Tasks

### Add a Library (e.g., a chart library)

```bash
pnpm add recharts
```

Then use it in your widget:
```jsx
import { LineChart, Line } from 'recharts';
```

### Debug the Server

Add console.log statements:
```typescript
console.log("Tool called with:", args);
```

Check the terminal where you ran `pnpm run server`

### Debug the Widget

Open browser DevTools (F12) and check the Console tab:
```jsx
console.log("Widget data:", window.appData);
```

---

## Troubleshooting

### "Assets not found" error
- **Fix:** Run `pnpm run build` first

### Widget doesn't show in ChatGPT
- Check ngrok is running
- Check the server is running (`pnpm run server`)
- Verify the connector URL ends with `/mcp`

### Changes not appearing
- After editing code, run `pnpm run build` again
- Restart the server

### Port already in use
- Change the port in `mcp-server/src/server.ts`:
  ```typescript
  const PORT = 8001; // Use a different port
  ```

---

## Next Steps

1. **Customize the hello-world widget** to understand the basics
2. **Read the comments** in all the code files
3. **Build your first real app** (start simple!)
4. **Add more tools** to your MCP server
5. **Deploy to production** (see Deployment Guide below)

---

## Deployment Guide

### Option 1: Deploy to Render (Free)

1. Push your code to GitHub
2. Go to https://render.com
3. Create a new "Web Service"
4. Connect your GitHub repo
5. Set build command: `pnpm install && pnpm run build`
6. Set start command: `cd mcp-server && pnpm start`
7. Deploy!

### Option 2: Deploy to Railway

1. Go to https://railway.app
2. Create a new project from GitHub
3. Set environment variables if needed
4. Deploy!

### After Deployment

Update your ChatGPT connector URL to your deployed URL:
```
https://your-app.railway.app/mcp
```

---

## Resources for Learning

### React Basics
- https://react.dev/learn

### MCP Protocol
- https://modelcontextprotocol.io/

### ChatGPT Apps SDK
- https://platform.openai.com/docs/guides/apps

### JavaScript/TypeScript
- https://javascript.info/
- https://www.typescriptlang.org/docs/

---

## Tips for Beginners

1. **Start small** - Get hello-world working first
2. **Read the comments** - Every file is heavily documented
3. **Console.log everything** - Print data to understand what's happening
4. **One change at a time** - Test after each change
5. **Ask for help** - Use ChatGPT itself to explain code!
6. **Copy examples** - Learn by modifying existing code

---

## What to Build?

**Ideas for your first apps:**

1. **Simple Calculator** - Good for learning state management
2. **Color Picker** - Fun and visual
3. **Todo List** - Classic for learning CRUD operations
4. **Random Quote Generator** - Easy API integration
5. **Countdown Timer** - Learn about timers and effects
6. **Weather Widget** - Fetch external data
7. **Flashcard App** - Educational tool
8. **Emoji Picker** - Simple but useful
9. **Unit Converter** - Math and forms
10. **Daily Inspiration** - Combine text and images

---

## License

MIT - Feel free to use this template for any project!

---

## Questions?

- Check the code comments (they explain everything!)
- Ask ChatGPT to explain parts of the code
- Search for errors online
- Experiment and have fun!

**Happy coding! 🚀**
