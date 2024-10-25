import {
  Text,
  View,
  StyleSheet
} from 'react-native';

type countProps = { count: number, isVisible: boolean }
const CountDownPanel = ({ count, isVisible }: countProps) => {
  return (
    <View style={[styles.countDownPanel, { display: isVisible ? 'flex' : 'none' }]}>
      <Text style={styles.countDownPanelText}>{count}</Text>
    </View>
  );
}

export default CountDownPanel;

const styles = StyleSheet.create({
  countDownPanel: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    alignSelf: 'center',
  },
  countDownPanelText: {
    color: 'brown',
    top: '-51%',
    left: '-51%',
    fontSize: 299,
  },
});