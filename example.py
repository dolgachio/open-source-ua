#!/usr/bin/env python3
"""
Example script showing how to use the Open Source UA bot.
"""

import asyncio
import logging
from pathlib import Path

from src.open_source_ua.bot import OpenSourceUABot

async def main():
    """Main example function."""
    # Set up logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Initialize the bot
    bot = OpenSourceUABot()
    
    # Test connection
    print("🔍 Testing bot connection...")
    bot_info = await bot.get_bot_info()
    if bot_info:
        print(f"✅ Connected! Bot: @{bot_info.get('username')}")
    else:
        print("❌ Failed to connect to Telegram")
        return
    
    # List available posts
    print("\n📄 Available posts:")
    posts = await bot.list_posts()
    if posts:
        for i, post in enumerate(posts, 1):
            print(f"  {i}. {post}")
    else:
        print("  No posts found in the posts/ directory")
    
    # Example: Send a test message (commented out for safety)
    # Uncomment and add your channel ID to test
    """
    test_channel_id = "@your_channel_or_chat_id"
    test_message = "🇺🇦 Test message from Open Source UA bot!"
    
    print(f"\n📤 Sending test message to {test_channel_id}...")
    success = await bot.send_message(test_channel_id, test_message)
    if success:
        print("✅ Test message sent successfully!")
    else:
        print("❌ Failed to send test message")
    """

if __name__ == "__main__":
    asyncio.run(main())
