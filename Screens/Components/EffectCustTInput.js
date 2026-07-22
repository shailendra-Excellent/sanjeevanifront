import React from "react";
import { View } from "react-native";
import { Hoshi } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
const EffectiveTextInput=({maxLength,Value,setValue,placeHolder,type,testID,textContentType,keyboardType})=>{
    return(
        <View style={{alignItems:'center'}}>
          
            <Hoshi
            testID={testID}
            maxLength={maxLength}
            textContentType={textContentType}
            keyboardType={keyboardType}
    label={placeHolder}
    style={{padding:5,borderBottomWidth:1,width:'95%'}}
    // placeholder={type}
    iconClass={FontAwesomeIcon}
    iconName={'pencil'}
    iconColor={'#000'}
    inputPadding={16}
    labelHeight={30}
    // active border height
    borderHeight={1}
    // TextInput props
    autoCapitalize={'none'}
    autoCorrect={false}
    onChangeText={(text)=>{
      setValue(text)
    }}
  />
</View>
    )
}
export default EffectiveTextInput