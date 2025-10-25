# How to Duplicate This Template

**Goal:** Create a copy of this template for each new app you build.

---

## Method 1: Simple Copy (Recommended for Beginners)

### Step 1: Copy the Folder

```bash
# Go to the parent directory
cd ..

# Copy MASTER_TEMPLATE to a new folder
cp -r MASTER_TEMPLATE my-calculator-app

# Go into your new app
cd my-calculator-app
```

### Step 2: Clean It Up

```bash
# Remove the old build files
rm -rf assets node_modules pnpm-lock.yaml

# Remove git history (if you want a fresh start)
rm -rf .git
```

### Step 3: Customize

Edit `package.json`:
```json
{
  "name": "my-calculator-app",
  "description": "A calculator app for ChatGPT",
  "version": "1.0.0"
}
```

Edit `mcp-server/package.json`:
```json
{
  "name": "calculator-mcp-server",
  "description": "MCP Server for Calculator App"
}
```

### Step 4: Install and Build

```bash
pnpm install
pnpm run build
```

### Step 5: Rename Your Widget

```bash
# Rename the widget folder
mv src/hello-world src/calculator

# Update file references
# (Edit the files manually or use find/replace in your editor)
```

---

## Method 2: Using Git (Better for Version Control)

### Step 1: Initialize as a New Repo

```bash
# Copy the template
cp -r MASTER_TEMPLATE my-calculator-app
cd my-calculator-app

# Initialize new git repo
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit from MASTER_TEMPLATE"
```

### Step 2: Connect to GitHub

```bash
# Create a new repo on GitHub first, then:
git remote add origin https://github.com/yourusername/my-calculator-app.git
git branch -M main
git push -u origin main
```

---

## Method 3: Using a Script (Advanced)

Create a script called `duplicate.sh`:

```bash
#!/bin/bash

# Usage: ./duplicate.sh my-new-app

APP_NAME=$1

if [ -z "$APP_NAME" ]; then
  echo "Usage: ./duplicate.sh <app-name>"
  exit 1
fi

echo "Creating new app: $APP_NAME"

# Copy template
cp -r MASTER_TEMPLATE "$APP_NAME"

cd "$APP_NAME"

# Clean up
rm -rf assets node_modules pnpm-lock.yaml .git

# Update package.json
sed -i '' "s/my-chatgpt-app-template/$APP_NAME/g" package.json
sed -i '' "s/my-app-mcp-server/$APP_NAME-server/g" mcp-server/package.json

echo "✅ Created $APP_NAME"
echo "Next steps:"
echo "  cd $APP_NAME"
echo "  pnpm install"
echo "  pnpm run build"
```

Make it executable:
```bash
chmod +x duplicate.sh
```

Use it:
```bash
./duplicate.sh my-calculator-app
```

---

## Checklist for Each New App

After duplicating, make sure to:

- [ ] Change `package.json` name and description
- [ ] Change `mcp-server/package.json` name
- [ ] Rename `src/hello-world` to your widget name
- [ ] Update all references to "hello-world" in:
  - [ ] `build.mts`
  - [ ] `mcp-server/src/server.ts`
  - [ ] `index.html`
- [ ] Update the tool name and description in `server.ts`
- [ ] Run `pnpm install`
- [ ] Run `pnpm run build`
- [ ] Test it works!

---

## Organizing Multiple Apps

### Recommended Folder Structure

```
my-chatgpt-apps/
├── MASTER_TEMPLATE/          # Keep this clean!
├── calculator-app/
├── weather-app/
├── todo-app/
├── quiz-app/
└── color-picker-app/
```

### Keeping MASTER_TEMPLATE Clean

**Important:** Never modify `MASTER_TEMPLATE` directly when building apps!

- Use it as a starting point only
- Keep it updated with best practices
- When you learn something new, update the template
- All your apps can then benefit from improvements

---

## Tips

1. **Name your apps clearly** - Use descriptive names like "weather-widget" not "app1"

2. **Keep a list** - Track all your apps in a spreadsheet or note file

3. **Version your template** - When you make improvements to MASTER_TEMPLATE, save different versions:
   ```
   MASTER_TEMPLATE_v1/
   MASTER_TEMPLATE_v2/
   ```

4. **Share your template** - Once you've customized it to your liking, share it with others!

5. **Don't duplicate everything** - Some things can be shared:
   - Documentation (can reference the original)
   - Common utilities (create a shared library)

---

## Example Workflow

**Building a Calculator App:**

```bash
# 1. Duplicate the template
cp -r MASTER_TEMPLATE calculator-app
cd calculator-app

# 2. Clean it
rm -rf assets node_modules pnpm-lock.yaml

# 3. Rename widget
mv src/hello-world src/calculator

# 4. Edit the files
# - Update package.json
# - Update build.mts
# - Update server.ts
# - Write your calculator UI in src/calculator/app.jsx

# 5. Install and build
pnpm install
pnpm run build

# 6. Test
pnpm run serve &
pnpm run server &
ngrok http 8000

# 7. Connect to ChatGPT and test!
```

---

## Need Help?

- Make sure you're duplicating the entire folder
- Don't forget to update all the references
- Test each new app immediately after duplicating
- If something doesn't work, compare with the original MASTER_TEMPLATE

---

**Happy Building! 🚀**
