import CountDownPanel from '@/components/CountDownPanel';
import ResultPanel from '@/components/ResultPanel';
import TimerPanel from '@/components/TimerPanel';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import colors from '../util/constants';
import { Link, useFocusEffect, useLocalSearchParams } from 'expo-router';
import strage from '../util/gameStrage';

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
    type params = { stageNum: string };
    const local = useLocalSearchParams<params>();
    const stageNum: number = parseInt(local.stageNum);
    const [questionCountState, setQuestionCountState] = useState(0);
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
    const [speed, setSpeed] = useState(1.3);
    const defaultBpm = 125;
    const [bpm, setBpm] = useState(defaultBpm * speed);
    const [beatInterval, setBeatInterval] = useState((60 / bpm) * 1000);

    const enterTitleSound = useRef<Audio.Sound | null>(null);
    const bgm = useRef<Audio.Sound | null>(null);
    const countDownSound = useRef<Audio.Sound | null>(null);

    const setQuestionCount = () => {
        const questionCount = Math.floor(stageNumState / 5) + 3;
        setQuestionCountState(questionCount);
    };

    const updateSpeed = () => {
        setBpm(defaultBpm * speed);
        setBeatInterval((60 / (bpm * speed)) * 1000);
        console.log('speed: ' + speed);
        console.log('beat interval: ' + beatInterval);
    };

    useEffect(() => {
        updateSpeed();
        loadSounds();
        addTileData(panelCount);
        setQuestionCount();
    }, []);

    useEffect(() => {
        console.log('beat interval: ' + beatInterval);
    }, [beatInterval]);

    useFocusEffect(
        useCallback(() => {
            return async () => {
                stopSound(bgm);
                if (bgm.current != null) {
                    await bgm.current.unloadAsync();
                }
            };
        }, []),
    );

    const playSound = async (sound: React.MutableRefObject<Sound | null>) => {
        if (sound.current != null) {
            await sound.current.setRateAsync(speed, true);
            await sound.current.replayAsync();
        }
    }

    const stopSound = async (sound: React.MutableRefObject<Sound | null>) => {
        if (sound.current != null) {
            await sound.current.stopAsync();
        }
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
            if (gameState != STATE_INPROGRESS_ANSWER) {
                return;
            }

            // console.log('touchAction');

            playSound(enterTitleSound);

            if (judgeAnswer(index)) {
                setCorrectNum((prev) => prev + 1);
            } else {
                failedAction();
            }

            setAnswerStep((prev) => prev + 1);
            if (answerStep >= questionCountState - 1) {
                setIsClear(true);
                strage.addClearedStage(stageNumState);
                setGameState(STATE_RESULT);
            }

            setVisibleIndex(prev => index);
        }

        return (
            <TouchableOpacity style={[styles.tile, { backgroundColor: visibleIndex != index ? colors.panel : colors.orange }]} onPressIn={touchedAction}>
            </TouchableOpacity>
        )
    };

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

    const getRandomInt = (max: number) => {
        return Math.floor(Math.random() * max);
    }

    const questionStart = () => {
        let numbers = Array<number>();
        let beforeNum = 0;
        for (var i = 0; i < questionCountState; i++) {
            while (true) {
                let addNum = getRandomInt(panelCount) + 1;
                if (beforeNum != addNum) {
                    numbers.push(addNum);
                    beforeNum = addNum;
                    break;
                }
            }
        }

        setNumbers(numbers);
        // console.log(numbers);
        setCorrectNum(0);

        const showTile = (setIndex: React.Dispatch<React.SetStateAction<number>>, numbers: number[], setVisibleIndex: React.Dispatch<React.SetStateAction<number>>, interval: NodeJS.Timeout | null, setGameState: React.Dispatch<React.SetStateAction<number>>) => {
            setIndex(prevIndex => {
                if (prevIndex < questionCountState) {
                    // console.log('prevIndex: ' + prevIndex);
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
        setLeftTime(() => {
            return ANSWER_TIME_LIMIT;
        })
    }, [answerStep]);

    useEffect(() => {
        if (gameState == STATE_START_QUESTION) {
            // changeEnable(false);
            setVisibleIndex(0);
            resetTileData();
            countDownStart();
        }

        if (gameState == STATE_INPROGRESS_QUESTION) {
            playSound(bgm);
            questionStart();
        }

        if (gameState == STATE_START_ANSWER) {
            // changeEnable(true);
            setVisibleIndex(0);
            // console.log(numbers);
            setGameState(prev => prev + 1);
        }

        if (gameState == STATE_INPROGRESS_ANSWER) {
            answerStart();
        }

        if (gameState == STATE_RESULT) {
            clearInterval(leftTimeInterval);
            stopSound(bgm);
        }

        // console.log("gameState: " + gameState);
    }, [gameState]);

    const replay = () => {
        setGameState(STATE_START_QUESTION);
    }

    const nextPlay = () => {
        setStageNumState(prev => prev + 1);
        updateSpeed();
        setQuestionCount();
        setGameState(STATE_START_QUESTION);
    }

    useEffect(() => {
        if (gameState == STATE_INPROGRESS_QUESTION) {
            tileData[visibleIndex - 1].isEnable = false;
            // console.log('visibleIndex: ' + visibleIndex);
        }
    }, [visibleIndex]);

    return (
        <View style={[styles.container]}>
            <View style={styles.gotopContainer}>
                <Link href={'/screens/TopScreen'}>
                    <Text style={styles.gotop}>トップへ</Text>
                </Link>
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
                    keyExtractor={(item, index) => index.toString()}
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
