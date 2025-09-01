
export type BotInfo = {
  id: number;
  username: string;
  firstName: string;
  isBot: boolean;
}

export type PostMetadata = {
  title?: string;
  date?: string;
  author?: string;
  tags?: string[];
  button_text?: string;
  button_url?: string;
  image?: string;
  description?: string;
  content: string;
}