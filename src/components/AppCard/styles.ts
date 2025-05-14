import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        padding: 16,
    },
    headerContainer: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center'
    },
    cardContainer: {
        width: '100%',
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    infoContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        gap: 16
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#CCC'
    },
    btnSubmit: {
        height: 30,
        width: 100,
        borderRadius: 15,
        paddingHorizontal: 16,
        alignSelf: 'center',
        backgroundColor: '#008000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtButtonSubmit: {
        color: '#FFF',
        fontSize: 14
    },
    inputContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 16,
        backgroundColor: '#fff',
    },
    txtInput: {
        fontSize: 16,
        letterSpacing: 0.25,
        lineHeight: 24,
        fontWeight: '600'
    }
});