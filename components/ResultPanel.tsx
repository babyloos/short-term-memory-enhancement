import colors from '@/app/util/constants';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

type ItemProps = { isVisible: boolean, result: number, rePlayCallback: (stageNum: number) => void }
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
            backgroundColor: colors.disabled,
            borderRadius: 6,
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
                <Text style={styles.title}>合格</Text>
            </View>
            <TouchableOpacity style={styles.retryContainer} onPress={() => {props.rePlayCallback(3)}}>
                <Text style={styles.retry}>もう一度</Text>
            </TouchableOpacity>
            <View style={[styles.retryContainer, {backgroundColor: colors.disabled}]}>
                <Text style={[styles.retry, styles.next]}>次へ</Text>
            </View>
        </View>
    );
}

export default ResultPanel;