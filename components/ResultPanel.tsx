import {
    Text,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';

type ItemProps = { result: string }
const ResultPanel = (props: ItemProps) => {
    const { width, height } = Dimensions.get('window');
    const panelWidth = width;
    const panelHeight = height / 2;
    const top = height / 5;

    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            top: top,
            width: panelWidth,
            height: panelHeight,
            backgroundColor: 'red',
        },
        title: {
            marginTop: 10,
            fontSize: 50,
            textAlign: 'center',
        },
        contents: {
            marginTop: 50,
            fontSize: 30,
            textAlign: 'center',
        }
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>結果</Text>
            <Text style={styles.contents}>{props.result}</Text>
        </View>
    );
}




export default ResultPanel;