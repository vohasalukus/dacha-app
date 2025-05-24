import React, { useEffect, useState } from 'react';
import {
    View, Text, Image, StyleSheet, ScrollView,
    Button, Linking, ActivityIndicator, Alert
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Platform } from 'react-native';


export default function HouseDetailScreen() {
    const route = useRoute();
    const { id } = route.params as { id: number };
    const [house, setHouse] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const openInMaps = () => {
        if (!house?.latitude || !house?.longitude) {
            Alert.alert('Координаты не указаны');
            return;
        }

        const lat = house.latitude;
        const lng = house.longitude;
        const url = Platform.select({
            ios: `http://maps.apple.com/?ll=${lat},${lng}`,
            android: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        });

        Linking.openURL(url!);
    };


    useEffect(() => {
        axios.get(`http://10.0.2.2:8000/dacha/${id}/`)
            .then(res => setHouse(res.data))
            .catch(() => setHouse(null))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
    if (!house) return <View style={styles.container}><Text>Дача не найдена</Text></View>;

    const handleCall = () => {
        Linking.openURL(`tel:${house.contact || '+998901234567'}`);
    };

    const handleMessage = () => {
        Linking.openURL(`https://wa.me/${house.contact?.replace('+', '') || '998901234567'}`);
    };

    const imageFields = Array.from({ length: 10 }, (_, i) => house[`image${i + 1}`]).filter(Boolean);

    const features = [
        { key: 'wifi', label: 'Wi-Fi' },
        { key: 'alcohol', label: 'Алкоголь разрешён' },
        { key: 'smoking', label: 'Курение разрешено' },
        { key: 'party', label: 'Подходит для вечеринок' },
        { key: 'pets', label: 'Можно с животными' },
        { key: 'billiards', label: 'Бильярд' },
        { key: 'table_tennis', label: 'Настольный теннис' },
        { key: 'football_field', label: 'Футбольное поле' },
        { key: 'karaoke', label: 'Караоке' },
        { key: 'sauna', label: 'Сауна' },
        { key: 'jacuzzi', label: 'Джакузи' },
        { key: 'turkish_bath', label: 'Турецкая баня' },
        { key: 'indoor_swimming_pool', label: 'Крытый бассейн' },
        { key: 'outdoor_swimming_pool', label: 'Открытый бассейн' },
        { key: 'playstation_5', label: 'PlayStation 5' },
        { key: 'playstation_4', label: 'PlayStation 4' },
        { key: 'playstation_3', label: 'PlayStation 3' },
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
                {imageFields.map((uri: string, index: number) => (
                    <Image key={index} source={{ uri }} style={styles.image} />
                ))}
            </ScrollView>

            <Text style={styles.title}>{house.name}</Text>
            <Text style={styles.description}>{house.description}</Text>

            <View style={styles.detailsBlock}>
                <Text style={styles.info}>📍 <Button title="Открыть в картах" onPress={openInMaps} />
                </Text>
                <Text style={styles.info}>📏 {house.square_meter} м²</Text>
                <Text style={styles.info}>🛏 Комнат: {house.room_count}</Text>
                <Text style={styles.info}>💰 Будни: {house.week_day_price} сум</Text>
                <Text style={styles.info}>💰 Выходные: {house.week_end_price} сум</Text>
                <Text style={styles.info}>🕐 Заезд: {house.enter_time} | Выезд: {house.exit_time}</Text>
            </View>

            <View style={styles.featuresBlock}>
                <Text style={styles.sectionTitle}>Удобства:</Text>
                {features.filter(f => house[f.key]).map((f, i) => (
                    <Text key={i} style={styles.featureItem}>• {f.label}</Text>
                ))}
            </View>

            <View style={styles.buttons}>
                <Button title="Позвонить" onPress={handleCall} />
                <Button title="Написать в WhatsApp" onPress={handleMessage} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    imageGallery: {
        marginBottom: 15,
    },
    image: {
        width: 280,
        height: 180,
        borderRadius: 12,
        marginRight: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },
    detailsBlock: {
        marginBottom: 15,
    },
    info: {
        fontSize: 15,
        marginBottom: 4,
    },
    featuresBlock: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    featureItem: {
        fontSize: 15,
        marginBottom: 3,
    },
    buttons: {
        gap: 10,
    },
});
