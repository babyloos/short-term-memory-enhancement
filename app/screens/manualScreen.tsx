import {
    View,
    StyleSheet,
    Text,
} from "react-native";
import colors from "../util/constants";
import { Link } from "expo-router";

const ManualScreen = () => {
    return (
        <View style={[styles.container]}>
            <View style={styles.gotopContainer}>
                <Link href={'/screens/TopScreen'}>
                    <Text style={styles.gotop}>トップへ</Text>
                </Link>
            </View>
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
});