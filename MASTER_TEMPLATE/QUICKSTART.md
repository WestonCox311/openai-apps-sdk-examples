# Quick Start - Get Running in 5 Minutes! ⚡

**For absolute beginners:** Follow these exact steps to get your first ChatGPT widget running.

---

## Step 1: Open Your Terminal

- **Mac:** Press `Cmd + Space`, type "Terminal", hit Enter
- **Windows:** Press `Win + R`, type "cmd", hit Enter
- **Linux:** Press `Ctrl + Alt + T`

---

## Step 2: Navigate to This Folder

```bash
cd MASTER_TEMPLATE
```

---

## Step 3: Install Everything

```bash
pnpm install
```

**Wait for it to finish.** You'll see a lot of text scroll by. This is normal!

---

## Step 4: Build Your Widget

```bash
pnpm run build
```

**You should see:**
```
✅ JavaScript bundle created
✅ HTML file created
```

---

## Step 5: Test It Works

### Option A: Preview the Widget (No ChatGPT)

```bash
pnpm run serve
```

Open your browser to: http://localhost:4444/hello-world.html

You should see your widget! 🎉

### Option B: Test with ChatGPT (Full Setup)

**In Terminal #1:**
```bash
pnpm run serve
```

**In Terminal #2 (new terminal window):**
```bash
pnpm run server
```

You should see:
```
🚀 MCP Server Started!
📡 Listening on http://localhost:8000
```

**In Terminal #3 (new terminal window):**

1. Install ngrok if you don't have it:
   - Download from: https://ngrok.com/download
   - Or use: `brew install ngrok` (Mac) or `choco install ngrok` (Windows)

2. Run ngrok:
```bash
ngrok http 8000
```

3. **Copy the ngrok URL** that looks like:
   ```
   https://abc123-def456.ngrok-free.app
   ```

**In ChatGPT:**

1. Go to ChatGPT (https://chat.openai.com)
2. Click **Settings** (gear icon)
3. Go to **Connectors**
4. Click **Add Connector**
5. Paste your ngrok URL and add `/mcp` at the end:
   ```
   https://abc123-def456.ngrok-free.app/mcp
   ```
6. Click **Save**

**Use It:**

1. Start a new chat in ChatGPT
2. Click the **"More"** button (three dots)
3. Select your connector
4. Type: **"Show me the hello world widget"**

You should see your widget appear! 🚀

---

## Common Issues

### "pnpm: command not found"

Install pnpm first:
```bash
npm install -g pnpm
```

### "Port 8000 already in use"

Something else is using that port. Try:
```bash
# Kill what's using port 8000
lsof -ti:8000 | xargs kill

# Or change the port in mcp-server/src/server.ts
```

### Widget doesn't show in ChatGPT

1. Check all 3 terminals are still running
2. Make sure the ngrok URL ends with `/mcp`
3. Try refreshing ChatGPT
4. Make sure you selected the connector in "More" options

### Build errors

1. Delete `node_modules` and try again:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   pnpm run build
   ```

---

## What's Next?

Now that it works, try customizing it!

### Make Your First Edit

1. Open `src/hello-world/app.jsx` in your code editor
2. Change line 26:
   ```jsx
   <h1>Hello from ChatGPT! 👋</h1>
   ```
   to:
   ```jsx
   <h1>My First Widget! 🎨</h1>
   ```
3. Save the file
4. Run `pnpm run build` again
5. Refresh ChatGPT and ask for the widget again

You should see your changes!

### Change the Colors

1. Open `src/hello-world/styles.css`
2. Find line 8 (the gradient colors)
3. Change the colors to whatever you want:
   ```css
   background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
   ```
4. Run `pnpm run build`
5. Refresh and check it out!

### Add Your Own Data

1. Open `mcp-server/src/server.ts`
2. Find line 133 (structuredContent)
3. Add your own data:
   ```typescript
   structuredContent: {
     userName: args.userName || "Guest",
     customMessage: args.customMessage || "Welcome!",
     favoriteColor: "blue", // Add this!
   },
   ```
4. Open `src/hello-world/app.jsx`
5. Use the data:
   ```jsx
   <p>Your favorite color is: {serverData.favoriteColor}</p>
   ```
6. Build and test!

---

## Cheat Sheet

```bash
# Install dependencies
pnpm install

# Build the widget
pnpm run build

# Preview widget in browser
pnpm run serve

# Start MCP server
pnpm run server

# Development mode (auto-reload)
pnpm run dev

# Expose server to internet
ngrok http 8000
```

---

## Need Help?

1. **Read the comments** in the code files - they explain everything!
2. **Check README.md** for detailed explanations
3. **Ask ChatGPT** to explain parts of the code
4. **Google the error** message you're seeing

---

**You're ready to build! Have fun! 🎉**
