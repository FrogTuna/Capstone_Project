import { useState, useEffect }  from "react";
import * as React from 'react';
import { ActivityIndicator, RefreshControl, Button, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity,View,Icon,Image } from "react-native";
import 'react-native-gesture-handler';
import { set } from "react-native-reanimated";

function getDate() {
  var today = new Date();
  var dd_today = String(today.getDate()).padStart(2, '0');
  var mm_today = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy_today = today.getFullYear();

  var past = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000) 
  var dd_past = String(today.getDate()).padStart(2, '0');
  var mm_past = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy_past = today.getFullYear();

  today = yyyy_today + '-' + mm_today + '-' + dd_today;
  past = yyyy_past + '-' + mm_past + '-' + dd_past;
  return [past, today]
}

export default function Home ( {navigation} ) {

  const [final, setfinal] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [request, setRequest] = useState({
    shift: null,
    discount: []
  })
  async function setUp(){
    await fetchUser()
    await fecthDiscount()
    await setLoading(false)
  }
  async function fetchUser(){
    const responseUser = await fetch(`https://my.tanda.co/api/v2/users/me`,{
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('tokenType')+ ' ' +localStorage.getItem('token')}})
    const user = await responseUser.json()   
    localStorage.setItem('user', JSON.stringify(user))   
  }

  async function fecthDiscount(){
    const response = await fetch(`https://my.tanda.co/api/v2/platform/discounts`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('tokenType')+ ' ' +localStorage.getItem('token')
      },
    })

      var shift = await fecthClock()
      const discount = await response.json()

      if(shift === false)
      {
      
        const offDiscount = await discount.filter((item) =>{
          return item.onshift === false
        })     
        setRequest({
          shift: false,
          discount: offDiscount
        })
      }
      else if(shift == true)
      {
        const onDiscount = await discount.filter((item) =>{
          return item.onshift === true
        })  
        setRequest({
          shift: true,
          discount: onDiscount
        })  
      }  
      
  }
  
  async function fecthClock(){
    const user = JSON.parse(localStorage.getItem('user'))   
    const past = getDate()[0]
    const today = getDate()[1]
    const responseClock = await fetch(`https://my.tanda.co/api/v2/clockins` + 
    `?user_id=${user.id}&from=${past}&to=${today}` ,{
      method: "GET",
      headers: {Authorization: localStorage.getItem('tokenType')+ ' ' +localStorage.getItem('token')}})
    const clock = await responseClock.json()
       
    if (clock.length > 0) {
      const t = clock[clock.length - 1].type
      if (t !== 'finish') {
        return true       
      } else {
        return false    
      }
    } else {
      return false     
    }
  }

  useEffect(()=>{  
    setUp()
  },[])

  
  const onRefresh = React.useCallback(async () => {
    await setRefreshing(true);
    await fecthDiscount()
    await setRefreshing(false)
  }, []);

  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Discount Details', item)} style={[styles.item, backgroundColor]}>
      <Text style={[styles.title, textColor]}>{item.name} {item.value} </Text>
    </TouchableOpacity>
  );

  const [selectedId, setSelectedId] = useState(null);

  const renderItem = ({ item, index }) => {
    const backgroundColor = index === selectedId ? '#45B8DB' : '#45B8DB';
    const color = index === selectedId ? 'white' : 'white';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(index)}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };
  if (loading !== true){
 
  return (   
    <SafeAreaView style={styles.container}>       
      {request.shift?  
        <View style={styles.clockin}>                
            <Text title="clocked in" style={{fontSize: 20, color: 'white', fontWeight: 'bold'}} >
                clocked in
            </Text>                  
        </View>:   
        <View style={styles.clockout}>              
            <Text title="clocked out" style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>
                clocked out
            </Text>      
        </View>
      }         
      <FlatList
        data={request.discount}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}               
        style={{marginVertical: 25}}  
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }  
      /> 
   
    </SafeAreaView>)
  }
  else {
    return (
    <View style={[styles.container, styles.horizontal]}>      
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
    )
  }
  
  
};
const styles = StyleSheet.create({
  container: {
    flex: 1,    
    backgroundColor: '#F5F3F3',
    
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  item: {
    padding: 20,
    marginVertical: 18,
    marginHorizontal: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  title: {
    fontSize: 30,
   
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockin: {
    marginTop: 18,
    marginLeft: 15,
    padding: 6,
    color: "white",
    alignSelf:  "flex-start",
    backgroundColor: "green",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  clockout: {
    marginTop: 18,
    marginLeft: 15,
    padding: 6,
    color: "white",
    alignSelf:  "flex-start",
    backgroundColor: "red",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  
  logoutButton: {
    marginTop: 200,
    alignItems: "center",
    backgroundColor: "#E3310E",
    padding: 10,   
    flexDirection: 'row',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
});