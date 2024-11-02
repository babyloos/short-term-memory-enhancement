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
    transform: [{ translateX: -150 }, { translateY: -150 }],
    width: 300,
    height: 300,
    backgroundColor: '#F06E1D',
    borderRadius: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countDownPanelText: {
    color: 'white',
    fontSize: 160,
  },
});