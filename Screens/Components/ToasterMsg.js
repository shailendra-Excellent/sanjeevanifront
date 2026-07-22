import Toast from "react-native-root-toast";
const ToasterMsg=({msg})=>{
    Toast.show(msg, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      
    }); 
}
export default ToasterMsg