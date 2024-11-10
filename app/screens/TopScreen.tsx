import MenuPanel from "@/components/MenuPanel";
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
} from "react-native";
import colors from "../util/constants";
import { Link } from "expo-router";

type TopScreenProps = {};
const TopScreen = ({ }: TopScreenProps) => {
    const { width, height } = Dimensions.get('window');
    const panelWidth = width;
    const panelHeight = height / 13;
    const top = height / 5;

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
            <MenuPanel title={"はじめから"} pathname={"/screens/gameScreen"} params={{stageNum: 1}} />
            <MenuPanel title={"続きから"} pathname={"/screens/gameScreen"} params={{stageNum: 2}} />
            <MenuPanel title={"ステージ選択"} pathname={"/screens/gameScreen"} params={{stageNum: 3}} />
            <MenuPanel title={"あそび方"} pathname={"/screens/gameScreen"} params={{stageNum: 4}} />
            <Text style={styles.version}>ver.1.0.0</Text>
        </View >
    );
}

export default TopScreen;

