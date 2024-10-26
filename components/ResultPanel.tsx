import {
    Text,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

type ItemProps = { isVisible: boolean, result: number}
const ResultPanel = (props: ItemProps) => {
    const { width, height } = Dimensions.get('window');
    const panelWidth = width;
    const panelHeight = height / 2;
    const top = height / 5;
    const display = props.isVisible ? 'flex' : 'none';

    const styles = StyleSheet.create({
        container: {
            display: display,
            position: 'absolute',
            top: top,
            width: panelWidth,
            height: panelHeight,
            backgroundColor: 'limegreen',
        },
        title: {
            marginTop: 10,
            fontSize: 50,
            textAlign: 'center',
        },
        contents: {
            marginTop: 50,
            fontSize: 50,
            textAlign: 'center',
        },
        restartButton: {
            backgroundColor: 'red',
            marginStart: 20,
            marginEnd: 20,
        }
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>結果</Text>
            <Text style={styles.contents}>正解数: {props.result} / 9</Text>
            <TouchableOpacity>
                <Text style={[styles.contents, styles.restartButton]}>再プレイ</Text>
            </TouchableOpacity>
        </View>
    );
}




export default ResultPanel;