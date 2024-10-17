import React from 'react';
import { Button, Screen, Text } from '@/src/components/atoms';
import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, spacing } from '@/src/utils';
import { useRouter } from 'expo-router';

export default function ProfileCreationIndex() {
  const router = useRouter();
  const handleCreateProfile = () => {
    router.push('/app/profile/create');
  };

  const handleSkip = () => {
    router.replace('/app/tabs');
  };
  return (
    <Screen
      preset="fixed"
      contentContainerStyle={{
        flex: 1,
        paddingHorizontal: spacing.lg,
      }}
    >
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          gap: 15,
        }}
      >
        <Ionicons
          name="checkmark-circle"
          size={64}
          color={colors.palette.success100}
        />
        <Text preset="subheading" style={{ textAlign: 'center' }}>
          {'Success! Your account has been created.'}
        </Text>
        <Text preset="bold" style={{ textAlign: 'center' }}>
          {
            'Create your profile now to personalize your experience or set it up later—your choice!'
          }
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 15,
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Button
          preset={'default'}
          style={{ flex: 1 }}
          onPress={() => handleSkip()}
        >
          {'Skip for Now'}
        </Button>
        <Button
          preset={'gradient'}
          gradient={[colors.palette.primary100, colors.palette.secondary100]}
          onPress={() => handleCreateProfile()}
        >
          {'Create Profile'}
        </Button>
      </View>
    </Screen>
  );
}
