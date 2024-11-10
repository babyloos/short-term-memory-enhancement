import CountDownPanel from '@/components/CountDownPanel';
import ResultPanel from '@/components/ResultPanel';
import TimerPanel from '@/components/TimerPanel';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import colors from '../util/constants';
import { useLocalSearchParams } from 'expo-router';

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
    const local = useLocalSearchParams();
    const stageNum: number = parseInt(local.stageNum[0]);
    const [questionCountState, setQuestionCountState] = useState(stageNum + 2);
    const [stageNumState, setStageNumState] = useState(stageNum);
    const countStartNum = 4;
    const [gameState, setGameState] = useState(STATE_START_QUESTION);
    const [isClear, setIsClear] = useState(false);
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
        if (sound.current != null) {
            await sound.current.setRateAsync(1.0, true);
            await sound.current.replayAsync();
        }
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
            return false;
        }
    }

    const failedAction = (): void => {
        flashBackgroundWith('red');
        setIsClear(false);
        setGameState(STATE_RESULT);
    }

    const Tile = ({ index, isEnable }: TileDataProps) => {
        const backgroundColor = useRef(new Animated.Value(0)).current;

        const touchedAction = () => {
            console.log('toucheActin');
            if (!isEnable || (gameState != STATE_INPROGRESS_ANSWER)) {
                return;
            }

            playSound(enterTitleSound);

            if (judgeAnswer(index)) {
                setCorrectNum((prev) => prev + 1);
            } else {
                failedAction();
            }

            setAnswerStep((prev) => prev + 1);
            if (answerStep >= questionCountState - 1) {
                setIsClear(true);
                setGameState(STATE_RESULT);
            }

            tileData[index - 1].isEnable = false;
            colorChange(false);
        }

        const animatedBackgroundColor = backgroundColor.interpolate({
            inputRange: [0, 1],
            outputRange: [colors.panel, colors.orange],
        });

        const colorChange = (isEnable: boolean) => {
            backgroundColor.stopAnimation();
            Animated.timing(backgroundColor, {
                toValue: isEnable ? 0 : 1,
                duration: 250,
                delay: 0,
                useNativeDriver: false,
            }).start(() => {
            });
        }

        useEffect(() => {
            if (gameState != STATE_INPROGRESS_QUESTION) return;
            colorChange(visibleIndex != index);
        }, [visibleIndex]);

        useEffect(() => {
            if (gameState != STATE_INPROGRESS_ANSWER) return;
            colorChange(isEnable);
        }, [isEnable]);

        return (
            <TouchableOpacity onPressIn={touchedAction}>
                <Animated.View style={[styles.tile, { backgroundColor: animatedBackgroundColor }]}>
                </Animated.View>
            </TouchableOpacity>
        )
    };

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
                if (prevIndex < questionCountState) {
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
            // changeEnable(false);
            resetTileData();
            countDownStart();
        }

        if (gameState == STATE_INPROGRESS_QUESTION) {
            playSound(bgm);
            questionStart();
        }

        if (gameState == STATE_START_ANSWER) {
            // changeEnable(true);
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

    const replay = () => {
        setGameState(STATE_START_QUESTION);
    }

    const nextPlay = () => {
        setStageNumState(prev => prev + 1);
        setQuestionCountState(prev => prev + 1);
        setGameState(STATE_START_QUESTION);
    }

    return (
        <View style={[styles.container]}>
            <View style={styles.gotopContainer}>
                <Text style={styles.gotop}>トップへ</Text>
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>ステージ{stageNumState}</Text>
            </View>
            <TimerPanel count={leftTime} isVisible={gameState == STATE_INPROGRESS_ANSWER} />
            <View style={styles.tileContainer}>
                <FlatList
                    data={tileData}
                    numColumns={3}
                    renderItem={({ item }) => <Tile index={item.index} isEnable={item.isEnable} />}
                    keyExtractor={(item, index) => item.index.toString()}
                    scrollEnabled={false}
                />
            </View>
            <CountDownPanel count={countDownNum} isVisible={countDownIsVisible} key={countDownNum} />
            <ResultPanel isVisible={gameState == 4} isClear={isClear} rePlayCallback={() => { replay(); }} nextPlayCallback={() => { nextPlay(); }} ></ResultPanel>
        </View >
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gotopContainer: {
        marginTop: 12,
        height: 48,
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.base,
        marginHorizontal: '10%',
        borderRadius: 6,
        shadowColor: colors.baseShadow,
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.5,
    },
    gotop: {
        fontSize: 22,
        fontWeight: '500',
        color: colors.text,
    },
    titleContainer: {
        marginTop: 38,
        height: 62,
        justifyContent: 'center',
        backgroundColor: colors.base,
        marginHorizontal: '20%',
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
        width: '54%',
        aspectRatio: 1,
        justifyContent: 'center',
        verticalAlign: 'middle',
        borderRadius: 6,
    },
});
