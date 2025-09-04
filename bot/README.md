# Автоматизований Telegram бот для керування спільнотою OpenSourceUA.

Цей бот допомагає з публікацією контенту, керуванням дискусіями та автоматизацією завдань спільноти.

## Функції

- 📤 Автоматичне постування в Telegram канали
- 📝 Підтримка Markdown постів
- 🚀 CLI інтерфейс для зручного використання

## Швидкий старт

### 1. Встановлення

```bash
# Клонуйте репозиторій
git clone https://github.com/dolgachio/open-source-ua.git
cd open-source-ua

# Встановіть залежності за допомогою pnpm (рекомендовано)
pnpm install

# Або використовуйте npm
npm install
```

### 2. Конфігурація

Відредагуйте файл `.env` з вашими credentials для бота:

```bash
# Ваш токен Telegram бота від @BotFather
TELEGRAM_BOT_TOKEN=your_bot_token_here

# ID ваших каналів/груп
TELEGRAM_CHANNEL_ID=@your_channel

# Налаштування бота
NODE_ENV=development
LOG_LEVEL=info
POST_DIRECTORY=posts
```

### 3. Використання

#### Використання CLI:
```bash
# Тест з'єднання
pnpm run cli test

# Список доступних постів
pnpm run cli list

# Відправити конкретний пост
pnpm run cli send 01_post.md

# Інформація про бота
pnpm run cli info