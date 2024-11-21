import { Audio } from 'expo-av';

class SoundManager {
    private static instance: SoundManager;
    private sounds: { [key: string]: Audio.Sound } = {};
    private isMuted: boolean = false;

    private constructor() { }

    // シングルトンインスタンスの取得
    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
            SoundManager.instance.loadSounds();
        }
        return SoundManager.instance;
    }

    loadSounds = () => {
        SoundManager.instance.loadSound('drumBpm125', require('../../assets/sounds/drum_BPM123.mp3'));
        SoundManager.instance.loadSound('countDown', require('../../assets/sounds/countDown.mp3'));
        SoundManager.instance.loadSound('enterTile', require('../../assets/sounds/enterTile.mp3'));
        SoundManager.instance.loadSound('enterButton', require('../../assets/sounds/enterButton.mp3'));
        SoundManager.instance.loadSound('success', require('../../assets/sounds/success.mp3'));
        SoundManager.instance.loadSound('failed', require('../../assets/sounds/failed.mp3'));
    }

    // サウンドをロード
    public async loadSound(key: string, file: any): Promise<void> {
        if (!this.sounds[key]) {
            const { sound } = await Audio.Sound.createAsync(file);
            this.sounds[key] = sound;
        }
    }

    // サウンドを再生
    public async playSound(key: string): Promise<void> {
        if (this.sounds[key] && !this.isMuted) {
            try {
                await this.sounds[key].replayAsync();
            } catch (error) {
                console.error(`Error playing sound ${key}:`, error);
            }
        }
    }

    // サウンドを停止
    public async stopSound(key: string): Promise<void> {
        if (this.sounds[key]) {
            try {
                await this.sounds[key].stopAsync();
            } catch (error) {
                console.error(`Error stopping sound ${key}:`, error);
            }
        }
    }

    // サウンドをミュート
    public async setMute(mute: boolean): Promise<void> {
        this.isMuted = mute;
    }

    // 全てのサウンドを解放
    public async unloadAll(): Promise<void> {
        for (const key in this.sounds) {
            try {
                await this.sounds[key].unloadAsync();
            } catch (error) {
                console.error(`Error unloading sound ${key}:`, error);
            }
        }
        this.sounds = {};
    }
}

export default SoundManager;

