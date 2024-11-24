import MenuPanel from "@/components/MenuPanel";
import {
    Button,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";
import colors from "../util/constants";
import { useCallback, useContext, useEffect, useState } from "react";
import strage from "../util/gameStrage";
import SoundManager from "../util/soundManager";
import mobileAds, { TestIds, useInterstitialAd } from 'react-native-google-mobile-ads';

type TopScreenProps = {};
const TopScreen = ({ }: TopScreenProps) => {
    const { width, height } = Dimensions.get('window');
    const panelWidth = width;
    const panelHeight = height / 13;
    const top = height / 5;

    const [nextStage, setNextStage] = useState(1);

    const [unitId, setUnitId] = useState<string>(TestIds.INTERSTITIAL);
    const { isLoaded, isClosed, load, show } = useInterstitialAd(unitId, {
        requestNonPersonalizedAdsOnly: false,
    });

    useEffect(() => {
        SoundManager.getInstance().playSound('enterButton');
        strage.loadNextStage().then((nextStage) => {
            setNextStage(nextStage);
        });

        const testUnitID = TestIds.INTERSTITIAL;

        // 実際に広告配信する際のID
        // 広告ユニットを作成した際に表示されたものを設定する
        const adUnitID = Platform.select({
            ios: "ca-app-pub-1479927029413242/9027896134",
            android: "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy",
        });

        if (testUnitID) {
            setUnitId(testUnitID);
        } else if (adUnitID) {
            setUnitId(adUnitID);
        }
    }, []);

    useEffect(() => {
        if (load) {
            // 広告をロードする
            load();
        }
    }, [load]);

    useEffect(() => {
        // 閉じられたら次の広告をロードしておく
        if (isClosed) {
            load();
        }
    }, [isClosed]);

    const viewInterstitial = useCallback(async () => {
        // 広告の表示
        if (isLoaded) {
            show();
        } else {
            console.log("not loaded:", isLoaded);
        }
    }, [isLoaded]);

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
            <View>
                <Button title="show add" onPress={() => { viewInterstitial() }}></Button>
            </View>
            <MenuPanel title={"はじめから"} pathname={"/screens/gameScreen"} params={{ stageNum: 1 }} />
            <MenuPanel title={"続きから"} pathname={"/screens/gameScreen"} params={{ stageNum: nextStage }} />
            <MenuPanel title={"ステージ選択"} pathname={"/screens/SelectLevelScreen"} params={{}} />
            <MenuPanel title={"あそび方"} pathname={"/screens/manualScreen"} params={{}} />
            <Text style={styles.version}>ver.1.0.0</Text>
        </View >
    );
}

export default TopScreen;

