'use client'

import { removeMember, updateMemberRole } from './actions'
import { useState } from 'react'

export function MembersList({ 
  members, 
  currentUserRole,
  accountId
}: { 
  members: any[]
  currentUserRole: string
  accountId: string
}) {
  const isAdmin = currentUserRole === 'admin' || currentUserRole === 'owner'
  const [processingId, setProcessingId] = useState<string | null>(null)

  async function handleRoleChange(userId: string, newRole: string) {
    setProcessingId(userId)
    const formData = new FormData()
    formData.append('accountId', accountId)
    formData.append('userId', userId)
    formData.append('role', newRole)
    
    await updateMemberRole(formData)
    setProcessingId(null)
  }

  async function handleRemove(userId: string) {
    if (!confirm('Are you sure you want to remove this member?')) return
    
    setProcessingId(userId)
    const formData = new FormData()
    formData.append('accountId', accountId)
    formData.append('userId', userId)
    
    await removeMember(formData)
    setProcessingId(null)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-muted-foreground">
        <thead className="text-xs uppercase bg-surface/50 text-foreground">
          <tr>
            <th className="px-4 py-3 rounded-tl-md">Member</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3 rounded-tr-md">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => {
            const isOwner = member.role === 'owner'
            const isSelf = member.user_id === 'todo-check-self' // We could pass current user ID
            
            return (
              <tr key={member.user_id} className="border-b border-border">
                <td className="px-4 py-3 font-medium text-foreground flex items-center gap-3">
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt="" className="w-8 h-8 rounded-full bg-surface" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-surface/50 flex items-center justify-center text-xs font-bold text-primary">
                      {member.display_name.substring(0,2).toUpperCase()}
                    </div>
                  )}
                  {member.display_name}
                </td>
                <td className="px-4 py-3">
                  {isAdmin && !isOwner ? (
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.user_id, e.target.value)}
                      disabled={processingId === member.user_id}
                      className="bg-surface border border-border rounded-md text-sm px-2 py-1 text-foreground focus:outline-none focus:border-primary disabled:opacity-50"
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                    </select>
                  ) : (
                    <span className="capitalize">{member.role}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {isAdmin && !isOwner && (
                    <button
                      onClick={() => handleRemove(member.user_id)}
                      disabled={processingId === member.user_id}
                      className="text-red-400 hover:text-red-300 text-xs font-medium disabled:opacity-50 transition-colors"
                    >
                      {processingId === member.user_id ? 'Wait...' : 'Remove'}
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
