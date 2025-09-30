import { Text, Touchable, View } from 'react-native';

export default function SignInScreen({ promptAsync }) {
    return (
        <View>
            <Text>Sign In With Google</Text>
            <Touchable onPress={() => promptAsync()}>
                <Text>Sign In</Text>
            </Touchable>
        </View>
    );
}