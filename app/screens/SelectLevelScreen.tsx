import { Link } from "expo-router";
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    Image,
} from "react-native";
import colors from "../util/constants";
import { useEffect, useState } from "react";
import strage from "../util/gameStrage";

const ManualScreen = () => {
    const data = new Array<LevelTileProps>();
    const [clearedStage, setClearedStage] = useState([0]);

    type LevelTileProps = { index: number };

    useEffect(() => {
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
                <Link style={{ margin: 'auto' }} href={{ pathname: '/screens/GameScreen', params: { stageNum: index } }}>
                    <View style={{ width: '100%', height: '100%' }}>
                        <Text style={styles.tileText}>{index < 100 ? index.toString() : ""}</Text>
                        <Image
                            source={require('../../assets/images/passed.png')}
                            style={[styles.image, clearedStage.includes(index) ? styles.visibleImage : styles.hiddenImage]}
                        />
                    </View>
                </Link>
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
        tileText: {
            fontSize: 48,
            lineHeight: 72,
            color: colors.text,
            width: '100%',
            textAlign: 'center',
            fontWeight: '300',
        },
        image: {
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
