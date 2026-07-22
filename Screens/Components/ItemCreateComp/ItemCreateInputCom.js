import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Hoshi } from 'react-native-textinput-effects';

const ItemCreateInputCom = ({lable,Value,setValue,keyBorder}) => {
  return (
    // <View>
       <Hoshi
                label={lable}
                borderColor={'gray'}
                value={Value}
                keyboardType={keyBorder}
                borderHeight={1}
                inputPadding={16}
                backgroundColor={'#fff'}
                style={{width:'90%'}}
                onChangeText={(text) => {
                    setValue(text)
                }}
            />
    // </View>
  )
}

export default ItemCreateInputCom

const styles = StyleSheet.create({})