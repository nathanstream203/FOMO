import { signOut } from 'firebase/auth';
import { Button, Text, View } from 'react-native';
import { auth } from '../FireBase/firebaseConfig';

export default function Settings() {
    return (
        <View>
            <Text>Settings Screen</Text>
            <Button title="Sign Out" onPress={async () => await signOut(auth)} />
        </View>
    );
}