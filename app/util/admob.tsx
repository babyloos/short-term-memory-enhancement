import React from "react";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import { TestIds, useInterstitialAd } from "react-native-google-mobile-ads";

interface HiddenComponentProps {
    triggerAction: boolean;
}

const Admob: React.FC<HiddenComponentProps> = ({ triggerAction }) => {
    const [iosUnitId, setIosUnitId] = useState<string>('ca-app-pub-1479927029413242/9027896134');
    const [androidUnitId, setAndroidUnitId] = useState<string>('ca-app-pub-1479927029413242/9524388451');
    const unitId = __DEV__ ? TestIds.INTERSTITIAL : Platform.select({
            ios: iosUnitId,
            android: androidUnitId,
        });
    const { error, isLoaded, isClosed, load, show } = useInterstitialAd(unitId ? unitId : TestIds.INTERSTITIAL, {
        requestNonPersonalizedAdsOnly: false,
    });

    useEffect(() => {
        if (error) {
            console.error("Ad Load Error:", error);
        }
    }, [error]);

    useEffect(() => {
        if (load) {
            // 広告をロードする
            load();
        }
    }, [load]);

    useEffect(() => {
        // 閉じられたら次の広告をロードしておく
        if (isClosed) {
            load();
        }
    }, [isClosed]);

    const viewInterstitial = useCallback(async () => {
        // 広告の表示
        if (isLoaded) {
            show();
        } else {
            console.log("not loaded:", isLoaded);
        }
    }, [isLoaded]);

    useEffect(() => {
        if (triggerAction) {
            viewInterstitial();
        }
    }, [triggerAction]);

    return null;
};

export default Admob;