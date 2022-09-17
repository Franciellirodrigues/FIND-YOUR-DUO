import { FlatList, Image, TouchableOpacity, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Entypo } from '@expo/vector-icons'
import { useEffect, useState } from 'react'

import logoImg from '../../assets/logo-nlw-esports.png'

import { Background } from '../../components/Background'
import { Heading } from '../../components/Heading'
import { DuoCard, DuoCardProps } from '../../components/DuoCard'
import { DuoMatch } from '../../components/DuoMatch'

import { styles } from './styles'
import { THEME } from '../../theme'

import { GameParams } from '../../@types/navigation'

export function Game() {
  const [duos, setDuos] = useState<DuoCardProps[]>([])
  const [discordDuosSelected, setDiscordDuosSelected] = useState('')

  const navigation = useNavigation()
  const route = useRoute()
  const game = route.params as GameParams

  function handleGoBack() {
    navigation.goBack()
  }

  async function getDiscordUser(adsId: string) {
    fetch(`http://192.168.1.65:3333/ads/${adsId}/discord`)
      .then(response => response.json())
      .then(data => setDiscordDuosSelected(data.discord));
  }

  useEffect(() => {
    fetch(`http://192.168.1.65:3333/games/${game.id}/ads`)
      .then(response => response.json())
      .then(data => setDuos(data));
  }, [])

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo
              name='chevron-thin-left'
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>

          <Image
            source={logoImg}
            style={styles.logo}
          />

          <View style={styles.right} />
        </View>

        <Image
          source={{ uri: game.bannerUrl }}
          style={styles.cover}
          resizeMode="cover"
        />

        <Heading
          title={game.title}
          subtitle='Conecte-se e começe a jogar!'
        />

        <FlatList
          keyExtractor={item => item.id}
          data={duos}
          renderItem={({ item }) => (
            <DuoCard
              data={item}
              onConnect={() => getDiscordUser(item.id)}
            />
          )}
          horizontal
          style={[styles.containerList]}
          contentContainerStyle={
            [duos.length > 0 ? styles.contentList : styles.emptyListContent]
          }
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Não há anúncios publicado para este jogo ainda!
            </Text>
          )}
        />

        <DuoMatch
          visible={discordDuosSelected.length > 0}
          discord={discordDuosSelected}
          onClose={() => setDiscordDuosSelected('')}
        />

      </SafeAreaView>
    </Background>
  );
}