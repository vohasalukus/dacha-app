// app/HomePage.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    FlatList,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    ActivityIndicator,
    Button,
    RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import FilterModal from './FilterModal';
import {PublicHouse, usePublicHousesStore} from '../store/publicHousesStore';
import { useFilterStore } from '../store/filterStore';


// Сопоставление boolean-полей модели и читабельных названий тегов
const FEATURE_LABELS: Record<string, string> = {
    alcohol: 'Алкоголь',
    available_only_family: 'Только для семей',
    loudly_music: 'Громкая музыка',
    party: 'Вечеринки',
    pets: 'Питомцы',
    smoking: 'Курение',
    wifi: 'Wi-Fi',
    playstation_5: 'PlayStation 5',
    playstation_4: 'PlayStation 4',
    playstation_3: 'PlayStation 3',
    air_conditioner: 'Кондиционер',
    billiards: 'Бильярд',
    table_tennis: 'Настольный теннис',
    football_field: 'Футбольное поле',
    karaoke: 'Караоке',
    sauna: 'Сауна',
    jacuzzi: 'Джакузи',
    turkish_bath: 'Турецкая баня',
    indoor_swimming_pool: 'Бассейн (внутри)',
    outdoor_swimming_pool: 'Бассейн (снаружи)',
};

export default function HomePage() {
    const navigation = useNavigation();
    const { houses, fetchApprovedHouses } = usePublicHousesStore();

    // Фильтры из стора
    const {
        searchQuery,
        wifi, sauna, pool, billiards,
        alcohol, smoking, party, pets, available_only_family,
        playstation_3, playstation_4, playstation_5,
        air_conditioner, table_tennis, football_field,
        karaoke, jacuzzi, turkish_bath,
        indoor_swimming_pool, outdoor_swimming_pool,
        minPrice, maxPrice, region, district, city, country,
        set: setFilter
    } = useFilterStore();


    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [likedIds, setLikedIds] = useState<Set<number>>(new Set());


    // Загрузка домов
    useEffect(() => {
        (async () => {
            setLoading(true);
            await fetchApprovedHouses();
            setLoading(false);
        })();
    }, [fetchApprovedHouses]);

    // Обновление
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchApprovedHouses();
        setRefreshing(false);
    };

    if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;

    // Фильтрация
    const norm = (searchQuery ?? '').trim().toLowerCase();
    const filteredHouses = houses.filter(h => {
        const textOK =
            norm === '' ||
            (h.name || '').toLowerCase().includes(norm) ||
            (h.description || '').toLowerCase().includes(norm) ||
            (h.city || '').toLowerCase().includes(norm) ||
            (h.region || '').toLowerCase().includes(norm);

        const featuresOK =
            // основные удобства
            (!wifi                  || h.wifi) &&
            (!sauna                 || h.sauna) &&
            (!pool                  || h.indoor_swimming_pool || h.outdoor_swimming_pool) &&
            (!billiards             || h.billiards) &&
            // остальные булевы фильтры
            (!alcohol               || h.alcohol) &&
            (!smoking               || h.smoking) &&
            (!party                 || h.party) &&
            (!pets                  || h.pets) &&
            (!available_only_family || h.available_only_family) &&
            (!playstation_3         || h.playstation_3) &&
            (!playstation_4         || h.playstation_4) &&
            (!playstation_5         || h.playstation_5) &&
            (!air_conditioner       || h.air_conditioner) &&
            (!table_tennis          || h.table_tennis) &&
            (!football_field        || h.football_field) &&
            (!karaoke               || h.karaoke) &&
            (!sauna                 || h.sauna) &&           // можно удалить дублирование
            (!jacuzzi               || h.jacuzzi) &&
            (!turkish_bath          || h.turkish_bath) &&
            (!indoor_swimming_pool  || h.indoor_swimming_pool) &&
            (!outdoor_swimming_pool || h.outdoor_swimming_pool);


        const price = h.week_day_price;
        const priceOK =
            (!minPrice || price >= Number(minPrice)) &&
            (!maxPrice || price <= Number(maxPrice));

        const regionOK = !region || (h.region || '').toLowerCase() === region.toLowerCase();
        const districtOK = !district || (h.district || '').toLowerCase() === district.toLowerCase();
        const cityOK = !city || (h.city || '').toLowerCase() === city.toLowerCase();
        const countryOK = !country || (h.country || '').toLowerCase() === country.toLowerCase();

        return textOK && featuresOK && priceOK && regionOK && districtOK && cityOK && countryOK;
    });

    // Рендер элемента
    const renderItem = ({ item }: { item: PublicHouse }) => {
        const featureTags = (Object.entries(item as Record<string, any>))
            .filter(([key, val]) => typeof val === 'boolean' && val && FEATURE_LABELS[key])
            .map(([key]) => FEATURE_LABELS[key]);
        const visibleTags = featureTags.slice(0, 3);
        const extraCount = featureTags.length - visibleTags.length;
        const isLiked = likedIds.has(item.id);

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('HouseDetail', { id: item.id })}
            >
                <ImageBackground
                    source={{ uri: item.image1 }}
                    style={styles.image}
                    imageStyle={styles.imageRadius}
                    resizeMode="cover"
                >
                </ImageBackground>
                <View style={styles.content}>
                    <Text style={styles.title}>{item.name}</Text>
                    <View style={styles.row}>
                        <Ionicons name="star" size={16} color="#f1c40f" />
                        <Text style={styles.rating}>5</Text>
                        <Ionicons
                            name="location-outline"
                            size={16}
                            color="#888"
                            style={{ marginLeft: 10 }}
                        />
                        <Text style={styles.location}>{item.region}</Text>
                    </View>
                    <Text style={styles.price}>{item.week_day_price} UZS/ночь</Text>
                    <Text numberOfLines={2} style={styles.description}>
                        {item.description}
                    </Text>
                    <View style={styles.tagsRow}>
                        {visibleTags.map((tag, i) => (
                            <View key={i} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                        {extraCount > 0 && (
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>+{extraCount}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Поиск дачи..."
                value={searchQuery}
                onChangeText={text => setFilter({ searchQuery: text })}
            />
            <Button title="Фильтры" onPress={() => setShowFilter(true)} />
            <FilterModal visible={showFilter} onClose={() => setShowFilter(false)} />
            <FlatList
                data={filteredHouses}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9', padding: 12 },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: 12,
        overflow: 'hidden',
        elevation: 2,
    },
    image: {
        width: '100%',
        aspectRatio: 16 / 9,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    imageRadius: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    heartIconTouchable: {
        margin: 8,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 16,
        padding: 6,
    },
    content: {
        padding: 14,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    rating: {
        fontSize: 14,
        marginLeft: 6,
        color: '#555',
    },
    location: {
        fontSize: 14,
        marginLeft: 6,
        color: '#555',
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0066cc',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#777',
        marginBottom: 10,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#eee',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginRight: 6,
        marginBottom: 6,
    },
    tagText: {
        fontSize: 12,
        color: '#555',
    },
});
