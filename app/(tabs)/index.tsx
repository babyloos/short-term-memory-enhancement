import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

async function playSound() {
  const { sound } = await Audio.Sound.createAsync(require('../../assets/sounds/enterTile.mp3'));
  await sound.playAsync();
}

type ItemProps = {title: string, index: number};

let DATA: Array<ItemProps> = [];

const addTileData = (tileCount: number) => {
  console.log("1回")
  for (var i=1; i <= tileCount; i++) {
    DATA.push({title: i.toString(), index: i})
  }
}

addTileData(9);

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [visibleIndex, setVisibleIndex] = useState(0);

  const Tile = ({title, index}: ItemProps) => {
    return (
    <View style={styles.tile} onTouchStart={ () => {playSound()}}>
      <Text style={visibleIndex == index ? styles.tileTitle : styles.hidden }>{title}</Text>
    </View>
    );
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (index <= numbers.length) {
        setVisibleIndex(index);
        console.log(index)
        setIndex(index+1)
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);  // クリーンアップ
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>ステージ1</Text>
      </View>
      <View style={styles.tileContainer}>
        <FlatList
          data={DATA}
          numColumns={3}
          renderItem={({item}) => <Tile title={item.title} index={item.index} />}
          keyExtractor={(item, index) => item.title}
          scrollEnabled={false}
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
    color: 'red',
  },
  hidden: {
    display: 'none',
  },
});
