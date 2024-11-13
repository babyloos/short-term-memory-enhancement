import { Link } from "expo-router";
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import colors from "../util/constants";

const ManualScreen = () => {
    const { width, height } = Dimensions.get('window');
    const tileWidth = (width - 24) / 5;
    const data = new Array<LevelTileProps>();

    type LevelTileProps = ({ index: number });

    const initData = () => {
        data.push({ index: 0 });
        data.push({ index: 1 });
        data.push({ index: 2 });
        data.push({ index: 3 });
        data.push({ index: 4 });
    }

    const LevelTile = ({ index }: LevelTileProps) => {
        return (
            <View style={styles.tileContainer}>
                <Text style={styles.tile}>{index.toString()}</Text>
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
        textContainer: {
            marginTop: 48,
            marginHorizontal: 24,
        },
        text: {
            fontSize: 22,
            color: colors.text,
        },
        flatList: {
            backgroundColor: 'red',
            marginTop: 28,
            marginHorizontal: 12,
            borderWidth: 1,
            borderEndWidth: 1,
            borderColor: 'gray',
        },
        tileContainer: {
            flex: 1,
            borderEndWidth: 1,
            backgroundColor: "skyblue",
            aspectRatio: 1,
        },
        tile: {
            fontSize: 48,
            margin: 'auto',
            fontWeight: '300',
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
            <View style={styles.titleContainer}>
                <Text style={styles.title}>最高難易度: 24</Text>
            </View>
            <FlatList
                style={styles.flatList}
                data={data}
                numColumns={5}
                renderItem={({ item }) => <LevelTile index={item.index} />}
                keyExtractor={(index) => index.toString()}
            />
        </View>
    );
}

export default ManualScreen;

