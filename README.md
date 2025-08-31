# Постинг і управління спільнотою 🇺🇦 Open Source UA

Автоматизований Telegram бот для керування спільнотою Open Source Ukraine. Цей бот допомагає з публікацією контенту, керуванням дискусіями та автоматизацією завдань спільноти.

## Функції

- 📤 Автоматичне постування в Telegram канали
- 📝 Підтримка Markdown постів
- 🔧 Керування конфігурацією
- 🚀 CLI інтерфейс для зручного використання
- 🧪 Покриття тестами
- 🇺🇦 Створено для української Open Source спільноти
- ⚡ Швидкий TypeScript + Node.js
- 📦 Керування пакетами з pnpm

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

#### Тестування з'єднання з ботом:
```bash
pnpm run dev
```

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
```

## Структура проекту

```
open-source-ua/
├── src/                    # TypeScript вихідний код
│   ├── index.ts           # Головна точка входу
│   ├── bot.ts             # Реалізація бота
│   ├── cli.ts             # Інтерфейс командного рядка
│   └── config.ts          # Керування конфігурацією
├── posts/                 # Директорія Markdown постів
├── dist/                  # Скомпільований JavaScript (генерується)
├── .env                   # Змінні середовища
├── package.json           # Залежності та скрипти
├── tsconfig.json          # Конфігурація TypeScript
├── .eslintrc.js          # Конфігурація ESLint
└── .prettierrc           # Конфігурація Prettier
```

## Технічний стек

- **🟢 Node.js** - JavaScript runtime
- **🔷 TypeScript** - Типізована надбудова над JavaScript
- **📦 pnpm** - Швидкий менеджер пакетів
- **🤖 grammY** - Сучасний фреймворк для Telegram ботів
- **✅ Zod** - Валідація схем TypeScript-first

🇺🇦 **Слава Україні!**