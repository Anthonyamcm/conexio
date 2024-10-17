import { FontAwesome6 } from '@expo/vector-icons';

export interface SocialPlatform {
  key: string;
  name: string;
  icon: keyof typeof FontAwesome6.glyphMap; // Icon name from FontAwesome or your chosen icon library
  baseUrl: string; // Base URL to append the user identifier
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    key: 'facebook',
    name: 'Facebook',
    icon: 'facebook',
    baseUrl: 'https://www.facebook.com/{username}',
  },
  {
    key: 'instagram',
    name: 'Instagram',
    icon: 'instagram',
    baseUrl: 'https://www.instagram.com/{username}',
  },
  {
    key: 'twitter',
    name: 'Twitter',
    icon: 'twitter',
    baseUrl: 'https://twitter.com/{username}',
  },
  {
    key: 'github',
    name: 'GitHub',
    icon: 'github',
    baseUrl: 'https://github.com/{username}',
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    icon: 'linkedin',
    baseUrl: 'https://www.linkedin.com/in/{username}',
  },
  {
    key: 'spotify',
    name: 'Spotify',
    icon: 'spotify',
    baseUrl: 'https://www.spotify.com/{username}',
  },
  {
    key: 'soundcloud',
    name: 'SoundCloud',
    icon: 'soundcloud',
    baseUrl: 'https://www.soundcloud.com/{username}',
  },
  {
    key: 'youtube',
    name: 'YouTube',
    icon: 'youtube',
    baseUrl: 'https://www.youtube.com/{username}',
  },
  {
    key: 'discord',
    name: 'Discord',
    icon: 'discord',
    baseUrl: 'https://www.discord.com/{username}',
  },
  {
    key: 'twitch',
    name: 'Twitch',
    icon: 'twitch',
    baseUrl: 'https://www.twitch.com/',
  },
  {
    key: 'reddit',
    name: 'Reddit',
    icon: 'reddit',
    baseUrl: 'https://www.reddit.com/{username}',
  },
  {
    key: 'tiktok',
    name: 'TikTok',
    icon: 'tiktok',
    baseUrl: 'https://www.tiktok.com/{username}',
  },
];
