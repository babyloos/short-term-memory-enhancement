import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
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
  for (var i=1; i <= tileCount; i++) {
    DATA.push({title: i.toString(), index: i})
  }
}

addTileData(9);

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const panelCount = 9;
  const [numbers, setNumbers] = useState(Array<number>);
  const [visibleIndex, setVisibleIndex] = useState(0);

  const Tile = ({title, index}: ItemProps) => {
    return (
    <View style={styles.tile} onTouchStart={ () => {playSound()}}>
      <Text style={visibleIndex == index ? styles.tileTitle : styles.hidden }>{title}</Text>
    </View>
    );
  }

  const gameStart = () => {
    setNumbers([]);
    for (var i=0; i<panelCount; i++) {
      numbers.push(Math.floor(Math.random() * 9) + 1);
    }

    const interval = setInterval(() => {
      setIndex(prevIndex => {
        if (prevIndex < numbers.length) {
          setVisibleIndex(numbers[prevIndex + 1]);
          console.log(prevIndex + 1);
          return prevIndex + 1;
        } else {
          clearInterval(interval);
          setIndex(0);
          return prevIndex;
        }
      });
    }, 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>ステージ1</Text>
      </View>
      <TouchableOpacity style={{marginTop: 20, backgroundColor: 'red'}} onPress={() => gameStart()}>
        <Text style={{fontSize: 40}}>GAME START</Text>
      </TouchableOpacity>
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
