"""Configuration management for the Open Source UA bot."""

from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class BotSettings(BaseSettings):
    """Bot configuration settings."""
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
    # Telegram Bot Token
    telegram_bot_token: str = Field(..., description="Telegram Bot API token")
    
    # Telegram Channel/Group IDs
    telegram_channel_id: Optional[str] = Field(None, description="Main channel ID for posting")
    telegram_group_id: Optional[str] = Field(None, description="Group ID for discussions")
    
    # Bot settings
    debug: bool = Field(False, description="Enable debug mode")
    log_level: str = Field("INFO", description="Logging level")
    
    # Posting settings
    post_directory: str = Field("posts", description="Directory containing markdown posts")
    
    # Rate limiting
    rate_limit_messages: int = Field(30, description="Messages per minute limit")
    rate_limit_period: int = Field(60, description="Rate limit period in seconds")


settings = BotSettings()
