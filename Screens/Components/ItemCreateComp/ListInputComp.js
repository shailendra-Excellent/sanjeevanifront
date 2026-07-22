import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const ListInputComp = ({sty,Value,setValue,keyBorder}) => {
  return (
    <TextInput style={sty} value={Value} 
    keyboardType={keyBorder?keyBorder:'default'}
    onChangeText={(text)=>{
      setValue(text)  
    }}
    />
  )
}

export default ListInputComp

const styles = StyleSheet.create({})