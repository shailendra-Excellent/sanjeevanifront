import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const BtnComp = ({Value,setValue}) => {
  return (
    <View >
      <Text style={{fontWeight:'700',fontSize:15,color:'#fff'}}>{Value}</Text>
    </View>
  )
}

export default BtnComp

const styles = StyleSheet.create({})