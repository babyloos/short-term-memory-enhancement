import CountDownPanel from '@/components/CountDownPanel';
import ResultPanel from '@/components/ResultPanel';
import TimerPanel from '@/components/TimerPanel';
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
import colors from '../util/constants';

type TileDataProps = { index: number, isEnable: boolean };

const HomeScreen = () => {
    // export default function HomeScreen() {
    // ゲームの状態, 0: 出題開始, 1: 出題中, 2: 回答開始 3: 回答中, 4: 結果表示中
    const STATE_START_QUESTION = 0;
    const STATE_INPROGRESS_QUESTION = 1;
    const STATE_START_ANSWER = 2;
    const STATE_INPROGRESS_ANSWER = 3;
    const STATE_RESULT = 4;

    const ANSWER_TIME_LIMIT = 3;

    const panelCount = 9;
    const countStartNum = 4;
    const [gameState, setGameState] = useState(STATE_START_QUESTION);
    const [correctNum, setCorrectNum] = useState(0);
    const [backgroundColor, setBackgroundColor] = useState('');
    const [index, setIndex] = useState(0);
    const [numbers, setNumbers] = useState(Array<number>());
    const [answerStep, setAnswerStep] = useState(0);
    const [countDownNum, setCountDownNum] = useState(countStartNum);
    const [countDownIsVisible, setCountDownIsVisible] = useState(false);
    const [visibleIndex, setVisibleIndex] = useState(0);
    const [tileData, setTileData] = useState(Array<TileDataProps>);
    const [leftTime, setLeftTime] = useState(ANSWER_TIME_LIMIT);
    const [leftTimeInterval, setLeftTimeInterval] = useState<NodeJS.Timeout>();
    const bpm = 125;
    const beatInterval = (60 / bpm) * 1000;

    const enterTitleSound = useRef<Audio.Sound | null>(null);
    const bgm = useRef<Audio.Sound | null>(null);
    const countDownSound = useRef<Audio.Sound | null>(null);

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

        {
            const { sound } = await Audio.Sound.createAsync(require('../../assets/sounds/countDown.mp3'));
            countDownSound.current = sound;
        }
    }

    const addTileData = (tileCount: number) => {
        let data = Array<TileDataProps>();
        for (var i = 1; i <= tileCount; i++) {
            data.push({ index: i, isEnable: true })
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
            console.log("touched failed");
            return false;
        }
    }

    const failedAction = (): void => {
        flashBackgroundWith('red');
        setGameState(STATE_RESULT);
    }

    const Tile = ({ index, isEnable }: TileDataProps) => {
        const touchedAction = () => {
            if (!isEnable || (gameState != STATE_INPROGRESS_ANSWER && gameState != STATE_START_ANSWER)) {
                return;
            }
            playSound(enterTitleSound);
            if (judgeAnswer(index)) {
                setCorrectNum((prev) => prev + 1);
            } else {
                failedAction();
            }

            setAnswerStep((prev) => prev + 1);
            if (answerStep >= numbers.length - 1) {
                setGameState(STATE_RESULT);
            }

            tileData[index - 1].isEnable = false;
        }

        return (
            <TouchableOpacity style={[styles.tile, { backgroundColor: visibleIndex != index && isEnable ? colors.panel : colors.orange }]} onPressIn={touchedAction}>
            </TouchableOpacity>
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
        setCountDownNum(countStartNum);
        setCountDownIsVisible(true);
        playSound(countDownSound);
        const countDownInterval = setInterval(() => {
            setCountDownNum((prev) => {
                if (prev >= 2) {
                    playSound(countDownSound);
                    return prev - 1;
                } else {
                    setGameState((prev) => prev + 1);
                    setCountDownIsVisible((prev) => false);
                    clearInterval(countDownInterval);
                    return 0;
                }
            });
        }, beatInterval);
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
                    setGameState(prevState => STATE_START_ANSWER);
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
        playSound(bgm);
        setLeftTime(ANSWER_TIME_LIMIT);
        const interval = setInterval(() => {
            setLeftTime(prev => {
                if (prev > 1) {
                    return prev - 1;
                } else {
                    clearInterval(interval);
                    failedAction();
                    return prev - 1;
                }
            });
        }, 1000);
        setLeftTimeInterval(interval);
    }

    useEffect(() => {
        setLeftTime(prev => {
            return ANSWER_TIME_LIMIT;
        })
    }, [answerStep]);

    useEffect(() => {
        if (gameState == STATE_START_QUESTION) {
            resetTileData();
            countDownStart();
        }

        if (gameState == STATE_INPROGRESS_QUESTION) {
            playSound(bgm);
            questionStart();
        }

        if (gameState == STATE_START_ANSWER) {
            console.log(numbers);
            setGameState(prev => prev + 1);
        }

        if (gameState == STATE_INPROGRESS_ANSWER) {
            answerStart();
        }

        if (gameState == STATE_RESULT) {
            clearInterval(leftTimeInterval);
            stopSound(bgm);
        }

        console.log("gameState: " + gameState);
    }, [gameState]);

    return (
        <View style={[styles.container]}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>ステージ1</Text>
            </View>
            <TimerPanel count={leftTime} isVisible={gameState == STATE_INPROGRESS_ANSWER} />
            <View style={styles.tileContainer}>
                <FlatList
                    data={tileData}
                    numColumns={3}
                    renderItem={({ item }) => <Tile index={item.index} isEnable={item.isEnable} />}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                />
            </View>
            <CountDownPanel count={countDownNum} isVisible={countDownIsVisible} key={countDownNum} />
            <ResultPanel result={correctNum} isVisible={gameState == 4} rePlayCallback={() => { setGameState(STATE_START_QUESTION) }}></ResultPanel>
        </View >
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleContainer: {
        marginTop: 62,
        height: 62,
        justifyContent: 'center',
        backgroundColor: colors.base,
        marginHorizontal: '10%',
        borderRadius: 6,
        shadowColor: colors.baseShadow,
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.5,
    },
    title: {
        fontSize: 32,
        textAlign: 'center',
        fontWeight: '600',
        color: colors.text,
    },
    tileContainer: {
        marginTop: 24,
        marginLeft: 12,
        marginRight: 12,
    },
    tile: {
        margin: 4,
        flex: 1,
        aspectRatio: 1,
        justifyContent: 'center',
        verticalAlign: 'middle',
        backgroundColor: colors.panel,
        borderRadius: 6,
    },
});


