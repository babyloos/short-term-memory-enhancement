import CountDownPanel from '@/components/CountDownPanel';
import ResultPanel from '@/components/ResultPanel';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

type TileDataProps = { title: string, index: number, isEnable: boolean };

export default function HomeScreen() {
    const panelCount = 3;
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
    const [tileData, setTileData] = useState(Array<TileDataProps>);
    const bpm = 125;
    const beatInterval = (60 / bpm) * 1000;

    const enterTitleSound = useRef<Audio.Sound | null>(null);
    const bgm = useRef<Audio.Sound | null>(null);

    useEffect(() => {
        loadSounds();
        addTileData(panelCount);
    }, []);

    const playSound = async (sound: React.MutableRefObject<Sound | null>) => {
        if (sound.current != null)
            await sound.current.replayAsync();
    }

    const stopSound = async (sound: React.MutableRefObject<Sound | null>) => {
        if (sound.current != null)
            await sound.current.stopAsync();
    }

    const loadSounds = async () => {
        {
            const { sound } = await Audio.Sound.createAsync(require('../../assets/sounds/enterTile.mp3'));
            enterTitleSound.current = sound;
        }

        {
            const { sound } = await Audio.Sound.createAsync(require('../../assets/sounds/drum_BPM123.mp3'));
            bgm.current = sound;
        }
    }

    const addTileData = (tileCount: number) => {
        let data = Array<TileDataProps>();
        for (var i = 1; i <= tileCount; i++) {
            data.push({ title: i.toString(), index: i, isEnable: true })
        }
        setTileData(data);
    }

    const resetTileData = () => {
        setTileData([]);
        addTileData(panelCount);
    }

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
            return false;
        }
    }

    const Tile = ({ title, index, isEnable }: TileDataProps) => {
        const touchedAction = () => {
            if (!isEnable || gameState != 2) return;
            playSound(enterTitleSound);
            if (judgeAnswer(index)) {
                flashBackgroundWith('pink');
                setCorrectNum((prev) => prev + 1);
            } else {
                flashBackgroundWith('red');
                setGameState(3);
            }

            setAnswerStep((prev) => prev + 1);
            if (answerStep >= numbers.length - 1) {
                setGameState(3);
            }

            tileData[index - 1].isEnable = false;
        }

        return (
            <View style={[styles.tile, { backgroundColor: isEnable ? 'skyblue' : 'gray' }]} onTouchStart={touchedAction}>
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

        const showTile = (setIndex: React.Dispatch<React.SetStateAction<number>>, numbers: number[], setVisibleIndex: React.Dispatch<React.SetStateAction<number>>, interval: NodeJS.Timeout | null, setGameState: React.Dispatch<React.SetStateAction<number>>) => {
            setIndex(prevIndex => {
                if (prevIndex <= numbers.length) {
                    setVisibleIndex(numbers[prevIndex]);
                    return prevIndex + 1;
                } else {
                    if (interval)
                        clearInterval(interval);
                    stopSound(bgm);
                    setGameState(prevState => 2);
                    return 0;
                }
            });
        }

        showTile(setIndex, numbers, setVisibleIndex, null, setGameState);
        const interval = setInterval(() => {
            showTile(setIndex, numbers, setVisibleIndex, interval, setGameState);
        }, beatInterval);
    }

    const answerStart = () => {
        setAnswerStep(0);
        console.log(numbers);
    }

    const gameStart = () => {
        console.log('gameStart');
    };

    useEffect(() => {
        if (gameState == 0) {
            resetTileData();
            countDownStart();
        }

        if (gameState == 1) {
            playSound(bgm);
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
                    data={tileData}
                    numColumns={3}
                    renderItem={({ item }) => <Tile title={item.title} index={item.index} isEnable={item.isEnable} />}
                    keyExtractor={(item, index) => item.title}
                    scrollEnabled={false}
                />
            </View>
            <CountDownPanel count={countDownNum} isVisible={countDownIsVisible} key={countDownNum} />
            <ResultPanel result={correctNum} isVisible={gameState == 3} rePlayCallback={() => { setGameState(0) }}></ResultPanel>
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


