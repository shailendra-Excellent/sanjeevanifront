import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const LoaderComp = () => {
  return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <ActivityIndicator size={20}  />
      <Text>Please ...</Text>
    </View>
  )
}

export default LoaderComp

const styles = StyleSheet.create({})