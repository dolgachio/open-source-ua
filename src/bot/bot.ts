import { Bot, InlineKeyboard, InputFile } from 'grammy';
import { readdir, readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { config } from '../config.js';
import telegramifyMarkdown from 'telegramify-markdown';
import yaml from 'js-yaml';
import { BotInfo, PostMetadata } from './bot.types';

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
      let fileContent = await readFile(postPath, 'utf-8');

      // Parse metadata from the content (YAML front matter or legacy format)
      const metadata = this.parsePostMetadata(fileContent);

      let processedContent = metadata.content;
      if (isSanitizeMarkdown) {
        processedContent = telegramifyMarkdown(metadata.content, 'keep');
      }

      // Create inline keyboard if button is specified
      let keyboard: InlineKeyboard | undefined;
      if (metadata.button_text && metadata.button_url) {
        keyboard = new InlineKeyboard().url(
          metadata.button_text,
          metadata.button_url
        );
      }

      // If image is specified in metadata, send as photo
      if (metadata.image) {
        const isUrl =
          metadata.image.startsWith('http://') ||
          metadata.image.startsWith('https://');
        const imageSource = isUrl
          ? metadata.image
          : new InputFile(resolve(this.postsDir, metadata.image));

        await this.bot.api.sendPhoto(chatId, imageSource, {
          caption: processedContent,
          parse_mode: 'MarkdownV2',
          reply_markup: keyboard,
        });
        console.log(`✅ Post with image sent successfully to ${chatId}`);
        return true;
      }

      return await this.sendMessage(
        chatId,
        processedContent,
        'MarkdownV2',
        keyboard
      );
    } catch (error) {
      console.error(`❌ Error reading post file ${postFile}:`, error);
      return false;
    }
  }

  private parsePostMetadata(content: string): PostMetadata {
    // First try to parse YAML front matter
    const yamlFrontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const yamlMatch = content.match(yamlFrontMatterRegex);

    if (yamlMatch) {
      try {
        const frontMatter = yaml.load(yamlMatch[1]) as any;
        const postContent = yamlMatch[2];

        return {
          title: frontMatter.title,
          date: frontMatter.date,
          author: frontMatter.author,
          tags: frontMatter.tags,
          button_text: frontMatter.button_text,
          button_url: frontMatter.button_url,
          image: frontMatter.image,
          description: frontMatter.description,
          content: postContent,
        };
      } catch (error) {
        console.error('Error parsing YAML front matter:', error);
      }
    }

    // Fallback to legacy format for backwards compatibility
    const lines = content.split('\n');
    let buttonText: string | undefined;
    let buttonUrl: string | undefined;
    let imagePath: string | undefined;
    let contentStartIndex = 0;

    // Skip empty lines after metadata
    while (
      contentStartIndex < lines.length &&
      lines[contentStartIndex] === ''
    ) {
      contentStartIndex++;
    }

    return {
      button_text: buttonText,
      button_url: buttonUrl,
      image: imagePath,
      content: lines.slice(contentStartIndex).join('\n').trim(),
    };
  }

  async sendPostWithImage(postFile: string, chatId: string): Promise<boolean> {
    try {
      const postPath = join(this.postsDir, postFile);
      let fileContent = await readFile(postPath, 'utf-8');

      // Parse metadata from the content (YAML front matter or legacy format)
      const metadata = this.parsePostMetadata(fileContent);
      const processedContent = telegramifyMarkdown(metadata.content, 'keep');

      // Use provided imageUrl parameter, but fallback to metadata image if not provided
      const finalImageUrl = metadata.image;
      if (!finalImageUrl) {
        throw new Error('No image URL provided');
      }

      // Check if imageUrl is a local file path or URL
      const isUrl =
        finalImageUrl.startsWith('http://') ||
        finalImageUrl.startsWith('https://');
      const imageSource = isUrl
        ? finalImageUrl
        : new InputFile(join(this.postsDir, finalImageUrl));

      // Create inline keyboard if button is specified
      let keyboard: InlineKeyboard | undefined;
      if (metadata.button_text && metadata.button_url) {
        keyboard = new InlineKeyboard().url(
          metadata.button_text,
          metadata.button_url
        );
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
