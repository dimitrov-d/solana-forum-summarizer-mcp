// #!/usr/bin/env node
import { clusterApiUrl, Keypair } from '@solana/web3.js';
import 'dotenv/config';
import { Action, SolanaAgentKit, startMcpServer } from 'solana-agent-kit';
import { getLatestPosts } from './actions/getLatestPosts';
import bs58 from 'bs58';
import { getTopPosts } from './actions/getTopPosts';
import { getPostsByCategory } from './actions/getPostsByCategory';

async function main() {
  const agent = new SolanaAgentKit(
    bs58.encode(Keypair.generate().secretKey),
    clusterApiUrl('mainnet-beta'),
    {},
  );

  const mcp_actions = {
    GET_LATEST_POSTS: getLatestPosts,
    GET_TOP_POSTS: getTopPosts,
    GET_POSTS_BY_CATEGORY: getPostsByCategory,
  } as Record<string, Action>;

  try {
    // Start the MCP server with error handling
    await startMcpServer(mcp_actions, agent, {
      name: 'solana-forum-summarizer',
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
