import { colors } from '@/src/utils';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ProfilePhotoProps {
  uri: string | null;
  onEdit: (event: GestureResponderEvent) => void;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ uri, onEdit }) => {
  return (
    <View>
      <TouchableOpacity onPress={onEdit} accessibilityLabel="Profile Photo">
        {uri ? (
          <Image source={{ uri }} style={styles.profilePhoto} />
        ) : (
          <View style={[styles.profilePhoto, styles.placeholder]}>
            <Ionicons
              name="camera"
              size={64}
              color={colors.palette.neutral300}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profilePhoto: {
    width: 175,
    height: 175,
    borderRadius: 175 / 2,
    borderColor: colors.palette.neutral100,
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: colors.palette.neutral200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default ProfilePhoto;
