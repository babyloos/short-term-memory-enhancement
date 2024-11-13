import {
    View,
    StyleSheet,
    Text,
} from "react-native";
import colors from "../util/constants";
import { Link } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

const ManualScreen = () => {
    return (
        <View style={[styles.container]}>
            <View style={styles.gotopContainer}>
                <Link href={'/screens/TopScreen'}>
                    <Text style={styles.gotop}>トップへ</Text>
                </Link>
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>あそび方</Text>
            </View>
            <ScrollView>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        メモリータップはシンプルなゲームを通じて短期記憶力の強化を図るための脳トレアプリです。
                    </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        タイトル画面の"はじめから"を選択するとステージ1からゲームを開始することができます。
                    </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        "続きから"を選択すると前回遊んだレベルからゲームを再開できます
                    </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        また、"ステージ選択"を選ぶとクリア済の好きなステージからゲームを開始することができます。
                    </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        ゲーム画面の"スタート"をタップすることでカウントダウンとともにゲームが開始されます。
                    </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        ゲームが開始されるとリズムに合わせていくつかのタイルが数字とともに順番に光ります。
                    </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        背景が白色になり回答フェーズが始まるとあなたが入力する番です。
                        出題された通りの順番でタイルをタップしましょう。
                    </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        ゲームが終了すると結果画面が表示されます。
                    </Text>
                    <Text style={styles.text}>
                        不合格の場合は再チャレンジを、合格の場合は次のゲームに挑戦できます。
                    </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        ゲームを行うごとにレベルが徐々に上がっていくの自己ベストを目指して頑張りましょう。
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

export default ManualScreen;

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
    }
});