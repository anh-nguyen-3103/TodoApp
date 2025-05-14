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
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    infoCollapsedContainer: {
        flex: 1,
        gap: 16,
    },
    infoRowCollapsed: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#DDDDDD',
    },
    txtTitle: {
        fontWeight: '600',
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
        marginTop: 16,
    },
    txtButtonSubmit: {
        color: '#FFF',
        fontSize: 14
    },
    collapsedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: 16
    },
    btnRemove: {
        gap: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'flex-end'
    },
    inputContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 16,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    txtInput: {
        fontSize: 16,
        letterSpacing: 0.25,
        lineHeight: 24,
        fontWeight: '600'
    }
});