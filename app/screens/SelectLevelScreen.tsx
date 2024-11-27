import { Link } from "expo-router";
import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Image as ExpoImage } from 'expo-image';
import colors from "../util/constants";
import React, { useEffect, useState } from "react";
import strage from "../util/gameStrage";
import SoundManager from "../util/soundManager";

const ManualScreen = () => {
    const data = new Array<LevelTileProps>();
    const [clearedStage, setClearedStage] = useState([0]);

    type LevelTileProps = { index: number };

    useEffect(() => {
        SoundManager.getInstance().playSound('enterButton');
        strage.loadClearedStage().then((clearedStage) => {
            setClearedStage(clearedStage);
        });
    }, []);

    const initData = () => {
        for (var i = 1; i <= 100; i++) {
            data.push({ index: i });
        }
    }

    const LevelTile = ({ index }: LevelTileProps) => {
        return (
            <View style={styles.tileContainer}>
                <Link style={{ flex: 1, margin: 'auto'}} href={{ pathname: '/screens/gameScreen', params: { stageNum: index } }}>
                    <View style={styles.tile}>
                        <Text style={styles.tileText}>{index < 100 ? index.toString() : ""}</Text>
                    </View>
                </Link>
                <ExpoImage
                    pointerEvents="none"
                    source={require('../../assets/images/passed.png')}
                    style={[styles.image, clearedStage.includes(index) ? styles.visibleImage : styles.hiddenImage]}
                    contentFit="contain"
                />
            </View>
        );
    }

    initData();

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
        flatList: {
            marginTop: 28,
            marginHorizontal: 12,
            borderColor: '#AAAAAA',
        },
        tileContainer: {
            flex: 1,
            borderWidth: 1,
            borderColor: '#AAAAAA',
            aspectRatio: 1,
        },
        tile: {
            flex: 1,
            width: '100%',
        },
        tileText: {
            flex: 1,
            width: '100%',
            fontSize: 48,
            lineHeight: 72,
            color: colors.text,
            fontWeight: '300',
        },
        image: {
            flex: 1,
            width: '100%',
            height: '100%',
            position: 'absolute',
            opacity: 0.8,
        },
        visibleImage: {
            display: 'flex',
        },
        hiddenImage: {
            display: 'none',
        },
    });

    return (
        <View style={[styles.container]}>
            <View style={styles.gotopContainer}>
                <Link href={'/screens/TopScreen'}>
                    <Text style={styles.gotop}>トップへ</Text>
                </Link>
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>ステージ選択</Text>
            </View>
            <FlatList
                style={styles.flatList}
                data={data}
                numColumns={5}
                renderItem={({ item }) => <LevelTile index={item.index} />}
                keyExtractor={(item) => item.index.toString()}
            />
        </View>
    );
}

export default ManualScreen;
