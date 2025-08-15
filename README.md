# Постм і управління спільнотою 🇺🇦 Open Source UA

Automated Telegram bot for managing the Open Source Ukraine community. This bot helps with posting content, managing discussions, and automating community tasks.

## Features

- 📤 Automated posting to Telegram channels
- 📝 Markdown post support
- 🔧 Configuration management
- 🚀 CLI interface for easy usage
- 🧪 Test coverage
- 🇺🇦 Built for Ukrainian Open Source community

## Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/dolgachio/open-source-ua.git
cd open-source-ua

# Install dependencies
pip install -r requirements.txt
# OR using pyproject.toml
pip install -e .
```

### 2. Configuration

Copy and edit the `.env` file with your bot credentials:

```bash
# Your Telegram bot token from @BotFather
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Your channel/group IDs
TELEGRAM_CHANNEL_ID=@your_channel
TELEGRAM_GROUP_ID=@your_group
```

### 3. Usage

#### Test bot connection:
```bash
python example.py
```

#### Using CLI:
```bash
# Test connection
python -m open_source_ua.cli test

# List available posts
python -m open_source_ua.cli list

# Send a specific post
python -m open_source_ua.cli send 01_post.md
```

#### Using in code:
```python
from src.open_source_ua.bot import OpenSourceUABot

bot = OpenSourceUABot()
await bot.send_message("@your_channel", "Hello, Open Source UA! 🇺🇦")
```

## Project Structure

```
open-source-ua/
├── src/open_source_ua/     # Main package
│   ├── __init__.py         # Package initialization
│   ├── config.py           # Configuration management
│   ├── bot.py              # Main bot implementation
│   └── cli.py              # Command-line interface
├── posts/                  # Markdown posts directory
├── tests/                  # Test suite
├── .env                    # Environment variables
├── requirements.txt        # Dependencies
├── pyproject.toml          # Project configuration
└── example.py              # Usage examples
```

## Development

### Running Tests
```bash
# Install development dependencies
pip install -e ".[dev]"

# Run tests
pytest tests/
```

### Code Formatting
```bash
# Format code
black src/ tests/

# Sort imports
isort src/ tests/

# Lint code
flake8 src/ tests/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions or support, please open an issue or contact the Open Source UA community.

🇺🇦 Слава Україні!