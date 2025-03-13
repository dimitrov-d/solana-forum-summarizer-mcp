// #!/usr/bin/env node
import { clusterApiUrl, Keypair } from '@solana/web3.js';
import 'dotenv/config';
import { SolanaAgentKit, startMcpServer } from 'solana-agent-kit';

async function main() {
  const agent = new SolanaAgentKit(
    Keypair.generate().secretKey.toString(),
    clusterApiUrl('mainnet-beta'),
    {},
  );

  const mcp_actions = {
  };

  try {
    // Start the MCP server with error handling
    await startMcpServer(mcp_actions, agent, {
      name: 'solana-agent',
      version: '0.0.1',
    });
  } catch (error) {
    console.error(
      'Failed to start MCP server:',
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main();
