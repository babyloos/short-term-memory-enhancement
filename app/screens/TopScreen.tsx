import {
    Dimensions,
    Text,
    View,
    StyleSheet,
} from "react-native";
import colors from "../util/constants";

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
        menuPanel: {
            marginTop: panelHeight - 10,
            height: panelHeight,
            justifyContent: 'center',
            backgroundColor: colors.panel,
            marginHorizontal: '10%',
            borderRadius: 6,
            shadowColor: colors.panelShadow,
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.5,
        },
        menu: {
            fontSize: 28,
            textAlign: 'center',
            fontWeight: '500',
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
            <View style={styles.menuPanel}>
                <Text style={styles.menu}>はじめから</Text>
            </View>
            <View style={styles.menuPanel}>
                <Text style={styles.menu}>続きから</Text>
            </View>
            <View style={styles.menuPanel}>
                <Text style={styles.menu}>ステージ選択</Text>
            </View>
            <View style={styles.menuPanel}>
                <Text style={styles.menu}>あそび方</Text>
            </View>
            <Text style={styles.version}>ver.1.0.0</Text>
        </View >
    );
}

export default TopScreen;

