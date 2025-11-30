import { StyleSheet } from "react-native";


export const eventStyles = StyleSheet.create({
    fullInput: {
        width: "100%",
        height: 45,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#666",
        borderRadius: 8,
        backgroundColor: "#222",
        color: "#fff",
        fontSize: 15,
        marginBottom: 10,
    },
    smallInput: {
        width: "46%",
        height: 40,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#666",
        borderRadius: 8,
        backgroundColor: "#222",
        color: "#fff",
        fontSize: 14,
    },
    row: {
        flexDirection: "row",
        alignItema: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    dash: {
        color: "#fff",
        fontSize: 20,
        paddingHorizontal: 5,
    },
});