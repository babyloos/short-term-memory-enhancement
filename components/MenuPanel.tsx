import colors from "@/app/util/constants";
import { Link } from "expo-router";
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
} from "react-native"

type menuPanelProps = { title: string };
const MenuPanel = ({ title }: menuPanelProps) => {
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
        link: {
            backgroundColor: 'red',
        },
    });

    return (
        <View style={styles.menuPanel}>
            <Link style={styles.link} href={"/screens/gameScreen"}>
                <Text style={styles.menu}>{title}</Text>
            </Link>
        </View>
    );
}

export default MenuPanel;