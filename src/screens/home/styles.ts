import { StyleSheet } from "react-native";

export const HEADER_HEIGHT = 60;
export const FOOTER_HEIGHT = 60;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9DC5C',
        zIndex: 1,
    },

    txtTitle: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    header: {
        height: HEADER_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    listContent: {
        paddingVertical: HEADER_HEIGHT,
        paddingHorizontal: 16,
        gap: 16,
    },
    footer: {
        height: FOOTER_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 16,
        right: 16,
        zIndex: 3
    },
    btnCreate: {
        height: 40,
        width: '100%',
        borderRadius: 20,
        paddingHorizontal: 16,
        alignSelf: 'center',
        backgroundColor: '#FF6B6B',
        justifyContent: 'center',
        alignItems: 'center',
    }
});