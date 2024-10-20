import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

type ItemProps = {title: string};

const Tile = ({title}: ItemProps) => (
  <View style={styles.tile} onTouchStart={ () => {console.log(title); }}>
    <Text style={styles.tileTitle}>{title}</Text>
  </View>
)

let DATA: Array<ItemProps> = [];

const addTileData = (tileCount: number) => {
  for (var i=1; i <= tileCount; i++) {
    DATA.push({title: i.toString()})
  }
}

addTileData(9);

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>ステージ1</Text>
      </View>
      <View style={styles.tileContainer}>
        <FlatList
          data={DATA}
          numColumns={3}
          renderItem={({item}) => <Tile title={item.title} />}
          keyExtractor={item => item.title}
        />
      </View>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
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
  tileContainer: {
    marginTop: 32,
  },
  tile: {
    height: 80,
    margin: 2,
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    verticalAlign: 'middle',
    backgroundColor: 'skyblue',
  },
  tileTitle: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: 'red'
  },
});
