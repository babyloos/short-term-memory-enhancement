import React from "react";
import { useCallback, useEffect, useState } from "react";
import { TestIds, useInterstitialAd } from "react-native-google-mobile-ads";

interface HiddenComponentProps {
    triggerAction: boolean;
}

const Admob: React.FC<HiddenComponentProps> = ({ triggerAction }) => {
    const [iosUnitId, setIosUnitId] = useState<string>('ca-app-pub-1479927029413242/9027896134');
    const [androidUnitId, setAndroidUnitId] = useState<string>('');
    const unitId = __DEV__ ? TestIds.INTERSTITIAL : iosUnitId;
    const { isLoaded, isClosed, load, show } = useInterstitialAd(unitId, {
        requestNonPersonalizedAdsOnly: false,
    });

    let testUnitID = null;

    if (__DEV__) {
        testUnitID = TestIds.INTERSTITIAL;
    }

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