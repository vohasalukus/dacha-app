import { View, Text, Image, StyleSheet, ScrollView, Button, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { summerHouses } from '../../data/mockData';
import {useRoute} from "@react-navigation/core"; // пока мок, потом будет fetch

export default function HouseDetailScreen() {
    const route = useRoute()
    const { id } = route.params;  // Получаем параметр id из params
    const house = summerHouses.find((item) => item.id === id);  // Ищем нужную дачу

    if (!house) {
        return (
            <View style={styles.container}>
                <Text>Дача не найдена</Text>
            </View>
        );
    }

    const handleCall = () => {
        Linking.openURL(`tel:${house.contact || '+998901234567'}`);
    };

    const handleMessage = () => {
        Linking.openURL(`https://wa.me/${house.contact || '998901234567'}`);
    };

    // Это две функции позволяющие нам открыть приложения для звонка или же whatsapp, telegram

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: house.imageUrl }} style={styles.image} />
            <Text style={styles.title}>{house.name}</Text>
            <Text style={styles.description}>{house.description}</Text>
            <Text style={styles.info}>📍 {house.location || 'Местоположение не указано'}</Text>
            <Text style={styles.info}>💵 {house.price || 'Цена по запросу'}</Text>

            <View style={styles.buttons}>
                <Button title="Позвонить" onPress={handleCall} />
                <Button title="Написать в WhatsApp" onPress={handleMessage} />
            </View>
        </ScrollView>
    );
}
// Подробности дачи!!!
// Логи сука приходят, react его видит, все ок, но у меня просто экран не меняется

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },
    info: {
        fontSize: 15,
        marginBottom: 5,
    },
    buttons: {
        marginTop: 20,
        gap: 10,
    },
});
