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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
  },
  coverPhoto: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: 175,
    resizeMode: 'cover',
    width: '100%',
  },
  placeholder: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: colors.palette.neutral200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CoverPhoto;
