import { OpenSourceUABot } from './bot';

interface CLIOptions {
  command: string;
  args: string[];
}

class CLI {
  private bot: OpenSourceUABot;

  constructor() {
    this.bot = new OpenSourceUABot();
  }

  async run(options: CLIOptions): Promise<void> {
    const { command, args } = options;

    switch (command) {
      case 'test':
        await this.testConnection();
        break;
      case 'list':
        await this.listPosts();
        break;
      case 'send':
        if (args.length === 0) {
          console.error('Error: Post filename required');
          console.log('Usage: pnpm cli send <post_file.md>');
          process.exit(1);
        }
        await this.sendPost(args[0]);
        break;
      case 'send-image-post':
        if (args.length === 0) {
          console.error('Error: Post filename required');
          console.log('Usage: pnpm cli send <post_file.md>');
          process.exit(1);
        }
        await this.sendImagePost(args[0]);
        break;
      case 'info':
        await this.showBotInfo();
        break;
      default:
        this.showHelp();
        process.exit(1);
    }
  }

  private async testConnection(): Promise<void> {
    try {
      console.log('🔍 Testing bot connection...');
      const info = await this.bot.getBotInfo();
      console.log('✅ Bot connection successful!');
      console.log(`   Bot username: @${info.username}`);
      console.log(`   Bot ID: ${info.id}`);
    } catch (error) {
      console.error('❌ Failed to connect to Telegram bot');
      console.error(error);
      process.exit(1);
    }
  }

  private async listPosts(): Promise<void> {
    try {
      const posts = await this.bot.listPosts();

      if (posts.length > 0) {
        console.log('📄 Available posts:');
        posts.forEach((post, i) => {
          console.log(`  ${i + 1}. ${post}`);
        });
      } else {
        console.log('No posts found in the posts directory.');
      }
    } catch (error) {
      console.error('❌ Error listing posts:', error);
      process.exit(1);
    }
  }

  private async sendPost(postFile: string): Promise<void> {
    try {
      const targetChatId = process.env.TELEGRAM_CHANNEL_ID;

      if (!targetChatId) {
        console.error(
          'Error: No chat ID specified. Set TELEGRAM_CHANNEL_ID in .env or pass as argument'
        );
        process.exit(1);
      }

      console.log(`📤 Sending post "${postFile}" to ${targetChatId}...`);
      const success = await this.bot.sendPostFromFile(postFile, targetChatId);

      if (success) {
        console.log(
          `✅ Post "${postFile}" sent successfully to ${targetChatId}`
        );
      } else {
        console.log(`❌ Failed to send post "${postFile}"`);
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Error sending post:', error);
      process.exit(1);
    }
  }

  private async sendImagePost(postFile: string): Promise<void> {
    try {
      const targetChatId = process.env.TELEGRAM_CHANNEL_ID;

      if (!targetChatId) {
        console.error(
          'Error: No chat ID specified. Set TELEGRAM_CHANNEL_ID in .env or pass as argument'
        );
        process.exit(1);
      }

      console.log(`📤 Sending post "${postFile}" to ${targetChatId}...`);
      const success = await this.bot.sendPostWithImage(postFile, targetChatId);

      if (success) {
        console.log(
          `✅ Post "${postFile}" sent successfully to ${targetChatId}`
        );
      } else {
        console.log(`❌ Failed to send post "${postFile}"`);
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Error sending post:', error);
      process.exit(1);
    }
  }

  private async showBotInfo(): Promise<void> {
    try {
      const info = await this.bot.getBotInfo();
      console.log('🤖 Bot Information:');
      console.log(`   ID: ${info.id}`);
      console.log(`   Username: @${info.username}`);
      console.log(`   Name: ${info.firstName}`);
      console.log(`   Is Bot: ${info.isBot}`);
      console.log('\n🇺🇦 Open Source Ukraine Community');
    } catch (error) {
      console.error('❌ Error getting bot info:', error);
      process.exit(1);
    }
  }

  private showHelp(): void {
    console.log('🇺🇦 Open Source UA Bot CLI');
    console.log('Usage:');
    console.log('  pnpm cli test                    # Test bot connection');
    console.log('  pnpm cli list                    # List available posts');
    console.log('  pnpm cli send <post> [chatId]    # Send a post');
    console.log('  pnpm cli send-image-post <post> [chatId]    # Send a post');
    console.log('  pnpm cli info                    # Show bot information');
    console.log('  pnpm cli help                    # Show this help');
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    const cli = new CLI();
    cli['showHelp']();

    process.exit(0);
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  const cli = new CLI();
  await cli.run({ command, args: commandArgs });
}

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ CLI Error:', error);
    process.exit(1);
  });
}
