import CountDownPanel from '@/components/CountDownPanel';
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

type ItemProps = { title: string, index: number };

let DATA: Array<ItemProps> = [];

const addTileData = (tileCount: number) => {
  for (var i = 1; i <= tileCount; i++) {
    DATA.push({ title: i.toString(), index: i })
  }
}

addTileData(9);

export default function HomeScreen() {
  const panelCount = 5;
  const [gameState, setGameState] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [index, setIndex] = useState(0);
  const [numbers, setNumbers] = useState(Array<number>());
  const [answerStep, setAnswerStep] = useState(0);
  const [countDownNum, setCountDownNum] = useState(3);
  const [countDownIsVisible, setCountDownIsVisible] = useState(false);
  const [visibleIndex, setVisibleIndex] = useState(0);

  const flashBackgroundWith = (backgroundColor: string) => {
    setBackgroundColor(backgroundColor);
    setTimeout(() => {
      setBackgroundColor('transparent');
    }, 200);
  }

  const judgeAnswer = (touchPanelNumber: number) => {
    if (touchPanelNumber == numbers[answerStep]) {
      flashBackgroundWith('pink');
    } else {
      flashBackgroundWith('red');
    }
    setAnswerStep((prev) => prev + 1);
    if (answerStep >= numbers.length - 1) {
      setAnswerStep(0);
      setGameState(0);
      console.log("終了");
    }
  }

  const Tile = ({ title, index }: ItemProps) => {
    const touchedAction = () => {
      playSound();
      console.log(index);
      judgeAnswer(index);
    }

    return (
      <View style={styles.tile} onTouchStart={touchedAction}>
        <Text style={visibleIndex == index ? styles.tileTitle : styles.hidden}>{title}</Text>
      </View>
    );
  }

  const arrayShuffle = (array: Array<number>) => {
    for (let i = (array.length - 1); 0 < i; i--) {
      let r = Math.floor(Math.random() * (i + 1));
      let tmp = array[i];
      array[i] = array[r];
      array[r] = tmp;
    }

    return array;
  }

  const countDownStart = () => {
    setCountDownNum(3);
    setCountDownIsVisible(true);
    const countDownInterval = setInterval(() => {
      setCountDownNum((prev) => {
        if (prev >= 2) {
          return prev - 1;
        } else {
          setGameState((prev) => 1);
          setCountDownIsVisible((prev) => false);
          clearInterval(countDownInterval);
          return 0;
        }
      });
    }, 500);
    setCountDownIsVisible(true);
  }

  const questionStart = () => {
    let numbers = Array<number>();
    for (var i = 1; i <= panelCount; i++) {
      numbers.push(i);
    }
    numbers = arrayShuffle(numbers);
    setNumbers(numbers);

    const interval = setInterval(() => {
      setIndex(prevIndex => {
        if (prevIndex <= numbers.length) {
          setVisibleIndex(numbers[prevIndex]);
          return prevIndex + 1;
        } else {
          clearInterval(interval);
          setGameState(prevState => 2);
          return 0;
        }
      });
    }, 500);
  }

  const answerStart = () => {
    console.log(numbers);
  }

  const gameStart = () => {
    console.log('gameStart');
    countDownStart();
  };

  useEffect(() => {
    if (gameState == 1) {
      questionStart();
    }

    if (gameState == 2) {
      answerStart();
    }
  }, [gameState]);

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>ステージ1</Text>
      </View>
      <TouchableOpacity
        disabled={gameState == 0 ? false : true }
        style={[{ marginTop: 20 }, {backgroundColor: gameState == 0 ? 'white' : 'gray' }]}
        onPress={() => gameStart()}
      >
        <Text style={{ fontSize: 40 }}>GAME START</Text>
      </TouchableOpacity>
      <View style={styles.tileContainer}>
        <FlatList
          data={DATA}
          numColumns={3}
          renderItem={({ item }) => <Tile title={item.title} index={item.index} />}
          keyExtractor={(item, index) => item.title}
          scrollEnabled={false}
        />
      </View>
      <CountDownPanel count={countDownNum} isVisible={countDownIsVisible} key={countDownNum} />
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
