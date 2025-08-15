"""Telegram bot implementation for Open Source UA."""

import asyncio
import logging
from pathlib import Path
from typing import Optional

import markdown
from telegram import Bot
from telegram.error import TelegramError

from .config import settings


logger = logging.getLogger(__name__)


class OpenSourceUABot:
    """Main bot class for Open Source UA automation."""
    
    def __init__(self, token: Optional[str] = None):
        """Initialize the bot."""
        self.token = token or settings.telegram_bot_token
        self.bot = Bot(token=self.token)
        self.posts_dir = Path(settings.post_directory)
        
    async def send_message(
        self, 
        chat_id: str, 
        text: str, 
        parse_mode: str = "Markdown"
    ) -> bool:
        """Send a message to a chat."""
        try:
            await self.bot.send_message(
                chat_id=chat_id,
                text=text,
                parse_mode=parse_mode
            )
            logger.info(f"Message sent successfully to {chat_id}")
            return True
        except TelegramError as e:
            logger.error(f"Failed to send message to {chat_id}: {e}")
            return False
    
    async def send_post_from_file(self, post_file: str, chat_id: str) -> bool:
        """Read a markdown post file and send it to Telegram."""
        post_path = self.posts_dir / post_file
        
        if not post_path.exists():
            logger.error(f"Post file not found: {post_path}")
            return False
            
        try:
            with open(post_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Convert markdown to text (you might want to keep markdown formatting)
            # For now, we'll send the raw markdown content
            return await self.send_message(chat_id, content)
            
        except Exception as e:
            logger.error(f"Error reading post file {post_file}: {e}")
            return False
    
    async def list_posts(self) -> list[str]:
        """List all available post files."""
        if not self.posts_dir.exists():
            return []
            
        return [
            f.name for f in self.posts_dir.glob("*.md") 
            if f.is_file()
        ]
    
    async def get_bot_info(self) -> dict:
        """Get bot information."""
        try:
            me = await self.bot.get_me()
            return {
                "id": me.id,
                "username": me.username,
                "first_name": me.first_name,
                "is_bot": me.is_bot
            }
        except TelegramError as e:
            logger.error(f"Failed to get bot info: {e}")
            return {}


async def main():
    """Main function for testing the bot."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    bot = OpenSourceUABot()
    
    # Get bot info
    info = await bot.get_bot_info()
    print(f"Bot info: {info}")
    
    # List available posts
    posts = await bot.list_posts()
    print(f"Available posts: {posts}")


if __name__ == "__main__":
    asyncio.run(main())
