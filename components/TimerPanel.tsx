import {
  Text,
  View,
  StyleSheet
} from 'react-native';

type countProps = { count: number, isVisible: boolean }
const TimerPanel = ({ count, isVisible }: countProps) => {
  return (
    <View style={[styles.timerPanel, { opacity: isVisible ? 100 : 0 }]}>
      <Text style={styles.timerPanelText}>{count}</Text>
    </View>
  );
}

export default TimerPanel;

const styles = StyleSheet.create({
  timerPanel: {
    marginTop: 12,
    marginHorizontal: 'auto',
    width: 80,
    height: 80,
    backgroundColor: '#F06E1D',
    borderRadius: 80,
    alignItems: 'center',
  },
  timerPanelText: {
    color: 'white',
    fontSize: 72,
  },
});