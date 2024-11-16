import AsyncStorage from '@react-native-async-storage/async-storage';

const strage = {
    saveCleardStage: async (clearedStage: number) => {
        try {
            await AsyncStorage.setItem('cleardStage', JSON.stringify(clearedStage));
            console.log('Game state saved!');
            console.log('cleared stage' + clearedStage);
        } catch (error) {
            console.error('Failed to save game state:', error);
        }
    },
    load: async () => {
        try {
            const value = await AsyncStorage.getItem('cleardStage');
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Failed to load cleard stage:`, error);
            return null;
        }
    },
}

export default strage;
