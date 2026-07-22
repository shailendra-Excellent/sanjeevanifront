// // import { View ,Text,StyleSheet} from 'react-native';
// // // import { QRScannerView } from 'react-native-qrcode-sanner-view';
// // // import {QRScannerView} from 'react-native-qrcode-scanner-view'
// // import { Camera, useScanBarcodes } from 'react-native-vision-camera';
// // export default  DefaultScreen=()=> {

// //     const renderTitleBar = () => <Text style={{color:'white',textAlign:'center',padding:16}}>Title</Text>
// //     const renderMenu = () => <Text style={{color:'white',textAlign:'center',padding:16}}>Menu</Text>
// //     const barcodeReceived = (event) => { console.log('Type: ' + event.type + '\nData: ' + event.data) };
   
// //         return (
// //            <View style={{flex:1}}>
// //              <Camera
// //       style={StyleSheet.absoluteFill}
// //       device={device}
// //       isActive={true}
// //     />
// //             {/* < QRScannerView
// //                 onScanResult={barcodeReceived }
// //                 renderHeaderView={renderTitleBar }
// //                 renderFooterView={renderMenu }
// //                 scanBarAnimateReverse={ true }/> */}
// //            </View>
// //         )
  
// // }
// import React, { useState } from 'react';
// import { Camera, useScanBarcodes } from 'react-native-vision-camera';
// import { BarcodeFormat } from 'vision-camera-code-scanner';

// const scanner = () => {
// const [barcodes, setBarcodes] = useState([]);

// const scanBarcodes = useScanBarcodes({
// format: [BarcodeFormat.QR_CODE],
// });

// scanBarcodes.subscribe((barcodes) => {
// setBarcodes(barcodes);
// });

// return (
// <Camera
// style={{ width: 200, height: 200 }}
// onFrameCaptured={(frame) => {
// scanBarcodes(frame);
// }}
// />
// );
// };
// export default scanner