import { View, Text, FlatList } from 'react-native'
// IType of the loaded list: 2 = Approved, 1 = Un-Approved, 3 = Both
const RenderItem = ({ Item, RType, IType }) => {
  // console.log(Item)
  // Godown transfer user sees the Picker name, picker user sees the Party name (with the Order Id).
  // A user with all rights (or SuperUser) sees both.
  const rights = global.userRights || {}
  const isSuperUser = rights.SuperUser == 1 || rights.SuperUser === true
  const isTransferUser = isSuperUser || rights.TransferRight == 1
  const isPickerUser = isSuperUser || rights.PickingRight == 1 || rights.PickerARight == 1
  const isPartyReport = RType === 2
  // In "Both" each row carries its own status (RowIType), set by PendingOrderReport
  const rowIType = Item.item.RowIType || IType

  // Party Pending Order: Manager and Picker see Party, Order No and Picker; Warehouse staff (godown right only)
  // never see the Party. Un-Approved orders show only the Party name.
  const showParty = !!Item.item.PartyName && isPickerUser
  const showOrderNo = isPartyReport ? !!Item.item.OrderNo && rowIType !== 1 : Item.item.OrderNo !== ''
  const showPicker = !!Item.item.Picker && (isPartyReport ? rowIType !== 1 : isTransferUser)
  // Badge in "Both" (each row's own status) and in the Approved tab
  const statusLabel = !isPartyReport ? null
    : Item.item.RowIType ? (Item.item.RowIType === 2 ? 'Approved' : 'Un-Approved')
    : IType === 2 ? 'Approved' : null
  return (

    <View style={{}}>
      <View style={{ flexDirection: 'row' }}>
        {Item.item.OrderNo == '' && Item.item.ItemName ? <Text style={{ fontSize: 15, fontWeight: '700', padding: 5 }}> {Item.item.ItemName}  </Text> : null}
        {showOrderNo ? <Text style={{ fontSize: 15, fontWeight: '700', padding: 5, }}> {'( ' + Item.item.OrderNo + ' )'}  </Text> : null}
        {statusLabel ? <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff', backgroundColor: statusLabel === 'Approved' ? 'green' : '#E65100', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, margin: 5, overflow: 'hidden' }}>{statusLabel}</Text> : null}
      </View>
      {/* "Both" rows come grouped by party with an empty OrderNo, so don't depend on OrderNo here */}
      {showParty ?
        <Text style={{ fontSize: 14, fontWeight: '600', paddingHorizontal: 10, paddingBottom: 5, color: '#1565C0' }}>Party: {Item.item.PartyName}</Text> : null}
      {showPicker ?
        <Text style={{ fontSize: 14, fontWeight: '600', paddingHorizontal: 10, paddingBottom: 5, color: 'green' }}>Picker: {Item.item.Picker}</Text> : null}
      <View style={{ flexDirection: 'row', backgroundColor: '#000' }}>
        <Text style={{ padding: 5, color: '#fff', width: 100, borderRightWidth: 1, borderRightColor: '#fff' }}>Color</Text>
        <Text style={{ padding: 5, color: '#fff', width: 80, borderRightWidth: 1, borderRightColor: '#fff' }}>Total Qty</Text>
        <View style={{ minWidth: 300 }}>
          <Text style={{ padding: 5, color: '#fff', width: 'auto', borderRightColor: '#fff', }}>Size/Qty</Text>
        </View>


      </View>
      <View>

        <FlatList data={Item.item.IColorDT}
          renderItem={({ item }) => {
            return (
              <View style={{ flexDirection: 'row' }}>
                {/* <Text style={{width:150,padding:5,borderRightWidth:1,borderBottomWidth:1,}}>{Item.item.ItemName}</Text> */}

                <Text style={{ width: 100, padding: 5, borderRightWidth: 1, borderBottomWidth: 1 }}>{item.Color}</Text>
                <Text style={{ width: 80, padding: 5, borderRightWidth: 1, borderBottomWidth: 1 }}>{item.Qty}</Text>


                <View style={{ alignItems: 'baseline', flexDirection: 'row', minWidth: 300, borderBottomWidth: 1 }}  >
                  <FlatList data={item.SizeDT}
                    horizontal={true}
                    renderItem={({ item }) => {
                      sizeQty = item.Size + '/' + item.CQty + ' ,'
                      if (item.CQty > 1) {
                        return (
                          <View style={{}}>
                            <Text style={{ color: '#000', padding: 5, fontWeight: '600', color: 'red' }} >{sizeQty} </Text>
                          </View>

                        )
                      } else {
                        return (
                          <View>

                            <Text style={{ color: '#000', padding: 5, fontWeight: '600', color: 'red' }} >{item.Size + ', '}</Text>

                          </View>
                        )
                      }
                    }}
                  />

                </View>
              </View>
            )
          }} />


      </View>

    </View>
  )
}
export default RenderItem