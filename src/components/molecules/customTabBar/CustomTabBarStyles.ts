import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        borderRadius: 30,
        borderWidth: 0.8,
        borderColor: '#fff',
        overflow: 'hidden',
        height: 70,
        elevation: 5, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    blurView: {
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // bottom: 0,
        // right: 0,
    },
    tabBar: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // translucent background
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    creativeTabItem: {
        marginBottom: 20, // push content up slightly if needed, or just let the icon be larger
    },
});
