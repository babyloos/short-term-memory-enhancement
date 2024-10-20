import { Stack } from 'expo-router';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { SafeAreaView } from 'react-native-safe-area-context';

type ItemProps = {title: string};

const Tile = ({title}: ItemProps) => {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}

const DATA = [
  {
    title: '1'
  },
  {
    title: '2'
  },
  {
    title: '3'
  },
]

export default function HomeScreen() {
  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>ステージ1</Text>
      </View>
      <FlatList
        data={DATA}
        numColumns={3}
        renderItem={({item}) => <Tile title={item.title} />}
        keyExtractor={item => item.title}
      />
    </View>
    );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 32,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginHorizontal: 100,
    fontWeight: '600',
    color: '#005500',
    backgroundColor: 'white',
  },
});
