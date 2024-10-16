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
    baseUrl: 'https://www.facebook.com/',
  },
  {
    key: 'instagram',
    name: 'Instagram',
    icon: 'instagram',
    baseUrl: 'https://www.instagram.com/',
  },
  {
    key: 'twitter',
    name: 'Twitter',
    icon: 'twitter',
    baseUrl: 'https://twitter.com/',
  },
  {
    key: 'github',
    name: 'GitHub',
    icon: 'github',
    baseUrl: 'https://github.com/',
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    icon: 'linkedin',
    baseUrl: 'https://www.linkedin.com/in/',
  },
  {
    key: 'spotify',
    name: 'Spotify',
    icon: 'spotify',
    baseUrl: 'https://www.spotify.com/',
  },
  {
    key: 'soundcloud',
    name: 'SoundCloud',
    icon: 'soundcloud',
    baseUrl: 'https://www.soundcloud.com/',
  },
  {
    key: 'youtube',
    name: 'YouTube',
    icon: 'youtube',
    baseUrl: 'https://www.youtube.com/',
  },
  {
    key: 'discord',
    name: 'Discord',
    icon: 'discord',
    baseUrl: 'https://www.discord.com/',
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
    baseUrl: 'https://www.reddit.com/',
  },
  {
    key: 'tiktok',
    name: 'TikTok',
    icon: 'tiktok',
    baseUrl: 'https://www.tiktok.com/',
  },
];
