import { Bot, InlineKeyboard } from 'grammy';
import { readdir, readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { config } from './config.js';

export interface BotInfo {
  id: number;
  username: string;
  firstName: string;
  isBot: boolean;
}

export class OpenSourceUABot {
  private bot: Bot;
  private postsDir: string;

  constructor(token?: string) {
    const botToken = token || config.TELEGRAM_BOT_TOKEN;
    this.bot = new Bot(botToken);
    this.postsDir = resolve(config.POST_DIRECTORY);

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Basic start command
    this.bot.command('start', ctx => {
      return ctx.reply('🇺🇦 Вітаю! Open Source UA бот готовий до роботи!');
    });

    // Get chat ID command - useful for finding channel/group IDs
    this.bot.command('chatid', ctx => {
      const chatId = ctx.chat.id;
      const chatType = ctx.chat.type;
      const chatTitle = 'title' in ctx.chat ? ctx.chat.title : ctx.chat.first_name;
      
      const message = `
📋 *Chat Information*

• **ID:** \`${chatId}\`
• **Type:** ${chatType}
• **Title/Name:** ${chatTitle}

💡 Use this ID in your .env file:
\`TELEGRAM_CHANNEL_ID=${chatId}\`
      `;
      
      return ctx.reply(message, { parse_mode: 'Markdown' });
    });

    // Help command
    this.bot.command('help', ctx => {
      const helpText = `
🤖 *Open Source UA Bot*

Доступні команди:
/start - Запустити бота
/help - Показати цю довідку
/posts - Показати доступні пости
/info - Інформація про бота

🇺🇦 Слава Україні!
      `;
      return ctx.reply(helpText, { parse_mode: 'Markdown' });
    });

    // List posts command
    this.bot.command('posts', async ctx => {
      try {
        const posts = await this.listPosts();
        if (posts.length === 0) {
          return ctx.reply('📄 Поки що немає доступних постів.');
        }

        const keyboard = new InlineKeyboard();
        posts.forEach((post, index) => {
          keyboard.text(`📄 ${post}`, `post_${index}`).row();
        });

        return ctx.reply('📄 Доступні пости:', { reply_markup: keyboard });
      } catch (error) {
        console.error('Error listing posts:', error);
        return ctx.reply('❌ Помилка при отриманні списку постів.');
      }
    });

    // Bot info command
    this.bot.command('info', async ctx => {
      const info = await this.getBotInfo();
      const infoText = `
🤖 *Інформація про бота*

• ID: \`${info.id}\`
• Username: @${info.username}
• Ім'я: ${info.firstName}
• Тип: ${info.isBot ? 'Бот' : 'Користувач'}

🇺🇦 Open Source Ukraine Community
      `;
      return ctx.reply(infoText, { parse_mode: 'Markdown' });
    });

    // Handle callback queries for posts
    this.bot.on('callback_query:data', async ctx => {
      const data = ctx.callbackQuery.data;
      if (data.startsWith('post_')) {
        const postIndex = parseInt(data.split('_')[1]);
        const posts = await this.listPosts();
        const post = posts[postIndex];

        if (post) {
          await this.sendPostFromFile(post, ctx.chat!.id.toString());
          await ctx.answerCallbackQuery(`✅ Пост "${post}" відправлено!`);
        } else {
          await ctx.answerCallbackQuery('❌ Пост не знайдено.');
        }
      }
    });

    // Error handling
    this.bot.catch(err => {
      console.error('Bot error:', err);
    });
  }

  async sendMessage(
    chatId: string,
    text: string,
    parseMode: 'Markdown' | 'HTML' = 'Markdown'
  ): Promise<boolean> {
    try {
      await this.bot.api.sendMessage(chatId, text, { parse_mode: parseMode });
      console.log(`✅ Message sent successfully to ${chatId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to send message to ${chatId}:`, error);
      return false;
    }
  }

  async sendPostFromFile(postFile: string, chatId: string): Promise<boolean> {
    try {
      const postPath = join(this.postsDir, postFile);
      const content = await readFile(postPath, 'utf-8');
      return await this.sendMessage(chatId, content);
    } catch (error) {
      console.error(`❌ Error reading post file ${postFile}:`, error);
      return false;
    }
  }

  async listPosts(): Promise<string[]> {
    try {
      const files = await readdir(this.postsDir);
      return files.filter(file => file.endsWith('.md'));
    } catch (error) {
      console.warn('Posts directory not found or empty:', this.postsDir);
      return [];
    }
  }

  async getBotInfo(): Promise<BotInfo> {
    try {
      const me = await this.bot.api.getMe();
      return {
        id: me.id,
        username: me.username || '',
        firstName: me.first_name,
        isBot: me.is_bot,
      };
    } catch (error) {
      console.error('❌ Failed to get bot info:', error);
      throw error;
    }
  }

  async start(): Promise<void> {
    try {
      console.log('🚀 Starting Open Source UA Bot...');
      const info = await this.getBotInfo();
      console.log(`✅ Bot connected: @${info.username}`);

      await this.bot.start();
    } catch (error) {
      console.error('❌ Failed to start bot:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      await this.bot.stop();
      console.log('🛑 Bot stopped successfully');
    } catch (error) {
      console.error('❌ Error stopping bot:', error);
    }
  }
}
