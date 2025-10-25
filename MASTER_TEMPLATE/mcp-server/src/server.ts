/**
 * MCP SERVER - Complete Beginner's Guide
 *
 * This is your MCP (Model Context Protocol) server.
 * It connects ChatGPT to your custom widget.
 *
 * HOW IT WORKS (Simple Explanation):
 * 1. ChatGPT asks: "What tools do you have?"
 * 2. Your server says: "I have a 'hello-world' tool"
 * 3. User asks ChatGPT something that needs your tool
 * 4. ChatGPT calls your tool
 * 5. Your server sends back data + the widget HTML
 * 6. ChatGPT displays your widget to the user
 *
 * MAIN CONCEPTS:
 * - TOOL: A function ChatGPT can call (like "show hello world widget")
 * - WIDGET: The visual HTML/React component the user sees
 * - METADATA: Info about your widget that tells ChatGPT how to display it
 */

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import fs from "node:fs";
import path from "node:path";
import { URL, fileURLToPath } from "node:url";

// Import the MCP SDK - this handles all the communication with ChatGPT
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListResourcesRequestSchema,
  type CallToolRequest,
  type ListToolsRequest,
  type ReadResourceRequest,
  type ListResourcesRequest,
  type Tool,
  type Resource,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod"; // For validating input data

// ============================================================================
// CONFIGURATION
// ============================================================================

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..", ".."); // Go up to project root
const ASSETS_DIR = path.resolve(ROOT_DIR, "assets"); // Where built widgets live

// Server will run on this port
const PORT = Number(process.env.PORT || 8000);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Reads the built HTML file for a widget
 *
 * BEGINNER EXPLANATION:
 * After you run "pnpm run build", your widget becomes an HTML file.
 * This function reads that file so we can send it to ChatGPT.
 */
function readWidgetHtml(widgetName: string): string {
  if (!fs.existsSync(ASSETS_DIR)) {
    throw new Error(
      `❌ Assets folder not found!\n` +
      `Expected: ${ASSETS_DIR}\n` +
      `Did you forget to run "pnpm run build"?`
    );
  }

  const htmlPath = path.join(ASSETS_DIR, `${widgetName}.html`);

  if (!fs.existsSync(htmlPath)) {
    throw new Error(
      `❌ Widget HTML not found: ${widgetName}.html\n` +
      `Make sure you built the widget with "pnpm run build"`
    );
  }

  return fs.readFileSync(htmlPath, "utf8");
}

/**
 * Creates metadata for the widget
 *
 * BEGINNER EXPLANATION:
 * Metadata = "data about data"
 * This tells ChatGPT things like:
 * - Where to find the widget HTML
 * - What text to show while loading
 * - That this tool can show a widget
 */
function createWidgetMeta(templateUri: string) {
  return {
    "openai/outputTemplate": templateUri,
    "openai/toolInvocation/invoking": "Loading your app...",
    "openai/toolInvocation/invoked": "App loaded!",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true,
  };
}

// ============================================================================
// DEFINE YOUR TOOLS & WIDGETS
// ============================================================================

/**
 * This is where you define what your server can do!
 *
 * BEGINNER TIP: Start with one widget, then add more as you learn.
 */

// Define what data the tool accepts from ChatGPT
const toolInputSchema = z.object({
  userName: z.string().optional(), // User's name (optional)
  customMessage: z.string().optional(), // Custom message (optional)
});

// The tool definition - what ChatGPT sees
const helloWorldTool: Tool = {
  name: "show-hello-world",
  description: "Shows a friendly hello world widget with interactive features",
  inputSchema: {
    type: "object",
    properties: {
      userName: {
        type: "string",
        description: "The user's name to personalize the greeting",
      },
      customMessage: {
        type: "string",
        description: "A custom message to display",
      },
    },
  },
  _meta: createWidgetMeta("ui://widget/hello-world.html"),
  annotations: {
    destructiveHint: false, // This tool won't delete anything
    openWorldHint: false, // This tool doesn't access external websites
    readOnlyHint: true, // This tool only reads data, doesn't modify anything
  },
};

// Resource definition - tells ChatGPT where to get the widget HTML
const helloWorldResource: Resource = {
  uri: "ui://widget/hello-world.html",
  name: "Hello World Widget",
  description: "A beginner-friendly widget template",
  mimeType: "text/html+skybridge",
  _meta: createWidgetMeta("ui://widget/hello-world.html"),
};

// ============================================================================
// CREATE THE MCP SERVER
// ============================================================================

function createMcpServer(): Server {
  // Create a new MCP server instance
  const server = new Server(
    {
      name: "my-app-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        resources: {}, // We provide widgets (resources)
        tools: {}, // We provide tools ChatGPT can call
      },
    }
  );

  // -------------------------------------------------------------------------
  // HANDLER 1: List Tools
  // ChatGPT asks: "What tools do you have?"
  // -------------------------------------------------------------------------
  server.setRequestHandler(
    ListToolsRequestSchema,
    async (_request: ListToolsRequest) => {
      console.log("📋 ChatGPT requested list of tools");
      return {
        tools: [helloWorldTool], // Add more tools here as you create them
      };
    }
  );

  // -------------------------------------------------------------------------
  // HANDLER 2: Call Tool
  // ChatGPT says: "I want to use the 'show-hello-world' tool"
  // -------------------------------------------------------------------------
  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      console.log(`🔧 Tool called: ${request.params.name}`);

      if (request.params.name === "show-hello-world") {
        // Parse and validate the input
        const args = toolInputSchema.parse(request.params.arguments || {});

        console.log("  Arguments:", args);

        // Return the response with data for the widget
        return {
          content: [
            {
              type: "text",
              text: `Here's your Hello World widget${args.userName ? ` for ${args.userName}` : ""}!`,
            },
          ],
          // This data will be available in your widget as window.appData
          structuredContent: {
            userName: args.userName || "Guest",
            customMessage: args.customMessage || "Welcome to your first ChatGPT app!",
          },
          _meta: createWidgetMeta("ui://widget/hello-world.html"),
        };
      }

      // If the tool name doesn't match, return an error
      throw new Error(`Unknown tool: ${request.params.name}`);
    }
  );

  // -------------------------------------------------------------------------
  // HANDLER 3: List Resources
  // ChatGPT asks: "What widgets (resources) do you have?"
  // -------------------------------------------------------------------------
  server.setRequestHandler(
    ListResourcesRequestSchema,
    async (_request: ListResourcesRequest) => {
      console.log("📦 ChatGPT requested list of resources");
      return {
        resources: [helloWorldResource],
      };
    }
  );

  // -------------------------------------------------------------------------
  // HANDLER 4: Read Resource
  // ChatGPT says: "Give me the HTML for this widget"
  // -------------------------------------------------------------------------
  server.setRequestHandler(
    ReadResourceRequestSchema,
    async (request: ReadResourceRequest) => {
      console.log(`📖 Reading resource: ${request.params.uri}`);

      if (request.params.uri === "ui://widget/hello-world.html") {
        const html = readWidgetHtml("hello-world");

        return {
          contents: [
            {
              uri: "ui://widget/hello-world.html",
              mimeType: "text/html+skybridge",
              text: html,
              _meta: createWidgetMeta("ui://widget/hello-world.html"),
            },
          ],
        };
      }

      throw new Error(`Unknown resource: ${request.params.uri}`);
    }
  );

  return server;
}

// ============================================================================
// HTTP SERVER SETUP
// ============================================================================

/**
 * This creates the actual HTTP server that ChatGPT connects to.
 *
 * BEGINNER EXPLANATION:
 * - ChatGPT connects via SSE (Server-Sent Events)
 * - SSE is like a phone call that stays open
 * - ChatGPT can send requests anytime over this connection
 */

// Track active connections
const sessions = new Map<string, { server: Server; transport: SSEServerTransport }>();

// URL paths
const SSE_PATH = "/mcp"; // ChatGPT connects here
const POST_PATH = "/mcp/messages"; // ChatGPT sends messages here

// Handle new SSE connections
async function handleSseRequest(res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const server = createMcpServer();
  const transport = new SSEServerTransport(POST_PATH, res);
  const sessionId = transport.sessionId;

  sessions.set(sessionId, { server, transport });
  console.log(`✅ New session started: ${sessionId}`);

  transport.onclose = async () => {
    sessions.delete(sessionId);
    await server.close();
    console.log(`👋 Session closed: ${sessionId}`);
  };

  transport.onerror = (error) => {
    console.error("❌ SSE transport error:", error);
  };

  try {
    await server.connect(transport);
  } catch (error) {
    sessions.delete(sessionId);
    console.error("❌ Failed to start SSE session:", error);
    if (!res.headersSent) {
      res.writeHead(500).end("Failed to establish SSE connection");
    }
  }
}

// Handle POST messages from ChatGPT
async function handlePostMessage(
  req: IncomingMessage,
  res: ServerResponse,
  url: URL
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type");

  const sessionId = url.searchParams.get("sessionId");

  if (!sessionId) {
    res.writeHead(400).end("Missing sessionId");
    return;
  }

  const session = sessions.get(sessionId);

  if (!session) {
    res.writeHead(404).end("Unknown session");
    return;
  }

  try {
    await session.transport.handlePostMessage(req, res);
  } catch (error) {
    console.error("❌ Failed to process message:", error);
    if (!res.headersSent) {
      res.writeHead(500).end("Failed to process message");
    }
  }
}

// Create and start the HTTP server
const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  if (!req.url) {
    res.writeHead(400).end("Missing URL");
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  // Handle CORS preflight
  if (req.method === "OPTIONS" && (url.pathname === SSE_PATH || url.pathname === POST_PATH)) {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type",
    });
    res.end();
    return;
  }

  // Handle SSE connection
  if (req.method === "GET" && url.pathname === SSE_PATH) {
    await handleSseRequest(res);
    return;
  }

  // Handle POST messages
  if (req.method === "POST" && url.pathname === POST_PATH) {
    await handlePostMessage(req, res, url);
    return;
  }

  res.writeHead(404).end("Not Found");
});

// Start listening
httpServer.listen(PORT, () => {
  console.log("\n🚀 MCP Server Started!");
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`🔗 Connect ChatGPT to: http://localhost:${PORT}${SSE_PATH}`);
  console.log("\n💡 Next steps:");
  console.log("  1. Use ngrok to expose this server: ngrok http 8000");
  console.log("  2. Add the ngrok URL to ChatGPT Settings > Connectors");
  console.log("  3. Ask ChatGPT to show your hello world widget!");
  console.log("\n");
});
