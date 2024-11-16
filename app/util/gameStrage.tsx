import AsyncStorage from '@react-native-async-storage/async-storage';

const strage = {
    addClearedStage: async (clearedStage: number) => {
        try {
            let loadStage = await strage.loadClearedStage();
            if (!loadStage.includes(clearedStage)) {
                loadStage.push(clearedStage);
            }
            await AsyncStorage.setItem('clearedStage', JSON.stringify(loadStage));
            console.log('Game state saved!');
            console.log('cleared stage' + loadStage);
        } catch (error) {
            console.error('Failed to save game state:', error);
        }
    },
    loadClearedStage: async () => {
        try {
            const value = await AsyncStorage.getItem('clearedStage');
            return value ? JSON.parse(value) : [];
        } catch (error) {
            console.error(`Failed to load cleard stage:`, error);
            return null;
        }
    },
    clearAll: async () => {
        try {
            await AsyncStorage.clear();
            console.log('All data cleared successfully!');
        } catch (error) {
            console.error('Failed to clear all data:', error);
        }
    },
}

export default strage;
