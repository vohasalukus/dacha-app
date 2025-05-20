import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Link, useNavigation} from 'expo-router';
import { useRouter } from 'expo-router';

import { summerHouses } from '../data/mockData';

const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
// Изменяем состояние каждый раз, когда пользователь начинает искать что-то и перерисовывается все это через setSearchQuery

    const filteredHouses = summerHouses.filter(house =>
        house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        house.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
// Фильтруем те значения которые нам нужны и уже при помощи setSQ идет поиск по данным, правда с API делается чуть по другому
    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            {/*View - это как div в html*/}

            <TextInput
                style={styles.searchInput}
                placeholder="Поиск дачи..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/*TextInput - для ввода данных*/}
            {/*value - хранит то, что храниться в переменной sq (ищет)*/}
            {/*onChangeText - начинает работать, когда пользователь начинает менять инфу в input и передает все это setSQ (отрисовывает)*/}
            {/* То есть:
                1. У тебя searchQuery = ""

                2. Пользователь вводит "д"

                3. Срабатывает onChangeText, вызывается setSearchQuery("д")

                4. Обновляется searchQuery = "д"

                5. Поле снова перерисовывается с новым значением — и ты видишь букву "д"
            */}

            {/* List of summer houses */}
            <FlatList
                data={filteredHouses}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('HouseDetail', { id: item.id })}  // Переход на подробности дачи
                    >
                        <Image source={{ uri: item.imageUrl }} style={styles.houseImage} />
                        <View style={styles.cardContent}>
                            <Text style={styles.houseName}>{item.name}</Text>
                            <Text style={styles.houseDescription}>{item.description}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
            />
        {/*    Это главная страница!!!!!*/}

        {/*  FlatList - отлично подходит для рендера списков  */}
        {/*  data={filteredHouses} — список отфильтрованных дач  */}
        {/*  renderItem={({ item }) => (...)} — как отображать каждую карточку (item — это один объект дачи)  */}
        {/*  keyExtractor={item => item.id} — обязательный параметр для уникального ключа (иначе будут warning'и) */}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
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
        borderRadius: 10,
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

export default HomePage;
