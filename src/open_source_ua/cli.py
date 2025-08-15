"""CLI utilities for Open Source UA bot."""

import asyncio
import sys
from pathlib import Path

from .bot import OpenSourceUABot
from .config import settings


async def send_post(post_file: str, chat_id: str = None):
    """Send a specific post to Telegram."""
    bot = OpenSourceUABot()
    target_chat = chat_id or settings.telegram_channel_id
    
    if not target_chat:
        print("Error: No chat ID specified. Set TELEGRAM_CHANNEL_ID in .env or pass --chat-id")
        return False
        
    success = await bot.send_post_from_file(post_file, target_chat)
    if success:
        print(f"✅ Post '{post_file}' sent successfully to {target_chat}")
    else:
        print(f"❌ Failed to send post '{post_file}'")
    
    return success


async def list_posts():
    """List all available posts."""
    bot = OpenSourceUABot()
    posts = await bot.list_posts()
    
    if posts:
        print("📄 Available posts:")
        for i, post in enumerate(posts, 1):
            print(f"  {i}. {post}")
    else:
        print("No posts found in the posts directory.")


async def test_connection():
    """Test bot connection to Telegram."""
    bot = OpenSourceUABot()
    info = await bot.get_bot_info()
    
    if info:
        print("✅ Bot connection successful!")
        print(f"   Bot username: @{info.get('username', 'unknown')}")
        print(f"   Bot ID: {info.get('id', 'unknown')}")
    else:
        print("❌ Failed to connect to Telegram bot")


def main():
    """Main CLI entry point."""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python -m open_source_ua.cli test           # Test bot connection")
        print("  python -m open_source_ua.cli list           # List available posts")
        print("  python -m open_source_ua.cli send <post>    # Send a post")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "test":
        asyncio.run(test_connection())
    elif command == "list":
        asyncio.run(list_posts())
    elif command == "send":
        if len(sys.argv) < 3:
            print("Error: Post filename required")
            print("Usage: python -m open_source_ua.cli send <post_file.md>")
            sys.exit(1)
        post_file = sys.argv[2]
        asyncio.run(send_post(post_file))
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
