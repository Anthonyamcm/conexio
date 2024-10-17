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
import { colors } from '@/src/utils';

interface CoverPhotoProps {
  uri: string | null;
  onEdit: (event: GestureResponderEvent) => void;
}

const CoverPhoto: React.FC<CoverPhotoProps> = ({ uri, onEdit }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onEdit} accessibilityLabel="Edit Cover Photo">
        {uri ? (
          <Image source={{ uri }} style={styles.coverPhoto} />
        ) : (
          <View style={[styles.coverPhoto, styles.placeholder]}>
            <Ionicons
              name="image"
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
  container: {
    borderRadius: 16,
    width: '100%',
  },
  coverPhoto: {
    borderRadius: 16,
    height: 175,
    width: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    borderRadius: 16,
    backgroundColor: colors.palette.neutral200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CoverPhoto;
