import React, { useEffect, useState } from 'react';
import {
    View, TextInput, FlatList, Text, StyleSheet, Image,
    TouchableOpacity, ActivityIndicator, Button
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {usePublicHousesStore} from "@/store/publicHousesStore";
import {useFilterStore} from "@/store/filterStore";
import FilterModal from './FilterModal';
import { RefreshControl } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function HomePage() {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [refreshing, setRefreshing] = useState(false);



    const onRefresh = async () => {
        setRefreshing(true);
        await fetchApprovedHouses();
        setRefreshing(false);
    };

    useEffect(() => {
        AsyncStorage.setItem('debug-test', 'работает');
        AsyncStorage.getItem('debug-test').then(value => {
            console.log('🧪 AsyncStorage работает:', value);
        });
    }, []);


    const { houses, fetchApprovedHouses } = usePublicHousesStore();
    const {
        wifi, sauna, pool, billiards,
        minPrice, maxPrice,
        region, district, city, country
    } = useFilterStore();

    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredHouses = houses.filter(h => {
        const matchesText =
            normalizedQuery === '' || (
                (h.name || '').toLowerCase().includes(normalizedQuery) ||
                (h.description || '').toLowerCase().includes(normalizedQuery) ||
                (h.city || '').toLowerCase().includes(normalizedQuery) ||
                (h.region || '').toLowerCase().includes(normalizedQuery)
            );

        const price = h.week_day_price || 0;
        const priceOK =
            (!minPrice || price >= Number(minPrice)) &&
            (!maxPrice || price <= Number(maxPrice));

        const regionOK = region === '' || (h.region || '').toLowerCase() === region.toLowerCase();
        const districtOK = district === '' || (h.district || '').toLowerCase() === district.toLowerCase();
        const cityOK = city === '' || (h.city || '').toLowerCase() === city.toLowerCase();
        const countryOK = country === '' || (h.country || '').toLowerCase() === country.toLowerCase();

        const featureOK =
            (!wifi || !!h.wifi) &&
            (!sauna || h.sauna === true) &&
            (!pool || h.indoor_swimming_pool === true || h.outdoor_swimming_pool === true) &&
            (!billiards || h.billiards === true);
        // console.log('wifi фильтр:', wifi, 'в доме:', h.name, h.wifi);

        return matchesText && priceOK && regionOK && districtOK && cityOK && countryOK && featureOK;
    });

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                await fetchApprovedHouses();
            } catch (err) {
                console.error('Ошибка загрузки домов:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Поиск дачи..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <Button title="Фильтры" onPress={() => setShowFilter(true)} />
            <FilterModal visible={showFilter} onClose={() => setShowFilter(false)} />

            <FlatList
                data={filteredHouses}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('HouseDetail', { id: item.id })}
                    >
                        {item.image1 ? (
                            <Image source={{ uri: item.image1 }} style={styles.houseImage} />
                        ) : (
                            <View style={[styles.houseImage, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
                                <Text>Нет фото</Text>
                            </View>
                        )}
                        <View style={styles.cardContent}>
                            <Text style={styles.houseName}>{item.name}</Text>
                            <Text numberOfLines={2} style={styles.houseDescription}>{item.description}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#f9f9f9' },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
        overflow: 'hidden',
    },
    houseImage: {
        width: 120,
        height: 120,
    },
    cardContent: {
        flex: 1,
        padding: 10,
    },
    houseName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    houseDescription: {
        color: '#777',
    },

});
