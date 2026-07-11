import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

/**
 * Owns the full lifecycle of a user's expenses: initial fetch plus
 * create/update/delete, each of which patches local state directly from
 * the row Supabase hands back so the UI (list + monthly total) updates
 * the instant an operation succeeds, with no extra round trip.
 */
export function useExpenses(userId) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchExpenses = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setExpenses(data)
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const addExpense = useCallback(
    async ({ title, amount, category, date }) => {
      const { data, error: insertError } = await supabase
        .from('expenses')
        .insert({
          user_id: userId,
          title: title.trim(),
          amount: Number(amount),
          category,
          date,
        })
        .select()
        .single()

      if (insertError) throw insertError

      setExpenses((current) => sortExpenses([data, ...current]))
      return data
    },
    [userId]
  )

  const updateExpense = useCallback(
    async (id, { title, amount, category, date }) => {
      // Scoping to user_id is redundant with the RLS policy, but keeping it
      // explicit here means the query is safe on its own terms even if RLS
      // were ever misconfigured — defense in depth, not a substitute for it.
      const { data, error: updateError } = await supabase
        .from('expenses')
        .update({
          title: title.trim(),
          amount: Number(amount),
          category,
          date,
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (updateError) throw updateError

      setExpenses((current) => sortExpenses(current.map((item) => (item.id === id ? data : item))))
      return data
    },
    [userId]
  )

  const deleteExpense = useCallback(
    async (id) => {
      const { error: deleteError } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      if (deleteError) throw deleteError

      setExpenses((current) => current.filter((item) => item.id !== id))
    },
    [userId]
  )

  return { expenses, loading, error, addExpense, updateExpense, deleteExpense, refetch: fetchExpenses }
}

function sortExpenses(list) {
  return [...list].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1
    return new Date(b.created_at) - new Date(a.created_at)
  })
}
