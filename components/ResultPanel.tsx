import colors from '@/app/util/constants';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableNativeFeedback,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

type ItemProps = { isVisible: boolean, isClear: boolean, rePlayCallback: () => void, nextPlayCallback: () => void }
const ResultPanel = (props: ItemProps) => {
    const { width, height } = Dimensions.get('window');
    const panelWidth = width;
    const panelHeight = height / 1.8;
    const top = height / 5;
    const display = props.isVisible ? 'flex' : 'none';

    const styles = StyleSheet.create({
        container: {
            display: display,
            position: 'absolute',
            top: top,
            left: 12,
            width: panelWidth - 27,
            height: panelHeight,
            backgroundColor: colors.panel,
            borderRadius: 6,
            alignItems: 'center',
            shadowColor: colors.panelShadow,
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.5,
        },
        titleContainer: {
            marginTop: 48,
            height: 84,
            width: 256,
            backgroundColor: colors.base,
            borderRadius: 6,
            shadowColor: colors.baseShadow,
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.5,
        },
        title: {
            marginTop: 10,
            fontSize: 50,
            fontWeight: '600',
            textAlign: 'center',
            color: colors.resultTitle,
        },
        retryContainer: {
            marginTop: 68,
            height: 72,
            width: 248,
            backgroundColor: colors.base,
            borderRadius: 6,
            shadowColor: colors.baseShadow,
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.5,
        },
        retry: {
            marginTop: 10,
            fontSize: 50,
            textAlign: 'center',
            fontWeight: '400',
            color: colors.text,
        },
        nextContainer: {
            marginTop: 48,
            height: 72,
            width: 178,
            borderRadius: 6,
            shadowColor: colors.disabledShadow,
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.5,
        },
        disabledNextContainer: {
            marginTop: 48,
            height: 72,
            width: 178,
            borderRadius: 6,
            backgroundColor: colors.disabled,
            shadowColor: colors.disabledShadow,
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.5,
        },
        next: {
            marginTop: 10,
            fontSize: 50,
            textAlign: 'center',
            fontWeight: '400',
            color: colors.text,
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{props.isClear ? "合格" : "失敗"}</Text>
            </View>
            <TouchableNativeFeedback onPress={() => { props.rePlayCallback() }}>
                <View style={styles.retryContainer}>
                    <Text style={styles.retry}>もう一度</Text>
                </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={() => { props.nextPlayCallback() }} disabled={!props.isClear}>
                <View style={[styles.retryContainer, props.isClear ? styles.nextContainer : styles.disabledNextContainer]}>
                    <Text style={[styles.retry, styles.next]}>次へ</Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    );
}

export default ResultPanel;