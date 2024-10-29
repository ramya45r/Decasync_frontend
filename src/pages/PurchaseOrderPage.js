import React from 'react'
import PurchaseOrderForm from '../components/PurchaseOrder/PurchaseOrderForm'
import PurchaseOrderList from '../components/PurchaseOrder/PurchaseOrderList'

const PurchaseOrderPage = () => {
  return (
    <div>
      <PurchaseOrderForm/>
      <PurchaseOrderList/>
    </div>
  )
}

export default PurchaseOrderPage
