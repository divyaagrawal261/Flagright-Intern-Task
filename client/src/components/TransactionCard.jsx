import React from "react";

const TransactionCard = ({txn}) =>{
    return (<div key={txn.transaction?.id || idx} className='bg-gray-800 p-4 rounded-lg shadow-md text-white'>
              <h3 className='text-lg font-semibold mb-2'>Transaction ID: {txn.transaction?.id}</h3>
              <p className='text-sm mb-1'><span className='font-semibold'>Amount:</span> {txn.transaction?.amount}</p>
              <p className='text-sm mb-1'><span className='font-semibold'>IP:</span> {txn.transaction?.ip}</p>
              <p className='text-sm mb-1'><span className='font-semibold'>Device ID:</span> {txn.transaction?.deviceId}</p>
              <div className='mt-2 p-2 rounded bg-gray-700'>
                <div className='font-semibold text-blue-300'>Sender</div>
                <p className='text-xs'>Name: {txn.sender?.name}</p>
                <p className='text-xs'>Email: {txn.sender?.email}</p>
              </div>
              <div className='mt-2 p-2 rounded bg-gray-700'>
                <div className='font-semibold text-green-300'>Receiver</div>
                <p className='text-xs'>Name: {txn.receiver?.name}</p>
                <p className='text-xs'>Email: {txn.receiver?.email}</p>
              </div>
            </div>)
}

export default TransactionCard;