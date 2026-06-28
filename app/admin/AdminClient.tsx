'use client'

import Link from 'next/link'
import { Order, OrderStatus } from '@/lib/supabase'
import { TIERS } from '@/lib/tiers'

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending_payment: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  pending_approval: 'bg-purple-100 text-purple-800',
  approved: 'bg-green-100 text-green-800',
  printing: 'bg-teal-100 text-teal-800',
  shipped: 'bg-gray-100 text-gray-700',
}

export default function AdminClient({ orders }: { orders: Order[] }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Irisify — Admin</h1>
          <div className="flex items-center gap-4">
            <Link href="/admin/analytics" className="text-sm text-purple-600 hover:text-purple-800 font-medium">📊 Analytics</Link>
            <form action="/api/admin/logout" method="POST">
              <button type="submit" className="text-sm text-gray-400 hover:text-gray-600">Log out</button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {(['pending_approval', 'printing', 'shipped'] as OrderStatus[]).map(s => (
            <div key={s} className="bg-white rounded-xl p-5 border border-gray-200">
              <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${STATUS_COLORS[s]}`}>{s.replace('_', ' ')}</div>
              <div className="text-3xl font-bold">{orders.filter(o => o.status === s).length}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Order</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Tier</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">No orders yet</td>
                </tr>
              )}
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="text-gray-400 text-xs">{order.customer_email}</div>
                  </td>
                  <td className="px-4 py-3">{TIERS[order.tier]?.name ?? order.tier} <span className="text-gray-400">({TIERS[order.tier]?.size})</span></td>
                  <td className="px-4 py-3 font-medium">${(order.price_cents / 100).toFixed(0)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <a href={`/order/${order.id}/preview`} target="_blank" className="text-[#1D9E75] hover:underline text-xs">View preview</a>
                    {order.tracking_url && (
                      <a href={order.tracking_url} target="_blank" className="ml-3 text-gray-400 hover:underline text-xs">Track</a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
