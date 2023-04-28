import { FlatList, Text } from 'react-native';

import { Screen } from '../components/Screen';
import { usePublicKey } from '../hooks/xnft-hooks';

export function HomeScreen() {
  const p = usePublicKey();
  const features = [
    'tailwind',
    'recoil',
    'native styling',
    'fetching code from an API',
    'using a FlatList to render data',
    'Image for both remote & local images',
    'custom fonts',
    'sign a transaction / message',
    'theme hook with light/dark support',
  ];

  return (
    <Screen>
      <Text>{p?.toString()}</Text>
      <FlatList
        data={features}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text>- {item}</Text>}
      />
    </Screen>
  );
}
