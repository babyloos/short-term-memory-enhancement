import MenuPanel from "@/components/MenuPanel";
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
} from "react-native";
import colors from "../util/constants";
import { useEffect, useState } from "react";
import strage from "../util/gameStrage";
import SoundManager from "../util/soundManager";

type TopScreenProps = {};
const TopScreen = ({ }: TopScreenProps) => {
    const { width, height } = Dimensions.get('window');
    const panelWidth = width;
    const panelHeight = height / 13;
    const top = height / 5;

    const [nextStage, setNextStage] = useState(1);

    useEffect(() => {
        SoundManager.getInstance().playSound('enterButton');
        strage.loadNextStage().then((nextStage) => {
            setNextStage(nextStage);
        });
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        titleContainer: {
            marginTop: 62,
            marginBottom: 28,
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
        version: {
            position: 'absolute',
            left: 24,
            bottom: 24,
            color: colors.text,
        }
    });

    return (
        <View style={[styles.container]}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>メモリータップ</Text>
            </View>
            <MenuPanel title={"はじめから"} pathname={"/screens/GameScreen"} params={{ stageNum: 1 }} />
            <MenuPanel title={"続きから"} pathname={"/screens/GameScreen"} params={{ stageNum: nextStage}} />
            <MenuPanel title={"ステージ選択"} pathname={"/screens/SelectLevelScreen"} params={{}} />
            <MenuPanel title={"あそび方"} pathname={"/screens/ManualScreen"} params={{}} />
            <Text style={styles.version}>ver.1.0.0</Text>
        </View >
    );
}

export default TopScreen;

