import React, { useEffect, useState } from "react";
import { View, Image, Text, BackHandler, Alert } from 'react-native';
import { style } from "./style";
import DefaultPreference from 'react-native-default-preference';
export const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        console.log()
        // Promise.all(
        //     [
        //         DefaultPreference.clear('Uname'),
        //         DefaultPreference.clear('Rtype'),
        //         DefaultPreference.clear('URL'),
        //         DefaultPreference.clear('Port'),
        //         DefaultPreference.clear('BaseURL')
        //     ])
        //     .then(() => { navigation.navigate('Login') })
        DefaultPreference.get('BaseURL').then(function (url) {
            DefaultPreference.get('Uname').then(function (uname) {
                DefaultPreference.get('Password').then(function (Password) {
                    DefaultPreference.get('tokenId').then(function (Token) {
                        DefaultPreference.get('CompCode').then(function (CompCode) {
                            DefaultPreference.get('tokenId').then(function (Token) {

                                global.Fy = '2026'
                                      DefaultPreference.get('Rtype').then(function (Rtype) {
                                    if (url == ' ' || url == null) {
                                        // -------------------As Per Client Requirement set IP Adress  
                                        DefaultPreference.set('URL', 'http://160.30.207.113');
                                        DefaultPreference.set('Port', '8877');
                                        DefaultPreference.set('BaseURL', 'http://160.30.207.113:8877');
                                        DefaultPreference.set('CompCode', 'comp0037');

                                        // -------------------As Per Our Requirement set IP Adress  
                                        // DefaultPreference.set('URL', 'http://es022078.prjapi.com');
                                        // DefaultPreference.set('Port', '80');
                                        // DefaultPreference.set('BaseURL', 'http://es022078.prjapi.com:80');
                                        // DefaultPreference.set('CompCode', 'comp0939');
                                        // -------------------As Per Client CLub Merino Requirement set IP Adress  
                                        // DefaultPreference.set('URL', 'http://103.117.156.43');
                                        // DefaultPreference.set('Port', '1865');
                                        // DefaultPreference.set('BaseURL', 'http://103.117.156.43:1865');
                                        // DefaultPreference.set('CompCode', 'comp0019');

                                        DefaultPreference.set('FY', '2025');
                                        global.Fy = '2025'

                                        setTimeout(() => {
                                            navigation.replace('Login');
                                            // navigation.replace('ServerInfo');
                                        }, 4000);
                                    } else {
                                        if (uname == '' || uname == null) {
                                            setTimeout(() => {
                                                global.Fy = '2025'
                                                navigation.replace('Login');
                                            }, 4000);
                                        } else {
                                            ValidateUserAPI(url, uname, Password, Token, CompCode)
                                            // setTimeout(() => {
                                            //     ValidateUserAPI()
                                            //     global.Fy = '2024'
                                            //     navigation.replace('UserRightsPage', { exitid: 0 })
                                            // }, 4000);
                                        }
                                    }
                                });
                            });
                        });
                    });
                })
            });
        })

    }, [])

    const ValidateUserAPI = async (BaseURL, UserName, password, Token, Compcode) => {
        try {
            if (UserName == '' || UserName == null) {
                Alert.alert('', 'Please Enter User Name and Password')
            } else {
                // setIsloading(true);
                console.log(BaseURL + '/api/Values/ValidateUser?UName=' + UserName.trim() + '&Pass=' + password.trim() + '&CompCode=' + Compcode + '&FY=' + global.Fy)
                const res = await fetch(BaseURL + '/api/Values/ValidateUser?UName=' + UserName.trim() + '&Pass=' + password.trim() + '&CompCode=' + Compcode + '&FY=' + global.Fy);
                const Response = await res.json();
                // setIsloading(false);
                if (Response.Validate == true) {
                    DefaultPreference.set('Uname', UserName);
                    DefaultPreference.set('McCode', Response.Data.IgrpCode.toString())
                    DefaultPreference.set('McName', Response.Data.IgrpName);
                    DefaultPreference.set('Password', password);

                    let obj = {
                        SuperUser: Response.Data.SuperUser,
                        OrdRight: Response.Data.OrdRight,
                        OrdCRight: Response.Data.OrdCRight,
                        PickerARight: Response.Data.PickerARight,
                        TransferRight: Response.Data.TransferRight,
                        PickingRight: Response.Data.PickingRight,
                    }
                    DefaultPreference.set('RightsType', JSON.stringify(obj));
                                navigation.replace('UserRightsPage')

                    if (Token) {
                        try {
                            const res = await fetch(BaseURL + '/api/values/UpdateUserTokenID?User=' + UserName + '&TokanID=' + Token + '&UType=1' + '&CompCode=' + Compcode + '&FY=' + Fy);
                            const result = await res.json() //{"Msg": "Success", "Status": 1}

                            if (result.Status == 1) {
                                navigation.replace('UserRightsPage')

                            } else {
                                Alert.alert(result.Msg);
                            }
                        } catch (e) {
                            Alert.alert('catch error', e.message)
                        }
                    }
                } else {
                    Alert.alert('', 'Invalid user')

                }
            }
        } catch (e) {
            // setIsloading(false)
            Alert.alert(e.message)
        }

    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
            {/* <Image  source={require('../Screens/Images/ClubMerinoLogo.jpg')} style={{height:150,width:150}}/>  */}
            <Image source={require('../Screens/Images/SanjeevaniLogo.png')} style={{ height: 150, width: 150 }} />

        </View>
    )
}