import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import HomePage from "@/app/index";
import ProfileScreen from "@/app/profile";
import {createStackNavigator} from "@react-navigation/stack";
import HouseDetailScreen from "@/app/houses/[id]";
import AddHouseScreen from "@/app/add";
import {Button} from "react-native";
import LoginScreen from "@/app/login";
import RegisterScreen from "@/app/register";
import { useAuthStore } from '../store/authStore';
import ModerationScreen from "@/app/moderation";
import FavoritesScreen from '@/app/FavoritesScreen';



const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()


function AuthButton({ navigation }: { navigation: any }) {
    const user = useAuthStore(s => s.user);
    const logout = useAuthStore(s => s.logout);

    if (user) {
        return (
            <Button
                title="Выйти"
                onPress={() => {
                    logout();
                    navigation.navigate('MainTabs', { screen: 'Home' });
                }}
            />
        );
    } else {
        return (
            <Button
                title="Войти"
                onPress={() => navigation.navigate('Login')}
            />
        );
    }
}

function StackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomePage}
                options={({ navigation }) => ({
                    title: 'Главная',
                    headerLeft: () => <AuthButton navigation={navigation} />,
                })}
            />
            <Stack.Screen name="HouseDetail" component={HouseDetailScreen} />
            <Stack.Screen name="AddHouse" component={AddHouseScreen} />
            <Stack.Screen name="Moderation" component={ModerationScreen} options={{ title: 'Модерация' }} />
        </Stack.Navigator>
    );
}

export default function UserNavigation() {
    return (

        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Корневой Stack:*/}
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>

    );
}

const MainTabs = () =>{
    return(

        <Tab.Navigator initialRouteName={"Home"}>
            <Tab.Screen name="Home" component={StackNavigator} options={{headerShown: false}}/>
            <Tab.Screen name="Profile" component={ProfileScreen}/>
        </Tab.Navigator>

    )
}



