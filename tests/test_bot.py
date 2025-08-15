"""Tests for the Open Source UA bot."""

import pytest
from unittest.mock import AsyncMock, Mock
from pathlib import Path

from open_source_ua.bot import OpenSourceUABot
from open_source_ua.config import BotSettings


@pytest.fixture
def mock_bot():
    """Create a mock bot instance."""
    with pytest.MonkeyPatch.context() as m:
        m.setenv("TELEGRAM_BOT_TOKEN", "test_token")
        return OpenSourceUABot()


@pytest.mark.asyncio
async def test_bot_initialization():
    """Test bot initialization."""
    bot = OpenSourceUABot(token="test_token")
    assert bot.token == "test_token"
    assert isinstance(bot.posts_dir, Path)


@pytest.mark.asyncio
async def test_list_posts_empty_directory(mock_bot, tmp_path, monkeypatch):
    """Test listing posts when directory is empty."""
    monkeypatch.setattr(mock_bot, 'posts_dir', tmp_path)
    posts = await mock_bot.list_posts()
    assert posts == []


@pytest.mark.asyncio
async def test_list_posts_with_files(mock_bot, tmp_path, monkeypatch):
    """Test listing posts with actual files."""
    # Create test markdown files
    (tmp_path / "post1.md").write_text("# Test Post 1")
    (tmp_path / "post2.md").write_text("# Test Post 2")
    (tmp_path / "not_markdown.txt").write_text("Not a markdown file")
    
    monkeypatch.setattr(mock_bot, 'posts_dir', tmp_path)
    posts = await mock_bot.list_posts()
    
    assert len(posts) == 2
    assert "post1.md" in posts
    assert "post2.md" in posts
    assert "not_markdown.txt" not in posts
