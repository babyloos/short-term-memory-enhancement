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
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>ステージ1</Text>
      </View>
      {/* <FlatList
        data={DATA}
        numColumns={3}
        renderItem={({item}) => <Tile title={item.title} />}
        keyExtractor={item => item.title}
      /> */}
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#334455',
  },
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
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
