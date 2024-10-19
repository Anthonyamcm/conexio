import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Input, Text } from '../../../atoms';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { colors } from '@/src/utils';
import useLocationSearch from './useLocationSearch';

interface Location {
  city: string;
  region: string;
  latitude: number;
  longitude: number;
}

interface LocationSearchProps {
  onSelect: (item: Location) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onSelect }) => {
  const {
    query,
    handleChange,
    locations,
    loading,
    setQuery,
    setLocations,
    cancelFetch,
  } = useLocationSearch();

  const handleSelect = useCallback(
    (item: Location) => {
      cancelFetch(); // Cancel any ongoing fetch to prevent API calls
      setQuery(`${item.city}, ${item.region}`); // Update input field
      // **Best Practice:** Clear locations to hide the suggestions list
      setLocations([]);
      Keyboard.dismiss(); // Dismiss the keyboard for better UX
    },
    [onSelect],
  );

  const renderItem = useCallback(
    ({ item }: { item: Location }) => (
      <LocationListItem item={item} onSelect={handleSelect} />
    ),
    [handleSelect],
  );

  const LocationListItem = React.memo(
    ({
      item,
      onSelect,
    }: {
      item: Location;
      onSelect: (item: Location) => void;
    }) => (
      <TouchableOpacity onPress={() => onSelect(item)} style={styles.listItem}>
        <Text preset="bold" size="md">{`${item.city}, ${item.region}`}</Text>
      </TouchableOpacity>
    ),
  );

  const keyExtractor = useCallback(
    (item: Location) =>
      `${item.city}-${item.region}-${item.latitude}-${item.longitude}`,
    [],
  );

  return (
    <View style={styles.container}>
      <Input
        value={query}
        onChangeText={handleChange}
        style={styles.input}
        placeholder="Enter city or region"
        LeftAccessory={() => (
          <FontAwesome
            name="search"
            size={24}
            color={colors.palette.neutral400}
            style={styles.icon}
          />
        )}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {loading && query.length >= 3 ? (
        <ActivityIndicator animating={true} style={styles.loader} />
      ) : (
        <FlatList
          data={locations}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    marginBottom: 8,
  },
  icon: {
    alignSelf: 'center',
    marginLeft: 6,
  },
  loader: {
    marginVertical: 10,
  },
  listItem: {
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.palette.neutral200,
  },
  list: {
    flex: 1,
  },
});

export default React.memo(LocationSearch);
