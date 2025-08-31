import { Bot, InlineKeyboard, InputFile } from 'grammy';
import { readdir, readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { config } from './config.js';
import telegramifyMarkdown from 'telegramify-markdown';

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

  private async sendMessage(
    chatId: string,
    text: string,
    parseMode: 'MarkdownV2' | 'HTML' = 'MarkdownV2',
    replyMarkup?: InlineKeyboard
  ): Promise<boolean> {
    try {
      await this.bot.api.sendMessage(chatId, text, {
        parse_mode: parseMode,
        // Don't generate link previews
        link_preview_options: { is_disabled: true },
        reply_markup: replyMarkup,
      });
      console.log(`✅ Message sent successfully to ${chatId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to send message to ${chatId}:`, error);
      return false;
    }
  }

  async sendPostFromFile(
    postFile: string,
    chatId: string,
    isSanitizeMarkdown: boolean = true
  ): Promise<boolean> {
    try {
      const postPath = join(this.postsDir, postFile);
      let content = await readFile(postPath, 'utf-8');

      // Parse button metadata from the content
      const { content: actualContent, buttonText, buttonUrl } = this.parsePostMetadata(content);

      let processedContent = actualContent;
      if (isSanitizeMarkdown) {
        processedContent = telegramifyMarkdown(actualContent, 'keep');
      }

      // Create inline keyboard if button is specified
      let keyboard: InlineKeyboard | undefined;
      if (buttonText && buttonUrl) {
        keyboard = new InlineKeyboard().url(buttonText, buttonUrl);
      }

      return await this.sendMessage(chatId, processedContent, 'MarkdownV2', keyboard);
    } catch (error) {
      console.error(`❌ Error reading post file ${postFile}:`, error);
      return false;
    }
  }

  private parsePostMetadata(content: string): { 
    content: string; 
    buttonText?: string; 
    buttonUrl?: string; 
  } {
    const lines = content.split('\n');
    let buttonText: string | undefined;
    let buttonUrl: string | undefined;
    let contentStartIndex = 0;

    // Look for button metadata at the top of the file
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      if (line.startsWith('[BUTTON_TEXT]:')) {
        buttonText = line.replace('[BUTTON_TEXT]:', '').trim();
        contentStartIndex = Math.max(contentStartIndex, i + 1);
      } else if (line.startsWith('[BUTTON_URL]:')) {
        buttonUrl = line.replace('[BUTTON_URL]:', '').trim();
        contentStartIndex = Math.max(contentStartIndex, i + 1);
      }
    }

    // Skip empty lines after metadata
    while (contentStartIndex < lines.length && lines[contentStartIndex] === '') {
      contentStartIndex++;
    }

    return {
      content: lines.slice(contentStartIndex).join('\n').trim(),
      buttonText,
      buttonUrl,
    };
  }

  async sendPostWithImage(
    postFile: string,
    imageUrl: string,
    chatId: string
  ): Promise<boolean> {
    try {
      const postPath = join(this.postsDir, postFile);
      let content = await readFile(postPath, 'utf-8');

      // Parse button metadata from the content
      const { content: actualContent, buttonText, buttonUrl } = this.parsePostMetadata(content);

      const processedContent = telegramifyMarkdown(actualContent, 'keep');

      // Check if imageUrl is a local file path or URL
      const isUrl =
        imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
      const imageSource = isUrl
        ? imageUrl
        : new InputFile(join(this.postsDir, imageUrl));

      // Create inline keyboard if button is specified
      let keyboard: InlineKeyboard | undefined;
      if (buttonText && buttonUrl) {
        keyboard = new InlineKeyboard().url(buttonText, buttonUrl);
      }

      await this.bot.api.sendPhoto(chatId, imageSource, {
        caption: processedContent,
        parse_mode: 'MarkdownV2',
        reply_markup: keyboard,
      });

      console.log(`✅ Post with image sent successfully to ${chatId}`);
      return true;
    } catch (error) {
      console.error(`❌ Error sending post with image ${postFile}:`, error);
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
