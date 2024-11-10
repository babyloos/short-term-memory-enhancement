import colors from "@/app/util/constants";
import { Href, Link } from "expo-router";
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
} from "react-native"

type menuPanelProps = {
    title: string,
    pathname: string,
    params: {}
};
const MenuPanel = ({ title, pathname, params }: menuPanelProps) => {
    const { width, height } = Dimensions.get('window');
    const panelWidth = width;
    const panelHeight = height / 13;
    const top = height / 5;

    const styles = StyleSheet.create({
        menuPanel: {
            marginTop: panelHeight - 10,
            height: panelHeight,
            justifyContent: 'center',
            backgroundColor: colors.panel,
            marginHorizontal: '10%',
            borderRadius: 6,
            shadowColor: colors.panelShadow,
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.5,
        },
        menu: {
            fontSize: 28,
            textAlign: 'center',
            fontWeight: '500',
            color: colors.text,
        },
    });

    return (
        <View style={styles.menuPanel}>
            <Link href={{pathname: pathname, params: params}}>
                <Text style={styles.menu}>{title}</Text>
            </Link>
        </View>
    );
}

export default MenuPanel;