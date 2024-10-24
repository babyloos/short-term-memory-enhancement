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
  const [gameState, setGameState] = useState(0);

  const [index, setIndex] = useState(0);
  const panelCount = 9;
  let numbers = Array<number>();
  const [visibleIndex, setVisibleIndex] = useState(0);

  type countProps = { count: number }
  const CountDownPanel = ({count}: countProps) => {
    return (
      <View style={styles.countDownPanel}>
        <Text style={styles.countDownPanelText}>{count}</Text>
      </View>
    );
  }

  const Tile = ({title, index}: ItemProps) => {
    return (
    <View style={styles.tile} onTouchStart={ () => {playSound()}}>
      <Text style={visibleIndex == index ? styles.tileTitle : styles.hidden }>{title}</Text>
    </View>
    );
  }

  const arrayShuffle = (array: Array<number>) => {
    for(let i = (array.length - 1); 0 < i; i--){
      let r = Math.floor(Math.random() * (i + 1));
      let tmp = array[i];
      array[i] = array[r];
      array[r] = tmp;
    }

    return array;
  }

  const gameStart = () => {
    console.log('gameStart');
    console.log(numbers);
    console.log(panelCount);
    for (var i=1; i<=panelCount; i++) {
      numbers.push(i);
    }
    numbers = arrayShuffle(numbers);

    const interval = setInterval(() => {
      setIndex(prevIndex => {
        if (prevIndex < numbers.length) {
          setVisibleIndex(numbers[prevIndex + 1]);
          console.log(prevIndex + 1);
          return prevIndex + 1;
        } else {
          console.log('clear interval');
          clearInterval(interval);
          setGameState(prevState => 1);
          console.log('game state: ' + gameState);
          return 0;
        }
      });
    }, 500);

  };

  useEffect(() => {
    if (gameState == 1) {
      console.log('回答開始');
    }
    setGameState(0);
    console.log('change game state: ' + gameState);
  }, [gameState]);

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
      <CountDownPanel count={0} />
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
  countDownPanel: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    alignSelf: 'center',
  },
  countDownPanelText: {
    color: 'brown',
    top: '-50%',
    left: '-50%',
    fontSize: 300,
  },
});
