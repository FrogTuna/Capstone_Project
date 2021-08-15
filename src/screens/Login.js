import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import {Button, Icon, Input} from "react-native-elements";

function Login({navigation}) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function DoLogin(){
     
    fetch(`https://my.tanda.co/api/oauth/token`,{
     method: "POST",
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       username:"zouweiran9122@gmail.com",
       password:"123456789",
       scope:"me user device platform",
       grant_type:"password"
     })
   })
   .then(res=>res.json())
   .then(data=>{  
      try{     
        console.log(data) 
        if (data.error){
          setError(data.error)
        }   
        else {          
          localStorage.setItem('token', data.access_token)
          localStorage.setItem('tokenType', data.token_type) 
          setError(false)      
          navigation.navigate("HomeTabs") 
        }               
      }
      catch(err)
      {
        console.log(err)
        
      }
    })
    
   
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
      <Text style={styles.Text1}>TANDA</Text>
      <Text style={styles.Text2}>Discount</Text>
      <Text style={styles.Text3}>Discovery</Text>      
      </View >
      <View style={styles.main}>
        <Input style={styles.username}
          placeholder='Username'
          placeholderTextColor="white"
          containerStyle={{width:350, color:"white"}}
          inputStyle={{color:"white", fontSize:16}}
          label="Username"
          labelStyle={{color:"white"}}
          value={username}
          onChangeText={value => setUsername(value)}
        />
        <Text></Text>
        <Input style={styles.password}
          placeholderTextColor="white"
          placeholder='Password'
          containerStyle={{width:350, color:"white"}}
          inputStyle={{color:'white', fontSize:16}}
          label="Password"
          labelStyle={{color:"white"}}
          value={password}
          onChangeText={value => setPassword(value)}
          secureTextEntry={true}
          underlineColorAndroid="white"
          errorStyle={{ color: 'red' }}
        />
      </View>
      <View style={styles.button}>
        <Button title="Login" onPress={DoLogin} />
          
        
      </View>
    </View>
  ); 
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#45B8DB',   
  },
  header:{
    marginTop: 90,
  },
  Text1:{
    position:"relative",
    fontWeight:"bold",
    color:"royalblue",
    left:250,
    fontSize:30,
    fontFamily:"Arial",
    fontWeight: "bold"
  },
  Text2:{
    position:"relative",
    color:"white",
    top:60,
    left:20,
    fontSize:50,
    fontFamily:"Arial",
    fontWeight: "bold"
  },
  Text3:{
    position:"relative",
    color:"white",
    top:140,
    left:120,
    fontSize:50,
    fontFamily:"Arial",
    fontWeight: "bold"
  },
  main:{
    position:"relative",
    top:220,
    left:20,
  },
  username:{
    borderBottomColor:'white',
    borderBottomWidth: 1.5 
  },
  password:{
    borderBottomColor:'white',
    borderBottomWidth: 1.5 
  },
  button:{
    position:"relative",
    top: 250,
    paddingLeft:70,
    paddingRight:70
  },

});
