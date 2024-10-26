import CountDownPanel from '@/components/CountDownPanel';
import ResultPanel from '@/components/ResultPanel';
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

type TileDataProps = { title: string, index: number, isEnable: boolean };

let DATA: Array<TileDataProps> = [];

const addTileData = (tileCount: number) => {
    for (var i = 1; i <= tileCount; i++) {
        DATA.push({ title: i.toString(), index: i, isEnable: true })
    }
}

const resetTileData = () => {
    for (var i=0; i<DATA.length; i++) {
        DATA[i].isEnable = true;
    }
}

addTileData(9);

export default function HomeScreen() {
    const panelCount = 9;
    // ゲームの状態, 0: ゲーム開始待機, 1: 出題中, 2: 回答中, 3: 結果表示中
    const [gameState, setGameState] = useState(0);
    const [correctNum, setCorrectNum] = useState(0);
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

    const judgeAnswer = (touchPanelNumber: number): boolean => {
        if (touchPanelNumber == numbers[answerStep]) {
            return true;
        } else {
            console.log('touchPanelNumber: ' + touchPanelNumber);
            console.log('ansertStep: ' + answerStep);
            console.log('numbers[ansertStep]: ' + numbers[answerStep]);
            return false;
        }
    }

    const Tile = ({ title, index, isEnable }: TileDataProps) => {
        const touchedAction = () => {
            playSound();
            if (judgeAnswer(index)) {
                flashBackgroundWith('pink');
                setCorrectNum((prev) => prev+1);
            } else {
                flashBackgroundWith('red');
                setGameState(3);
            }

            setAnswerStep((prev) => prev + 1);
            if (answerStep >= numbers.length - 1) {
                setGameState(3);
            }

            DATA[index-1].isEnable = false;
        }

        return (
            <View style={[styles.tile, {backgroundColor: isEnable ? 'skyblue' : 'gray'}]} onTouchStart={touchedAction}>
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
        setCorrectNum(0);

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
        setAnswerStep(0);
        console.log(numbers);
    }

    const gameStart = () => {
        console.log('gameStart');
        countDownStart();
    };

    useEffect(() => {
        if (gameState == 0) {
            console.log('resetTileData');
            resetTileData(); 
        }

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
                disabled={gameState == 0 ? false : true}
                style={[{ marginTop: 20 }, { backgroundColor: gameState == 0 ? 'white' : 'gray' }]}
                onPress={() => gameStart()}
            >
                <Text style={{ fontSize: 40 }}>GAME START</Text>
            </TouchableOpacity>
            <View style={styles.tileContainer}>
                <FlatList
                    data={DATA}
                    numColumns={3}
                    renderItem={({ item }) => <Tile title={item.title} index={item.index} isEnable={item.isEnable} />}
                    keyExtractor={(item, index) => item.title}
                    scrollEnabled={false}
                />
            </View>
            <CountDownPanel count={countDownNum} isVisible={countDownIsVisible} key={countDownNum} />
            <ResultPanel result={correctNum} isVisible={gameState == 3} rePlayCallback={() => {setGameState(0)}}></ResultPanel>
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
