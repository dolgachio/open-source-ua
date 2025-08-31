#!/usr/bin/env node

import { OpenSourceUABot } from './bot.js';

async function main(): Promise<void> {
  console.log('🇺🇦 Open Source UA Telegram Bot');
  console.log('================================');

  try {
    const bot = new OpenSourceUABot();
    
    // Test connection
    console.log('🔍 Testing bot connection...');
    const info = await bot.getBotInfo();
    console.log(`✅ Connected! Bot: @${info.username}`);
    
    // List available posts
    console.log('\n📄 Scanning for posts...');
    const posts = await bot.listPosts();
    if (posts.length > 0) {
      console.log('Available posts:');
      posts.forEach((post, i) => console.log(`  ${i + 1}. ${post}`));
    } else {
      console.log('  No posts found in the posts/ directory');
    }

    // Start the bot
    console.log('\n🚀 Starting bot...');
    console.log('Press Ctrl+C to stop');
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down...');
      await bot.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n🛑 Shutting down...');
      await bot.stop();
      process.exit(0);
    });

    await bot.start();
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

// Run the main function
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
}
